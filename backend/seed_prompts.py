import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from datasets.models import Prompt

def seed_prompts():
    prompts = [
        {"text_fr": "Le cacao est malade", "category": "Agriculture", "difficulty": 1},
        {"text_fr": "Les feuilles de maïs sont jaunes", "category": "Agriculture", "difficulty": 1},
        {"text_fr": "Le prix du caoutchouc a baissé cette semaine", "category": "Agriculture", "difficulty": 2},
        {"text_fr": "Où se trouve la coopérative la plus proche ?", "category": "Agriculture", "difficulty": 2},
        {"text_fr": "Il faut traiter les palmiers contre les insectes", "category": "Agriculture", "difficulty": 3},
        {"text_fr": "La récolte de café sera bonne cette année", "category": "Agriculture", "difficulty": 2},
        {"text_fr": "Comment vas-tu aujourd'hui ?", "category": "Quotidien", "difficulty": 1},
        {"text_fr": "Où se trouve le marché ?", "category": "Quotidien", "difficulty": 1},
        {"text_fr": "Il pleut beaucoup aujourd'hui", "category": "Quotidien", "difficulty": 1},
        {"text_fr": "Je cherche le chef du village", "category": "Quotidien", "difficulty": 2},
        {"text_fr": "Quel est le prix du transport pour Abidjan ?", "category": "Quotidien", "difficulty": 2},
        {"text_fr": "Peux-tu m'aider à porter ce sac ?", "category": "Quotidien", "difficulty": 2},
        {"text_fr": "Bienvenue dans notre communauté", "category": "Quotidien", "difficulty": 1},
        {"text_fr": "L'engrais est arrivé hier soir", "category": "Agriculture", "difficulty": 2},
    ]

    for p_info in prompts:
        prompt, created = Prompt.objects.get_or_create(
            text_fr=p_info["text_fr"],
            defaults={
                "category": p_info["category"],
                "difficulty": p_info["difficulty"]
            }
        )
        if created:
            print(f"Created prompt: {p_info['text_fr']}")
        else:
            print(f"Prompt already exists: {p_info['text_fr']}")

if __name__ == "__main__":
    seed_prompts()
