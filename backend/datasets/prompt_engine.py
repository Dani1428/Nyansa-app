import random
from .models import Prompt

class PromptEngine:
    """
    NYANSA AI Prompt Generation System
    Generates controlled phrases for audio collection missions.
    """

    TEMPLATES = {
        'agriculture': {
            1: [
                "{sujet} {verbe_1}",
            ],
            2: [
                "{sujet} {verbe_2} {complement}",
                "Les {partie} du {sujet} {verbe_1}",
            ],
            3: [
                "{sujet} {verbe_2} parce qu'il {cause}",
                "Il faut {action} le {sujet} contre {ennemi}",
            ]
        },
        'daily_life': {
            1: [
                "Comment {action_base} ?",
                "C'est {objet_base}",
            ],
            2: [
                "Où se trouve {lieu} ?",
                "Je cherche {personne} pour {action_suivi}",
            ],
            3: [
                "Pouvez-vous m'aider à {action_complexe} aujourd'hui ?",
                "Il y a beaucoup de {chose} dans {lieu}",
            ]
        }
    }

    VOCABULARY = {
        'sujet': ["le cacao", "le café", "le maïs", "le palmier", "le champ", "le plant", "le caoutchouc"],
        'verbe_1': ["est malade", "grandit bien", "est prêt", "est sec", "est mûr"],
        'verbe_2': ["a besoin de", "souffre de", "manque de"],
        'partie': ["feuilles", "racines", "fruits", "fleurs", "tiges"],
        'complement': ["d'eau", "d'engrais", "de soleil", "de traitement"],
        'cause': ["manque d'eau", "est trop vieux", "a été attaqué", "ne reçoit pas assez de lumière"],
        'action': ["traiter", "nettoyer", "tailler", "arroser"],
        'ennemi': ["les insectes", "les champignons", "la pourriture", "la sécheresse"],
        
        'action_base': ["vas-tu", "allez-vous"],
        'objet_base': ["un sac", "une machette", "un seau", "une calebasse"],
        'lieu': ["le marché", "le dispensaire", "la coopérative", "le village", "le puits"],
        'personne': ["le chef", "l'infirmier", "le président", "le pisteur"],
        'action_suivi': ["vendre ma récolte", "acheter du sel", "soigner mon fils"],
        'action_complexe': ["porter ce sac de cacao", "réparer le toit de la case", "creuser un nouveau puits"],
        'chose': ["monde", "bruit", "poussière", "chaleur"]
    }

    @classmethod
    def generate(cls, category='agriculture', difficulty=1):
        """Method 1: Template-based Generation"""
        if category not in cls.TEMPLATES:
            category = 'agriculture'
        
        if difficulty not in cls.TEMPLATES[category]:
            difficulty = 1
            
        template = random.choice(cls.TEMPLATES[category][difficulty])
        
        # Simple placeholder replacement
        result = template
        for key, values in cls.VOCABULARY.items():
            placeholder = "{" + key + "}"
            if placeholder in result:
                result = result.replace(placeholder, random.choice(values))
        
        # Capitalize first letter
        result = result.capitalize()
        
        return result

    @classmethod
    def batch_generate_and_save(cls, count=10, category='agriculture', difficulty=1, create_tasks=False, language_id=None, reward=50):
        """Generate and store in DB, optionally creating associated tasks"""
        from .models import Task
        from core.models import Language
        
        created_prompts = []
        lang_obj = None
        if language_id and str(language_id).isdigit():
            try:
                lang_obj = Language.objects.get(id=int(language_id))
            except (Language.DoesNotExist, ValueError):
                pass

        for _ in range(count):
            text = cls.generate(category, difficulty)
            
            if not Prompt.objects.filter(text_fr=text).exists():
                prompt = Prompt.objects.create(
                    text_fr=text,
                    category=category,
                    difficulty=difficulty,
                    tags=[category]
                )
                created_prompts.append(prompt)

                if create_tasks:
                    Task.objects.create(
                        title=f"Traduction : {text[:40]}...",
                        description=f"Traduisez cette phrase en {lang_obj.name if lang_obj else 'langue locale'}.",
                        task_type='audio',
                        language=lang_obj,
                        prompt=prompt,
                        reward_per_entry=reward,
                        target_count=100,
                        is_active=True
                    )
        
        return created_prompts

    @classmethod
    def update_stats(cls, prompt_id, is_approved):
        """Feedback loop: Update success rate of a prompt"""
        try:
            prompt = Prompt.objects.get(id=prompt_id)
            prompt.usage_count += 1
            
            # Calculate new success rate
            approved_count = (prompt.success_rate * (prompt.usage_count - 1)) + (1 if is_approved else 0)
            prompt.success_rate = approved_count / prompt.usage_count
            
            prompt.save()
            return True
        except Prompt.DoesNotExist:
            return False
