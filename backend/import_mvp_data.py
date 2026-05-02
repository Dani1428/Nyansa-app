import os
import json
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Language, Dialect

def import_data():
    file_path = 'mvp_languages.json'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for lang_data in data['languages']:
        # Update or create Language
        language, created = Language.objects.update_or_create(
            code=lang_data['code'],
            defaults={
                'name': lang_data['name'],
                'group': lang_data['group'],
                'active': True
            }
        )
        status = "Created" if created else "Updated"
        print(f"{status} Language: {language.name} ({language.code})")

        # Update or create Dialects
        for d_data in lang_data['dialects']:
            dialect, d_created = Dialect.objects.update_or_create(
                code=d_data['code'],
                defaults={
                    'language': language,
                    'name': d_data['name'],
                    'region': d_data['region'],
                    'priority': d_data['priority']
                }
            )
            d_status = "Created" if d_created else "Updated"
            print(f"  - {d_status} Dialect: {dialect.name} ({dialect.code})")

    print("\nLinguistic data import completed successfully.")

if __name__ == "__main__":
    import_data()
