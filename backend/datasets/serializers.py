from rest_framework import serializers
from .models import Dataset, Task, Prompt, DataEntry, Validation

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    language_name = serializers.CharField(source='language.name', read_only=True)
    prompt_text = serializers.CharField(source='prompt.text_fr', read_only=True)
    completion_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'task_type', 'language', 'language_name', 'prompt', 'prompt_text', 'reward_per_entry', 'target_count', 'is_active', 'created_at', 'completion_count']

    def get_completion_count(self, obj):
        return obj.entries.filter(status='approved').count()

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = '__all__'

class DataEntrySerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)
    annotator_name = serializers.CharField(source='annotator.user.username', read_only=True)
    task_type = serializers.CharField(source='task.task_type', read_only=True)
    reward = serializers.DecimalField(source='task.reward_per_entry', max_digits=10, decimal_places=2, read_only=True)
    
    # Flattened linguistic data for AI export
    language_name = serializers.CharField(source='language.name', read_only=True)
    dialect_name = serializers.CharField(source='dialect.name', read_only=True)
    prompt_text = serializers.CharField(source='prompt.text_fr', read_only=True)

    class Meta:
        model = DataEntry
        fields = '__all__'
        read_only_fields = ('annotator', 'quality_score', 'fraud_score', 'final_score', 'validated_at', 'validator')

class ValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Validation
        fields = '__all__'
