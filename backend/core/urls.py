from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LanguageViewSet, DialectViewSet, ExpertViewSet, PaymentViewSet, DashboardMetricsView, ProfileViewSet, APIKeyViewSet, NotificationViewSet
from .auth_views import RequestOTPView, VerifyOTPView, ProfileView

router = DefaultRouter()
router.register(r'languages', LanguageViewSet)
router.register(r'dialects', DialectViewSet)
router.register(r'experts', ExpertViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'agents', ProfileViewSet, basename='agents')
router.register(r'apikeys', APIKeyViewSet, basename='apikeys')
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('dashboard/metrics/', DashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('auth/request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
]
