import json
import os
from django.core.management.base import BaseCommand
from django.utils import timezone
from datasets.models import DataEntry

class Command(BaseCommand):
    help = 'Exports approved data entries into a JSONL format for IA Training'

    def add_arguments(self, parser):
        parser.add_argument('--language', type=str, help='Filter by language code (e.g., BAO)')
        parser.add_argument('--dialect', type=str, help='Filter by dialect code (e.g., GOU-VAV)')
        parser.add_argument('--output', type=str, default='nyansa_dataset_export.jsonl', help='Output filename')

    def handle(self, *args, **options):
        # 1. Fetch only approved data
        queryset = DataEntry.objects.filter(status='approved').select_related(
            'language', 'dialect', 'prompt', 'task', 'annotator'
        )

        # 2. Apply filters
        if options['language']:
            queryset = queryset.filter(language__code=options['language'])
        if options['dialect']:
            queryset = queryset.filter(dialect__code=options['dialect'])

        count = queryset.count()
        if count == 0:
            self.stdout.write(self.style.WARNING('No approved data found for export.'))
            return

        self.stdout.write(self.style.SUCCESS(f'Found {count} entries to export...'))

        output_file = options['output']
        
        # 3. Process and format data
        exported_data = []
        with open(output_file, 'w', encoding='utf-8') as f:
            for entry in queryset:
                data = {
                    'id': entry.id,
                    'type': entry.task.task_type if entry.task else 'audio',
                    'text_source_fr': entry.prompt.text_fr if entry.prompt else '',
                    'audio_url': entry.file_url or (entry.audio_file.url if entry.audio_file else ''),
                    'duration_sec': entry.duration,
                    'linguistic_info': {
                        'language_name': entry.language.name if entry.language else 'Unknown',
                        'language_code': entry.language.code if entry.language else 'UNK',
                        'dialect_name': entry.dialect.name if entry.dialect else 'Unknown',
                        'dialect_code': entry.dialect.code if entry.dialect else 'UNK',
                        'group': entry.language.group if entry.language else 'Unknown',
                    },
                    'quality_metrics': {
                        'final_score': entry.final_score,
                        'linguistic_score': entry.linguistic_score,
                        'audio_score': entry.audio_score,
                        'dialect_score': entry.dialect_score,
                    },
                    'metadata': {
                        'annotator_id': entry.annotator.id if entry.annotator else None,
                        'gps': {'lat': entry.gps_lat, 'long': entry.gps_long},
                        'created_at': entry.created_at.isoformat(),
                        'tags': entry.prompt.tags if entry.prompt else []
                    }
                }
                # Write as one line per object (JSONL)
                f.write(json.dumps(data, ensure_ascii=False) + '\n')

        self.stdout.write(self.style.SUCCESS(f'Export completed! File saved to: {os.path.abspath(output_file)}'))
        self.stdout.write(self.style.MIGRATE_HEADING(f'Dataset ready for HuggingFace / AI Pipeline.'))
