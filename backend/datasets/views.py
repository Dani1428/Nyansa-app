from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import UserRateThrottle
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import Dataset, Task, Prompt, DataEntry, Validation
from .serializers import DatasetSerializer, TaskSerializer, PromptSerializer, DataEntrySerializer, ValidationSerializer
from core.fraud_engine import FraudEngine
from core.quality_engine import QualityEngine


class DatasetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dataset.objects.all().order_by('-created_at')
    serializer_class = DatasetSerializer
    permission_classes = [permissions.AllowAny]


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(is_active=True).order_by('-created_at')
        task_type = self.request.query_params.get('type')
        if task_type:
            qs = qs.filter(task_type=task_type)
        language = self.request.query_params.get('language')
        if language:
            qs = qs.filter(language__code=language)
        return qs

class PromptViewSet(viewsets.ModelViewSet):
    queryset = Prompt.objects.all().order_by('-id')
    serializer_class = PromptSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def random(self, request):
        import random
        prompts = Prompt.objects.all()
        if not prompts:
            return Response({'error': 'No prompts available'}, status=status.HTTP_404_NOT_FOUND)
        prompt = random.choice(prompts)
        serializer = self.get_serializer(prompt)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        POST /api/v1/prompts/generate/
        Body: {category, difficulty, count}
        """
        from .prompt_engine import PromptEngine
        try:
            category = request.data.get('category', 'agriculture')
            difficulty = int(request.data.get('difficulty', 1))
            count = int(request.data.get('count', 5))
            create_tasks = request.data.get('create_tasks', False)
            language_id = request.data.get('language_id')
            reward = float(request.data.get('reward', 50))
        except (ValueError, TypeError) as e:
            return Response({'error': f'Invalid input format: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Method 1: Template generation
        new_prompts = PromptEngine.batch_generate_and_save(
            count, category, difficulty, 
            create_tasks=create_tasks, 
            language_id=language_id, 
            reward=reward
        )
        
        serializer = self.get_serializer(new_prompts, many=True)
        return Response({
            'status': 'success',
            'generated_count': len(new_prompts),
            'prompts': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def update_stats(self, request, pk=None):
        """
        POST /api/v1/prompts/<id>/update_stats/
        Body: {is_approved: bool}
        """
        from .prompt_engine import PromptEngine
        is_approved = request.data.get('is_approved', False)
        success = PromptEngine.update_stats(pk, is_approved)
        if success:
            return Response({'status': 'updated'})
        return Response({'status': 'error'}, status=status.HTTP_400_BAD_REQUEST)


class DataEntryViewSet(viewsets.ModelViewSet):
    queryset = DataEntry.objects.all().order_by('-created_at')
    serializer_class = DataEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see their own submissions
        if self.request.user.is_staff:
            return DataEntry.objects.all().order_by('-created_at')
        return DataEntry.objects.filter(
            annotator=self.request.user.profile
        ).order_by('-created_at')

    def _validate_payload(self, data):
        """Validates required fields for a submission."""
        required = ['task']
        errors = {}
        for field in required:
            if not data.get(field):
                errors[field] = 'Ce champ est obligatoire.'
        return errors

    def perform_create(self, serializer):
        entry = serializer.save(annotator=self.request.user.profile)
        
        # Trigger Asynchronous Processing (Phase 3)
        from core.tasks import process_submission_task
        process_submission_task.delay(entry.id)

    def perform_update(self, serializer):
        old_instance = self.get_object()
        instance = serializer.save()
        
        # Credit balance and update reputation when status changes to approved
        if old_instance.status != 'approved' and instance.status == 'approved':
            instance.annotator.balance += instance.task.reward_per_entry
            instance.annotator.save()
            instance.annotator.update_reputation()
            
            # Feedback loop for Prompt Engine
            if instance.prompt:
                from .prompt_engine import PromptEngine
                PromptEngine.update_stats(instance.prompt.id, True)
        elif old_instance.status == 'approved' and instance.status != 'approved':
            # Deduct if it was approved but now changed (e.g. error corrected)
            instance.annotator.balance -= instance.task.reward_per_entry
            instance.annotator.save()
            instance.annotator.update_reputation()
        elif old_instance.status != instance.status:
            instance.annotator.update_reputation()

    def create(self, request, *args, **kwargs):
        # Payload validation
        errors = self._validate_payload(request.data)
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class SyncView(APIView):
    """
    POST /api/v1/sync/
    Batch upload endpoint for mobile offline queue.
    Accepts a list of submissions and returns per-item results.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def post(self, request):
        items = request.data
        if not isinstance(items, list):
            items = [items]

        results = []
        for item in items:
            local_id = item.get('local_id', '')
            try:
                task_id = item.get('task')
                if not task_id:
                    results.append({'local_id': local_id, 'status': 'error', 'detail': 'task is required'})
                    continue

                task = Task.objects.get(pk=task_id, is_active=True)

                # Anti-Fraud: Check for exact duplicates by checksum or content
                checksum = item.get('checksum', '')
                content_text = item.get('content_text', '')
                
                if checksum and DataEntry.objects.filter(task=task, checksum=checksum).exists():
                    results.append({'local_id': local_id, 'status': 'error', 'detail': 'Doublon détecté (Fichier déjà envoyé)'})
                    continue
                
                if content_text and len(content_text) > 10 and DataEntry.objects.filter(task=task, content_text=content_text).exists():
                    results.append({'local_id': local_id, 'status': 'error', 'detail': 'Doublon détecté (Texte déjà envoyé)'})
                    continue

                from core.models import Speaker, Dialect, Language
                speaker, _ = Speaker.objects.get_or_create(user=request.user)

                entry = DataEntry.objects.create(
                    task=task,
                    annotator=request.user.profile,
                    speaker=speaker,
                    content_text=content_text,
                    gps_lat=item.get('gps_lat'),
                    gps_long=item.get('gps_long'),
                    device_id=item.get('device_id', ''),
                    device_model=item.get('device_model', ''),
                    os_version=item.get('os_version', ''),
                    checksum=checksum,
                    local_id=local_id,
                    duration=item.get('duration', 0),
                )

                # Link linguistic metadata if provided
                prompt_id = item.get('prompt_id')
                if prompt_id:
                    entry.prompt_id = prompt_id
                
                dialect_id = item.get('dialect_id')
                if dialect_id:
                    entry.dialect_id = dialect_id
                
                language_id = item.get('language_id')
                if language_id:
                    entry.language_id = language_id
                
                entry.save()

                # Trigger Asynchronous Processing (Phase 3)
                from core.tasks import process_submission_task
                process_submission_task.delay(entry.id)

                results.append({
                    'local_id': local_id,
                    'server_id': entry.id,
                    'status': 'processing',  # Inform client it's being processed
                })

            except Task.DoesNotExist:
                results.append({'local_id': local_id, 'status': 'error', 'detail': 'Task not found'})
            except Exception as e:
                results.append({'local_id': local_id, 'status': 'error', 'detail': str(e)})

        return Response({
            'total': len(results),
            'synced': sum(1 for r in results if r['status'] == 'synced'),
            'errors': sum(1 for r in results if r['status'] == 'error'),
            'results': results,
        }, status=status.HTTP_207_MULTI_STATUS)


class ScoreView(APIView):
    """
    GET /api/v1/score/<entry_id>/
    Returns the full fraud + quality score for a submission.
    Response: {fraud_score, quality_score, final_score, flags, status}
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, entry_id):
        try:
            entry = DataEntry.objects.get(pk=entry_id)
            # Only owner or staff
            if not request.user.is_staff and entry.annotator != request.user.profile:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            return Response({
                'entry_id': entry.id,
                'fraud_score': entry.fraud_score,
                'quality_score': entry.quality_score,
                'final_score': entry.final_score,
                'status': entry.status,
                'flags': entry.fraud_flags,
            })
        except DataEntry.DoesNotExist:
            return Response({'error': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)

class ValidationViewSet(viewsets.ModelViewSet):
    queryset = Validation.objects.all().order_by('-created_at')
    serializer_class = ValidationSerializer
    permission_classes = [permissions.IsAuthenticated]
