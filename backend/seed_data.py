import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from datasets.models import Dataset
from contact.models import ContactMessage
from core.models import Language, Expert

def seed_datasets():
    datasets = [
        {
            'title': 'East African Maize Pest Dialogue',
            'dataset_type': 'Text Corpus',
            'language': 'Swahili',
            'size_info': '4.2M Tokens',
            'sector': 'Crop Pathology',
            'description': 'Linguistic dataset for maize pest detection in East Africa.',
            'is_available': True
        },
        {
            'title': 'Amharic Agronomy Extension Speech',
            'dataset_type': 'Audio',
            'language': 'Amharic',
            'size_info': '850 Hours',
            'sector': 'Extension Services',
            'description': 'Speech dataset for agricultural extension services in Amharic.',
            'is_available': True
        },
        {
            'title': 'Cassava Disease Visual Catalog',
            'dataset_type': 'Image + Metadata',
            'language': 'Multilingual',
            'size_info': '12k Images',
            'sector': 'Root Crops',
            'description': 'Image dataset for cassava disease identification.',
            'is_available': True
        },
        {
            'title': 'Hausa Soil Fertility Transactions',
            'dataset_type': 'Text Corpus',
            'language': 'Hausa',
            'size_info': '1.8M Tokens',
            'sector': 'Soil Nutrition',
            'description': 'Text dataset for soil fertility transactions in Hausa.',
            'is_available': True
        },
        {
            'title': 'Cacao Black Pod Disease Imagery',
            'dataset_type': 'Image',
            'language': 'French / Dioula',
            'size_info': '25k Images',
            'sector': 'Cacao Health',
            'description': 'High-resolution images of cacao pods affected by black pod disease.',
            'is_available': True
        },
        {
            'title': 'Wolof Farmer Advisory Audio',
            'dataset_type': 'Audio',
            'language': 'Wolof',
            'size_info': '450 Hours',
            'sector': 'Extension Services',
            'description': 'Recorded advisory sessions for Wolof-speaking farmers.',
            'is_available': True
        },
        {
            'title': 'Coffee Variety Mapping (Akan)',
            'dataset_type': 'Tabular + Text',
            'language': 'Akan',
            'size_info': '5k Records',
            'sector': 'Coffee Production',
            'description': 'Mapping of coffee varieties and their yield in Akan-speaking regions.',
            'is_available': True
        }
    ]

    for data in datasets:
        Dataset.objects.update_or_create(title=data['title'], defaults=data)
    print("Successfully seeded datasets.")

def seed_languages():
    languages = [
        {'code': 'EN', 'name': 'Swahili (Kenya)', 'samples_count': '1.2M Samples', 'active': True, 'archived': False},
        {'code': 'FR', 'name': 'Wolof (Senegal)', 'samples_count': '840K Samples', 'active': True, 'archived': False},
        {'code': 'AM', 'name': 'Amharic (Ethiopia)', 'samples_count': 'Archived', 'active': False, 'archived': True},
        {'code': 'HA', 'name': 'Hausa (Nigeria)', 'samples_count': '2.1M Samples', 'active': True, 'archived': False},
        {'code': 'ZU', 'name': 'Zulu (South Africa)', 'samples_count': '670K Samples', 'active': True, 'archived': False},
    ]
    for data in languages:
        Language.objects.update_or_create(name=data['name'], defaults=data)
    print("Successfully seeded languages.")

