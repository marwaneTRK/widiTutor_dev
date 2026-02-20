# Express Backend (Active Backend)

This is the only backend you should run for this project.

## Run

```bash
cd express
npm install
npm run dev
```

## Required `.env` values

- `MONGO_URI`
- `JWT_SECRET`
- `SESSION_SECRET`

## FastAPI link (for AI routes)

This backend proxies AI requests to FastAPI.

- `FASTAPI_INTERNAL_URL` (default: `http://localhost:8000`)
- `FASTAPI_HEALTH_PATH` (default: `/health`)
- `FASTAPI_FOLDER_PATH` (default: `../fastapi`)
- `INTERNAL_API_SECRET` (used for `X-Internal-Auth`)

When you add a `fastapi` folder later at the repo root, this backend will detect it on startup and log the path.

Use this endpoint to verify connectivity:

- `GET /api/ai/health`

FastAPI endpoint contract:

- `express/FASTAPI_CONTRACT.md`

## Frontend-compatible auth routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/verify/:token`
- `GET /api/auth/me`

## AI proxy routes

- `POST /api/generate-summary`
- `POST /api/generate-quiz`
- `POST /api/chat`
- `POST /api/search-videos`
- `POST /api/get-transcript`
