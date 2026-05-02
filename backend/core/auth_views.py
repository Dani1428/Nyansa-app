from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.throttling import AnonRateThrottle
from django.conf import settings
from django.contrib.auth.models import User
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
import random

class OTPRateThrottle(AnonRateThrottle):
    """5 OTP requests per minute per IP"""
    rate = '5/min'

class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)

        # In production, use Twilio Verify Service
        # For development, we'll use a simple mock if Twilio keys aren't set
        # Use Twilio only if library is installed AND keys are configured
        if TWILIO_AVAILABLE and getattr(settings, 'TWILIO_ACCOUNT_SID', None) and getattr(settings, 'TWILIO_VERIFY_SERVICE_SID', None):
            try:
                client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID) \
                    .verifications.create(to=phone_number, channel='sms')
                return Response({"message": "OTP sent successfully"})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # Mock OTP for development
            return Response({"message": "OTP sent successfully (MOCK)", "debug_otp": "123456"})

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')

        if not phone_number or not otp:
            return Response({"error": "Phone number and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = False
        if TWILIO_AVAILABLE and getattr(settings, 'TWILIO_ACCOUNT_SID', None) and getattr(settings, 'TWILIO_VERIFY_SERVICE_SID', None):
            try:
                client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                verification_check = client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID) \
                    .verification_checks.create(to=phone_number, code=otp)
                is_valid = verification_check.status == 'approved'
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # Mock verification — code is always 123456 in dev mode
            is_valid = otp == "123456"

        if is_valid:
            # Get or create user
            username = phone_number.replace('+', '')
            user, created = User.objects.get_or_create(username=username)
            
            # Ensure profile exists
            profile, _ = Profile.objects.get_or_create(user=user)
            if not profile.phone_number:
                profile.phone_number = phone_number
                profile.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': ProfileSerializer(profile).data
            })
        else:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        data = ProfileSerializer(profile).data
        data['stats'] = profile.get_stats()
        return Response(data)

    def patch(self, request):
        profile = request.user.profile
        allowed_fields = ['device_model', 'network_operator', 'last_lat', 'last_long']
        for field in allowed_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        profile.save()
        return Response(ProfileSerializer(profile).data)
