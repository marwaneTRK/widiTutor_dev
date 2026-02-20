# FastAPI Backend

## Requirements

- Python 3.10+
- A `.env` file with all required keys

## Windows Setup (PowerShell)

1. Create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. Upgrade pip:

```powershell
python -m pip install --upgrade pip
```

3. Install dependencies:

```powershell
pip install -r requirements.txt```


4. Create the environment file:

```powershell
copy fastapi.env.example .env
```

5. Edit `.env` and set required values:

```
YOUTUBE_API_KEY=your_youtube_api_key_here
GROQ_API_KEY=your_groq_api_key_here
INTERNAL_API_SECRET=your_32_character_secret_here_same_as_express
FRONTEND_URL=http://localhost:0000,http://localhost:0000

```

## Run (PowerShell)

```powershell
  uvicorn main:app --reload 
```

The API will start on `http://0.0.0.0:8000` unless overridden by `.env`.

## Verify

```powershell
curl http://localhost:8000/health
```

You should see a JSON response with `status` and `version`.

## Endpoints

- Public: `GET /`, `GET /health`
- Internal (HMAC required): `/internal/*`


## Docker

From project root:

```bash
docker compose up --build
```

This FastAPI service is exposed on `http://localhost:8000`.
