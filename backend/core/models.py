from django.db import models
from django.contrib.auth.models import User
import secrets
import hashlib

class Profile(models.Model):
    ROLE_CHOICES = [
        ('annotator', 'Annotator'),
        ('validator', 'Validator'),
        ('admin', 'Admin'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('warning', 'Warning'),
        ('suspended', 'Suspended'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='annotator')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    quality_score = models.FloatField(default=1.0) # 0.0 to 1.0
    fraud_score = models.FloatField(default=0.0)   # 0.0 to 1.0
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    
    # Advanced Telemetry
    device_model = models.CharField(max_length=255, blank=True, null=True)
    network_operator = models.CharField(max_length=255, blank=True, null=True)
    last_lat = models.FloatField(null=True, blank=True)
    last_long = models.FloatField(null=True, blank=True)
    last_seen = models.DateTimeField(auto_now=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def update_reputation(self):
        from datasets.models import DataEntry
        total = DataEntry.objects.filter(annotator=self).count()
        if total == 0:
            return

        approved = DataEntry.objects.filter(annotator=self, status='approved').count()
        rejected = DataEntry.objects.filter(annotator=self, status='rejected').count()
        
        # Quality score: ratio of approved entries
        self.quality_score = approved / (total if total > 0 else 1)
        
        # Fraud score: increased by high rejection rate or specific fraud flags
        # If rejected rate > 30%, increase fraud score
        rejection_rate = rejected / total
        if rejection_rate > 0.3:
            self.fraud_score = min(1.0, self.fraud_score + 0.1)
        
        # Auto-status update
        if self.quality_score < 0.4 or self.fraud_score > 0.6:
            self.status = 'suspended'
        elif self.quality_score < 0.7 or self.fraud_score > 0.3:
            self.status = 'warning'
        else:
            self.status = 'active'
            
        self.save()

    def get_stats(self):
        from datasets.models import DataEntry
        from django.db.models import Sum
        
        # Approved earnings
        approved = DataEntry.objects.filter(annotator=self, status='approved').aggregate(total=Sum('task__reward_per_entry'))['total'] or 0
        
        # Pending earnings
        pending = DataEntry.objects.filter(annotator=self, status='pending').aggregate(total=Sum('task__reward_per_entry'))['total'] or 0
        
        # Paid (processed payments)
        paid = self.payments.filter(status='processed').aggregate(total=Sum('amount'))['total'] or 0
        
        return {
            'total_earned': float(approved),
            'pending': float(pending),
            'paid': float(paid),
            'current_balance': float(self.balance),
            'total_approved': DataEntry.objects.filter(annotator=self, status='approved').count(),
        }

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Language(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    group = models.CharField(max_length=50, default="General")
    samples_count = models.CharField(max_length=50, blank=True, null=True)
    active = models.BooleanField(default=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Dialect(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='dialects')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    region = models.CharField(max_length=100)
    priority = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.name} ({self.language.name})"

class Speaker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='speaker_profile')
    dialect = models.ForeignKey(Dialect, on_delete=models.SET_NULL, null=True)
    quality_score = models.FloatField(default=0)

    def __str__(self):
        return f"Speaker: {self.user.username}"

class Expert(models.Model):
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Idle', 'Idle')
    )

    name = models.CharField(max_length=255)
    email = models.EmailField()
    avatar_url = models.URLField(max_length=1000, blank=True, null=True)
    specialization = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    languages = models.ManyToManyField(Language, related_name="experts")

    def __str__(self):
        return self.name

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('failed', 'Failed'),
    ]
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    provider = models.CharField(max_length=50, default='Wave')
    reference = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment {self.id} for {self.profile.user.username} - {self.amount}"

class APIKey(models.Model):
    name = models.CharField(max_length=255)
    key_hash = models.CharField(max_length=255, unique=True)
    prefix = models.CharField(max_length=16, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')

    @staticmethod
    def generate_key():
        """Generates a secure key and returns (prefix, secret_key, key_hash)."""
        prefix = secrets.token_urlsafe(8)
        secret_key = secrets.token_urlsafe(32)
        full_key = f"ny_{prefix}_{secret_key}"
        key_hash = hashlib.sha256(full_key.encode()).hexdigest()
        return prefix, full_key, key_hash

    def __str__(self):
        return self.name

class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"