def seed_experts():
    swahili = Language.objects.filter(name='Swahili (Kenya)').first()
    wolof = Language.objects.filter(name='Wolof (Senegal)').first()
    hausa = Language.objects.filter(name='Hausa (Nigeria)').first()
    zulu = Language.objects.filter(name='Zulu (South Africa)').first()

    experts = [
        {
            'name': 'Dr. Amina Diallo', 'email': 'amina.d@nyansa.org', 'specialization': 'Soil Science', 'status': 'Active', 'avatar_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaSIjgCjkHwRxZTdHzV9ol5vvItalgINT-wDhvIzocoUGvJjAsGjd4eaksnBp7MLvmcbUb7RsUeSvgoN3xT_X9UlQJ7Z_YUq934wQy8UtQJggPq7fvFmGv7esZmqvna-aSXpEuPRQOJACsdKPxgju_I63vcxpBd7tUB1Qyhc_Fuk-6BMfSs1M6ggfQGR7LhjKBqsdLC1DSCTizUcyiNF5thYyEikARV_nGW-8TXPnpZN_KeG60sw7XL5BeuqDN0xOZXz9mCpMCL4xk',
            'langs': [wolof]
        },
        {
            'name': 'John Okoro', 'email': 'j.okoro@fielddata.net', 'specialization': 'Crop Pathology', 'status': 'Active', 'avatar_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaj58x0YDEKEJAYfjjwht_xuFFZu8Af9YSdi9zFfwInMTez4KR6xhtSAVX6UzxgsVnLqLKcvsEakQqZVEFLErmAAUTg9aQhQmYyiwecqYELy2JKeEOqYpQxv6Z6bZUtqiTppOpc1FjYLHZ2NZtrRuLEOnlHwy9dJaTcWuhH7qYWD9RJFocjs8FC3b5yjVCJJ3yZDV0Ce9tvtMh05M2Y8QF9aKjFtpfry6oxve9agzlGER8fs7ceiu2ZhrWCXws_V4TLjjue--CAXvN',
            'langs': [hausa]
        },
        {
            'name': 'Elena Petrov', 'email': 'e.petrov@lingua.com', 'specialization': 'Morphology', 'status': 'Idle', 'avatar_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrUJmoep_81MrV10HbpG9BgpM7R_O7q-YLqsIJcrNTt2pQQgmVkBBQAVKYnU9iratyLfDz4Fh2gD0LFmFi6YTDYFNR8vJbw4_6rScu5Una-UuIankz5Ig8eFmEwxkhoTiByJVbUkf_oWNEw6BzkzwGRzP3RxsYcf2_JbNYD9A3xoTp5KZWQWusM14TyZTH0vyejOIQMk9TC014C-03OuKSOfmsN9hf9u77K03H_rfY63D0DGJVcxvOkOdv0lJNO8g-7JHEMA9fhSYI',
            'langs': [zulu]
        },
        {
            'name': 'Dr. Samuel Mwangi', 'email': 'sam.mwangi@uonbi.ac.ke', 'specialization': 'Agronomy', 'status': 'Active', 'avatar_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDROWA0QD6nKRYpguIX2HRNtGXIS6ReMslnLBgTxo_6RmUHXEa_5Y9IjZjD5iEIOr9nejIKZSCwURdzaWMlejmpLIeWwJQY8G_mzeLcDXJFjwKjp-5XdmTVjKjMYFlf3aS86l6b9zyu_bqU_rqO4givHFz8eZpwWq53oZ9jqsbZW4g2yDdUA6QWnIYUu9CcQcu5Aiu_0fYNQ8-GTDe0fYBNjd-VOC-km0cMx0png9BHtL0Sajml19ZWnu1bye2NWCX7jgeNVN8OVW2i',
            'langs': [swahili]
        }
    ]

    for data in experts:
        langs = data.pop('langs', [])
        expert, created = Expert.objects.update_or_create(email=data['email'], defaults=data)
        if langs:
            expert.languages.set([l for l in langs if l])
    print("Successfully seeded experts.")

def seed_projects():
    projects = [
        {'name': 'AgriCorp Global', 'email': 'contact@agricorp.com', 'project_type': 'Pest Detection Corpus', 'status': 'New', 'ai_suggestion': 'Map to Swahili dialects'},
        {'name': 'UN Food Program', 'email': 'data@un.org', 'project_type': 'Market Prices NLP', 'status': 'In Review', 'ai_suggestion': 'Requires Agronomy Expert'},
        {'name': 'FarmTech Solutions', 'email': 'hello@farmtech.io', 'project_type': 'Soil Nutrient Analysis', 'status': 'Approved', 'ai_suggestion': 'Ready for processing'},
        {'name': 'EcoGrow NG', 'email': 'research@ecogrow.ng', 'project_type': 'Hausa Weather Alerts', 'status': 'New', 'ai_suggestion': 'Map to Hausa local experts'}
    ]
    
    for i, data in enumerate(projects):
        msg, created = ContactMessage.objects.update_or_create(email=data['email'], defaults=data)
        if created:
            msg.created_at = timezone.now() - timedelta(days=i*2)
            msg.save()
    print("Successfully seeded project requests.")

from datasets.models import Task

def seed_tasks():
    swahili = Language.objects.filter(name='Swahili (Kenya)').first()
    wolof = Language.objects.filter(name='Wolof (Senegal)').first()
    hausa = Language.objects.filter(name='Hausa (Nigeria)').first()

    tasks = [
        {
            'title': 'Collecte Audio Swahili',
            'description': 'Enregistrement de phrases agricoles en Swahili local pour détecter les parasites du maïs.',
            'task_type': 'audio',
            'language': swahili,
            'reward_per_entry': 500.00,
            'target_count': 1000
        },
        {
            'title': 'Identification Cacao',
            'description': 'Prendre des photos de feuilles de cacao (Saine vs Malade) pour le catalogue visuel.',
            'task_type': 'image',
            'language': wolof, # Assuming Wolof for this example
            'reward_per_entry': 350.00,
            'target_count': 500
        },
        {
            'title': 'Transcription Wolof',
            'description': 'Traduire des notes vocales courtes en texte Wolof pour les conseils agricoles.',
            'task_type': 'text',
            'language': wolof,
            'reward_per_entry': 200.00,
            'target_count': 2000
        },
        {
            'title': 'Collecte Audio Hausa',
            'description': 'Enregistrement de termes agricoles en Hausa pour les alertes météo.',
            'task_type': 'audio',
            'language': hausa,
            'reward_per_entry': 500.00,
            'target_count': 1200
        },
        {
            'title': 'Mission Spéciale : Terrain',
            'description': 'Script de collecte complet (Langue + Agriculture) pour les agents terrain.',
            'task_type': 'audio',
            'language': swahili,
            'reward_per_entry': 1500.00,
            'target_count': 50
        }
    ]

    for data in tasks:
        Task.objects.update_or_create(title=data['title'], defaults=data)
    print("Successfully seeded tasks.")

def seed_all():
    seed_datasets()
    seed_languages()
    seed_experts()
    seed_projects()
    seed_tasks()

if __name__ == '__main__':
    seed_all()
