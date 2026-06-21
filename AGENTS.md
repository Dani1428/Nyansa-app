# Nyansa AI

Monorepo: `backend/` (Django 4.2.7 + DRF 3.14), `frontend/` (React 19 + Vite 8 + TS 6 + ESLint 10), `mobile/` (Flutter 3.0+).

## Backend

```bash
cd backend
$venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python seed_data.py && python seed_dialects.py && python seed_missions.py && python seed_prompts.py
python manage.py runserver
```

- **Validation**: `python manage.py check`
- **Tests**: `python manage.py test` (no pytest config in repo)
- **No Python linting config** — no ruff, flake8, black, or pylint
- Seeds must run in order: `seed_data` → `seed_dialects` → `seed_missions` → `seed_prompts`
- API docs at `/swagger/` and `/redoc/`

## Frontend

```bash
cd frontend
npm install
npm run dev        # Vite dev, proxies /api → localhost:8000
npm run build      # tsc -b && vite build
npm run lint       # eslint . (flat config)
```

- ESLint uses `eslint.config.js` (flat config, ESLint 10+)
- `Dockerfile.frontend` uses `--legacy-peer-deps` — may need it locally too
- No frontend test runner configured
- i18n at `src/locales/{en,fr}.json`

## Mobile

```bash
cd mobile
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

- Run `build_runner` after every schema change in `database.dart`
- `flutter test` for tests
- State: Provider + GoRouter. Offline-first via Drift (SQLite).

## Docker

```bash
docker compose up -d   # Postgres:5433, Backend:8000, Frontend:5173
```

- **No Redis in compose** — Celery (`redis://localhost:6380/0`) is unreachable in Docker
- Backend runs `runserver` (dev) despite Procfile specifying `gunicorn`
- Dockerfile.backend pins `psycopg2-binary==2.9.9` (commented out in requirements.txt)

## CI

`.github/workflows/ci.yml` — push/PR to `main`. Two jobs:
- **frontend**: Node 18 → `npm install` → `npm run build`
- **backend**: Python 3.10 → `pip install -r requirements.txt` → `python manage.py check`

## Critical quirks

### ⚠️ Dual Django config
Inner (`backend/backend/`) has the real config with `core`, `datasets`, `contact` apps and all API routes. Outer (`backend/`) is stale — no apps, no routes. **`manage.py` and `Procfile` resolve `backend.settings` / `backend.wsgi` to the outer (stale) files.** If the API returns 404, this is why.

### ⚠️ Env file duality
- **`backend/.env.example`** — feeds inner/active settings (`DATABASE_URL`, Twilio, AWS S3)
- **Root `.env.example`** — feeds outer/stale settings (`DB_NAME`, `DB_USER`, etc.)
- Always edit `backend/.env` for development

### ⚠️ Mock OTP & S3 fallback
- Twilio vars empty or starting with `your-` → OTP always `123456` (handled by `_clean_env` in `backend/backend/settings.py`)
- `AWS_ACCESS_KEY_ID` starting with `your-` or missing → falls back to local `media/` storage
- `psycopg2` not installed → falls back to SQLite (`db.sqlite3`)

### Architecture
| App | Purpose |
|-----|---------|
| `core` | Auth (OTP, JWT), Profile, Language/Dialect, FraudEngine, QualityEngine, Payments, APIKeys, Notifications |
| `datasets` | Task, Prompt, DataEntry, Dataset, Validation |
| `contact` | ContactMessage |

All API under `/api/v1/`. JWT: access 1d, refresh 7d. Throttling: anon 10/min, user 100/hr. Page size: 12.
