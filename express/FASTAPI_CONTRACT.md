# FastAPI Contract For Express Proxy

When you add the `fastapi/` folder later, expose these routes on your FastAPI app:

- `GET /health`
- `POST /internal/generate-summary`
- `POST /internal/generate-quiz`
- `POST /internal/chat`
- `POST /internal/search-videos`
- `POST /internal/get-transcript`

Expected behavior:

- Accept JSON payloads from Express.
- Return JSON for all routes except chat streaming.
- Chat route should stream plain text chunks (or return plain text).
- If `INTERNAL_API_SECRET` is set in Express, validate `X-Internal-Auth` (`timestamp:signature` HMAC-SHA256).
