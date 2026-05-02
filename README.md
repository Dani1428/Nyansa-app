# 🧭 Plateforme NYANSA

Plateforme de collecte de données (audio, image, texte) en zones rurales avec fonctionnement hors ligne, détection de fraude avancée et système de scoring automatique.

## 🏗️ Architecture Globale

- **Mobile App (Flutter)** : Application de collecte *Offline-first*.
- **Backend API (Django + DRF)** : Moteur de fraude et scoring.
- **Database (PostgreSQL)** : Stockage des métadonnées.
- **Stockage fichiers (AWS S3)** : Stockage sécurisé des médias.
- **Admin Dashboard (React)** : Interface de validation et monitoring.

---

## 📱 1. Application Mobile (Flutter) - *En cours*

### Contraintes clés
- **Offline-first** : Fonctionnement sans connexion internet.
- **Faible bande passante** : Optimisation des transferts.
- **UX Simple** : Adaptée aux zones rurales.

### Fonctionnalités
- 🔐 **Authentification** : Login par téléphone (OTP) + JWT.
- 📋 **Missions** : Liste des tâches synchronisées et filtrage.
- 🎙️ **Collecte Multimodale** : Audio (native + waveform), Image (caméra uniquement), Texte.
- 🔄 **Offline Core** : Stockage local SQLite (Drift) et file d'attente de synchronisation.

---

## 🚨 2. Système Anti-Fraude (Critique)

### Détection Mobile
- **GPS Obligatoire** : Capture de la localisation pour vérification.
- **Device Fingerprint** : Identification unique de l'appareil (Device ID, Modèle, OS).
- **Restrictions** : Désactivation de l'upload depuis la galerie.

### Détection Backend (`backend/core/fraud_engine.py`)
- **Analyse Audio** : Détection de silence, bruit et similarité audio.
- **Détection IA** : Analyse de patterns répétitifs et similarité de texte.
- **Score Fraude** : Calcul automatique d'un score entre 0 et 1.

---

## 📊 3. Système de Scoring

Le score final d'une soumission est calculé selon la formule :
`final_score = (quality_score * 0.7) - (fraud_score * 0.3)`

---

## 🧠 4. Backend (Django + DRF)

### Modules implémentés
- **Users/Profile** : Rôles (annotateurs, validateurs, admin) et soldes.
- **Tasks** : Gestion des missions et récompenses.
- **Data Entries** : Gestion des soumissions et métadonnées.
- **Payments** : Historique des gains et intégration Wave (préparé).

### Endpoints Clés
- `/api/auth/request-otp/` : Demande de code OTP.
- `/api/tasks/` : Liste des missions actives.
- `/api/submissions/` : Synchronisation des données (batch upload).

---

## 🖥️ 5. Interface Admin (React + TypeScript)

Interface premium pour la gestion complète de la plateforme :
- **Dashboard** : Monitoring du volume, de la qualité et de la fraude.
- **Validation UI** : Lecteur audio et viewer image pour approbation/rejet.
- **Gestion Financière** : Calcul des paiements et export CSV.

---

## ⚙️ Installation & Audit

### Audit de conformité
- [x] **Moteur de fraude** : Implémenté (MD5, GPS, Text patterns).
- [x] **Scoring automatique** : Implémenté selon la formule du cahier des charges.
- [x] **Authentification OTP** : Implémentée avec Twilio.
- [x] **Backend multimodale** : Prêt pour Audio, Image et Texte.
- [x] **Admin UI** : Implémenté (Console de validation).
- [ ] **Mobile App** : *À initialiser*.

### Lancer le projet
- **Backend** : `cd backend && ..\venv\Scripts\activate && python manage.py runserver`
- **Frontend** : `cd frontend && npm run dev`

---
*Propriété exclusive de NYANSA. Construit pour le futur de l'Agriculture Africaine.*
