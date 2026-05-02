from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Language, Dialect, Speaker, Expert, Profile, Payment, APIKey, Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ('id', 'name', 'prefix', 'created_at', 'last_used', 'is_active')
        read_only_fields = ('prefix', 'created_at', 'last_used')

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'

class DialectSerializer(serializers.ModelSerializer):
    language_name = serializers.ReadOnlyField(source='language.name')
    class Meta:
        model = Dialect
        fields = '__all__'

class SpeakerSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    dialect_name = serializers.ReadOnlyField(source='dialect.name')
    class Meta:
        model = Speaker
        fields = '__all__'

class ExpertSerializer(serializers.ModelSerializer):
    languages = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Expert
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    annotator_name = serializers.CharField(source='profile.user.username', read_only=True)
    
    class Meta:
        model = Payment
        fields = ('id', 'annotator_name', 'amount', 'provider', 'status', 'created_at', 'reference')
