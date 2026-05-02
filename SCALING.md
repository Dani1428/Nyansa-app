# Nyansa AI - Global Scaling Guide 🌍

Ce guide explique comment étendre la plateforme Nyansa pour supporter de nouvelles langues, régions et types de données.

## 1. Ajouter une nouvelle Langue / Dialecte
### Backend
1. Connectez-vous à l'interface d'administration Django (`/admin`).
2. Dans **Core > Languages**, ajoutez la nouvelle langue (ex: "Akan", code: "ak").
3. Dans **Core > Dialects**, liez les variantes régionales à cette langue.
4. Créez des **Prompts** (textes source) pour cette langue dans **Datasets > Prompts**.

### Frontend
1. Allez dans `frontend/src/locales/`.
2. Créez un nouveau fichier `ak.json` en copiant `fr.json`.
3. Mettez à jour `src/i18n.ts` pour importer et enregistrer la nouvelle langue.

## 2. Déploiement en Production (Checklist)
Pour passer de `localhost` à un serveur réel :

- [ ] **Redis** : Utilisez une instance gérée (ex: Redis Labs ou AWS ElastiCache) ou sécurisez votre Docker avec un mot de passe.
- [ ] **Base de données** : Migrez de SQLite (dev) vers PostgreSQL (déjà configuré dans `settings.py`).
- [ ] **Variables d'environnement** : Remplissez le fichier `.env` avec les vraies clés :
  - `AWS_ACCESS_KEY_ID` (pour le stockage des sons/images)
  - `TWILIO_ACCOUNT_SID` (pour l'envoi des OTP SMS)
  - `SECRET_KEY` (générez une clé unique et secrète)
- [ ] **CORS** : Dans `settings.py`, remplacez `CORS_ALLOW_ALL_ORIGINS = True` par la liste de vos domaines autorisés.

## 3. Architecture Asynchrone (Celery)
En production, lancez plusieurs workers pour traiter les données :
```bash
# Pour le traitement des fichiers lourds
celery -A backend worker --loglevel=info --concurrency=4
```

## 4. Maintenance de l'App Mobile
- **Offline First** : L'application utilise `Drift` pour la base locale. En cas de changement de schéma (ajout de colonnes), n'oubliez pas d'incrémenter `schemaVersion` dans `database.dart` et de relancer `build_runner`.

---
© 2026 Nyansa AI - Construire l'infrastructure linguistique de l'IA en Afrique.
