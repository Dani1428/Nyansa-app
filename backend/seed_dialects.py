import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import Language, Dialect

def seed_languages_and_dialects():
    data = {
        "Gouro": {
            "code": "GOU",
            "group": "Mande",
            "dialects": [
                {"name": "Vavoua", "code": "GOU-VAV", "region": "Vavoua", "priority": 3},
                {"name": "Zuénoula", "code": "GOU-ZUE", "region": "Zuénoula", "priority": 2},
                {"name": "Sinfra", "code": "GOU-SIN", "region": "Sinfra", "priority": 1},
                {"name": "Bouaflé", "code": "GOU-BOU", "region": "Bouaflé", "priority": 2},
            ]
        },
        "Baoulé": {
            "code": "BAO",
            "group": "Akan",
            "dialects": [
                {"name": "Centre (Bouaké)", "code": "BAO-CEN", "region": "Bouaké", "priority": 3},
                {"name": "Est (Daoukro)", "code": "BAO-EST", "region": "Daoukro", "priority": 2},
                {"name": "Ouest (Yamoussoukro)", "code": "BAO-OUE", "region": "Yamoussoukro", "priority": 2},
                {"name": "Sud (Tiébissou)", "code": "BAO-SUD", "region": "Tiébissou", "priority": 1},
            ]
        },
        "Dioula": {
            "code": "DIO",
            "group": "Mande",
            "dialects": [
                {"name": "Dioula Standard", "code": "DIO-STD", "region": "Nord/Urbain", "priority": 3},
            ]
        },
        "Bété": {
            "code": "BET",
            "group": "Krou",
            "dialects": [
                {"name": "Bété de Gagnoa", "code": "BET-GAG", "region": "Gagnoa", "priority": 2},
                {"name": "Bété de Daloa", "code": "BET-DAL", "region": "Daloa", "priority": 2},
            ]
        },
        "Sénoufo": {
            "code": "SEN",
            "group": "Gour",
            "dialects": [
                {"name": "Sénoufo de Korhogo", "code": "SEN-KOR", "region": "Korhogo", "priority": 3},
            ]
        },
        "Agni": {
            "code": "AGN",
            "group": "Akan",
            "dialects": [
                {"name": "Agni Indénié", "code": "AGN-IND", "region": "Abengourou", "priority": 2},
                {"name": "Agni Moronou", "code": "AGN-MOR", "region": "Bongouanou", "priority": 2},
            ]
        }
    }

    for lang_name, info in data.items():
        lang, created = Language.objects.get_or_create(
            name=lang_name,
            defaults={
                "code": info["code"],
                "group": info["group"],
                "samples_count": "0",
                "active": True
            }
        )
        if not created:
            lang.group = info["group"]
            lang.save()
            print(f"Updated language: {lang_name}")
        else:
            print(f"Created language: {lang_name}")

        for d_info in info["dialects"]:
            dialect, d_created = Dialect.objects.get_or_create(
                code=d_info["code"],
                defaults={
                    "language": lang,
                    "name": d_info["name"],
                    "region": d_info["region"],
                    "priority": d_info["priority"]
                }
            )
            if d_created:
                print(f"  - Created dialect: {d_info['name']}")
            else:
                print(f"  - Dialect already exists: {d_info['name']}")

if __name__ == "__main__":
    seed_languages_and_dialects()
