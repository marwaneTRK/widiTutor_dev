# WidiTutor

## Backend status

- Active backend: `express/`
- Legacy backend (deprecated): `new_express/`

Use `express/README.md` for setup and FastAPI linking instructions.
Use `express/FASTAPI_CONTRACT.md` for the required FastAPI routes.

## Frontend

The frontend is configured to call the Express backend on port `5000`.

## Docker Compose

Run all services together (FastAPI + Express + Frontend):

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Express API: http://localhost:5000
- FastAPI: http://localhost:8000

Health checks:
- Express to FastAPI link: `http://localhost:5000/api/ai/health`
- FastAPI health: `http://localhost:8000/health`
