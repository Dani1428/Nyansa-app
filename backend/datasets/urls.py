from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DatasetViewSet, TaskViewSet, PromptViewSet, DataEntryViewSet, ValidationViewSet, SyncView, ScoreView

router = DefaultRouter()
router.register(r'datasets', DatasetViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'submissions', DataEntryViewSet)
router.register(r'prompts', PromptViewSet)
router.register(r'data-entries', DataEntryViewSet, basename='data-entries')
router.register(r'validate', ValidationViewSet, basename='validate')

urlpatterns = [
    path('', include(router.urls)),
    path('sync/', SyncView.as_view(), name='sync'),
    path('score/<int:entry_id>/', ScoreView.as_view(), name='score'),
]
