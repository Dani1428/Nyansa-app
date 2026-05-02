from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Language, Dialect, Expert, Payment, Profile, APIKey, Notification
from datasets.models import Dataset
from contact.models import ContactMessage
from .serializers import LanguageSerializer, DialectSerializer, ExpertSerializer, PaymentSerializer, ProfileSerializer, APIKeySerializer, NotificationSerializer
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework import status

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.filter(role='annotator').order_by('-created_at')
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        profile = self.get_object()
        if profile.status == 'suspended':
            profile.status = 'active'
        else:
            profile.status = 'suspended'
        profile.save()
        return Response({'status': profile.status})

class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['get'])
    def dialects(self, request, pk=None):
        language = self.get_object()
        dialects = language.dialects.all()
        serializer = DialectSerializer(dialects, many=True)
        return Response(serializer.data)

class DialectViewSet(viewsets.ModelViewSet):
    queryset = Dialect.objects.all()
    serializer_class = DialectSerializer
    permission_classes = [permissions.AllowAny]

class ExpertViewSet(viewsets.ModelViewSet):
    queryset = Expert.objects.all()
    serializer_class = ExpertSerializer
    permission_classes = [permissions.AllowAny]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def process_all(self, request):
        # Logic to process all pending payments
        pending = Payment.objects.filter(status='pending')
        count = pending.count()
        pending.update(status='processed', processed_at=timezone.now())
        return Response({'message': f'Successfully processed {count} payments.'})

class DashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_datasets = Dataset.objects.count()
        active_projects = ContactMessage.objects.exclude(status='Rejected').count()
        total_experts = Expert.objects.filter(status='Active').count()
        
        # Example dynamic pipeline data, ideally this would be real analytics
        translation_accuracy = [82, 85, 88, 91, 94] 
        project_trends = [20, 45, 38, 65, 52, 78]
        
        return Response({
            'total_datasets': total_datasets,
            'active_projects': active_projects,
            'total_experts': total_experts,
            'translation_accuracy': translation_accuracy,
            'project_trends': project_trends
        })

class APIKeyViewSet(viewsets.ModelViewSet):
    serializer_class = APIKeySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return APIKey.objects.filter(owner=self.request.user, is_active=True).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', 'Default Key')
        prefix, secret_key, key_hash = APIKey.generate_key()
        
        apikey = APIKey.objects.create(
            name=name,
            prefix=prefix,
            key_hash=key_hash,
            owner=request.user
        )
        
        serializer = self.get_serializer(apikey)
        data = serializer.data
        # Attach the plain secret key ONLY in this response
        data['secret_key'] = secret_key
        
        return Response(data, status=status.HTTP_201_CREATED)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'read'})
