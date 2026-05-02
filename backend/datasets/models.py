from django.db import models
from core.models import Profile, Language

class Task(models.Model):
    TYPE_CHOICES = [
        ('audio', 'Audio Collection'),
        ('image', 'Image Collection'),
        ('text', 'Text Transcription'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    task_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, blank=True)
    prompt = models.ForeignKey('Prompt', on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    reward_per_entry = models.DecimalField(max_digits=10, decimal_places=2)
    target_count = models.IntegerField(default=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.task_type})"

class Prompt(models.Model):
    CATEGORY_CHOICES = [
        ('agriculture', 'Agriculture'),
        ('daily_life', 'Vie quotidienne'),
        ('instructions', 'Instructions'),
    ]
    text_fr = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    difficulty = models.IntegerField(default=1) # 1, 2, or 3
    tags = models.JSONField(default=list, blank=True) # e.g., ["cacao", "maladie"]
    success_rate = models.FloatField(default=0.0) # success_rate = approved_count / usage_count
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"[{self.category}] {self.text_fr[:50]}..."

class DataEntry(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='entries', null=True, blank=True)
    annotator = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='submissions', null=True, blank=True)
    
    # New fields from README
    speaker = models.ForeignKey('core.Speaker', on_delete=models.CASCADE, related_name='data_entries', null=True, blank=True)
    language = models.ForeignKey('core.Language', on_delete=models.CASCADE, related_name='data_entries', null=True, blank=True)
    dialect = models.ForeignKey('core.Dialect', on_delete=models.CASCADE, related_name='data_entries', null=True, blank=True)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE, related_name='data_entries', null=True, blank=True)
    audio_file = models.FileField(upload_to="audio/", null=True, blank=True)
    duration = models.FloatField(default=0)

    # Storage
    file_url = models.URLField(max_length=2000, blank=True, null=True)
    content_text = models.TextField(blank=True, null=True)
    
    # Metadata & Anti-fraud
    gps_lat = models.FloatField(null=True, blank=True)
    gps_long = models.FloatField(null=True, blank=True)
    device_id = models.CharField(max_length=255, blank=True, null=True)
    device_model = models.CharField(max_length=255, blank=True, null=True)
    os_version = models.CharField(max_length=100, blank=True, null=True)
    duration_seconds = models.FloatField(null=True, blank=True)
    checksum = models.CharField(max_length=255, blank=True, null=True)
    local_id = models.CharField(max_length=100, blank=True, null=True)  # From mobile queue
    
    # Scoring
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    linguistic_score = models.FloatField(default=0.0)
    audio_score = models.FloatField(default=0.0)
    dialect_score = models.FloatField(default=0.0)
    diversity_score = models.FloatField(default=0.0)
    
    quality_score = models.FloatField(default=0.0) # Legacy/Combined
    fraud_score = models.FloatField(default=0.0)
    fraud_flags = models.JSONField(default=list, blank=True)  # ["duplicate_audio", "missing_gps"]
    final_score = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    validated_at = models.DateTimeField(null=True, blank=True)
    validator = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True, related_name='validations')

    def save(self, *args, **kwargs):
        # Calculate final score based on formula:
        # 0.4 * linguistic + 0.2 * audio + 0.2 * dialect + 0.1 * diversity - 0.3 * fraud
        self.final_score = (
            (0.4 * self.linguistic_score) +
            (0.2 * self.audio_score) +
            (0.2 * self.dialect_score) +
            (0.1 * self.diversity_score) -
            (0.3 * self.fraud_score)
        )
        # Ensure score is not negative (or clamped as per project requirements)
        self.final_score = max(0.0, self.final_score)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Entry {self.id}"

class Validation(models.Model):
    data_entry = models.ForeignKey(DataEntry, on_delete=models.CASCADE, related_name='validations_log')
    quality_score = models.FloatField()
    is_valid = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Validation for Entry {self.data_entry.id}: {self.quality_score}"

class Dataset(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    dataset_type = models.CharField(max_length=50) # 'Text Corpus', 'Audio', etc.
    language = models.CharField(max_length=100, blank=True, null=True)
    size_info = models.CharField(max_length=100) # e.g., '10k images', '50 hours'
    sector = models.CharField(max_length=100) # e.g., 'Agriculture', 'NLP'
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
