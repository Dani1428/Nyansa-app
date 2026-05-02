import hashlib
from rest_framework import authentication, exceptions
from .models import APIKey
from django.utils import timezone

class APIKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        api_key_header = request.META.get('HTTP_X_API_KEY')
        if not api_key_header:
            return None

        try:
            # Hash the incoming key to find a match
            key_hash = hashlib.sha256(api_key_header.encode()).hexdigest()
            api_key = APIKey.objects.get(key_hash=key_hash, is_active=True)
            
            # Update last used
            api_key.last_used = timezone.now()
            api_key.save()
            
            return (api_key.owner, None)
        except APIKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid or inactive API Key.')
