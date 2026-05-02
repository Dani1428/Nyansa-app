import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from datasets.models import Task

def seed_terrain_mission():
    mission_title = "Mission spéciale: Terrain"
    description = (
        "Mission principale de collecte de données agricoles. "
        "Suivez les étapes guidées pour enregistrer les noms des cultures, "
        "prendre des photos des feuilles et enregistrer les instructions audio."
    )
    
    task, created = Task.objects.get_or_create(
        title=mission_title,
        defaults={
            'description': description,
            'task_type': 'audio', # Base type, but app uses title to trigger guided mode
            'reward_per_entry': 1500.00,
            'target_count': 500,
            'is_active': True
        }
    )
    
    if created:
        print(f"Mission '{mission_title}' créée avec succès.")
    else:
        print(f"Mission '{mission_title}' existe déjà.")

if __name__ == "__main__":
    seed_terrain_mission()
