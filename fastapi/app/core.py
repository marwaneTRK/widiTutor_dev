from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from groq import Groq

from config import get_settings
from app.logging_config import logger

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Clean AI backend - All endpoints require Express authentication",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_credentials,
    allow_methods=settings.cors_methods_list,
    allow_headers=settings.cors_headers_list,
    max_age=3600
)

try:
    groq_client = Groq(api_key=settings.groq_api_key)
    logger.info("Groq client initialized")
except Exception as e:
    logger.error(f"Failed to initialize Groq client: {e}")
    raise


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error" if settings.is_production else str(exc)
        }
    )


@app.on_event("startup")
async def startup_event():
    logger.info("=" * 60)
    logger.info(f"{settings.app_name} Starting...")
    logger.info(f"Version: {settings.app_version}")
    logger.info(f"Environment: {settings.node_env}")
    logger.info(f"Security: HMAC authentication enabled")
    logger.info(f"Rate limiting: Enabled")
    logger.info(f"YouTube API: {'Connected' if settings.youtube_api_key else 'Missing'}")
    logger.info(f"Groq API: {'Connected' if settings.groq_api_key else 'Missing'}")
    logger.info("=" * 60)
    logger.info("Architecture: ALL endpoints require Express authentication")
    logger.info("Available endpoints:")
    logger.info("     PUBLIC:")
    logger.info("    - GET  / (root info)")
    logger.info("    - GET  /health (health check)")
    logger.info("     INTERNAL (HMAC authentication required):")
    logger.info("    - POST /internal/search-videos (search YouTube)")
    logger.info("    - POST /internal/get-transcript (fetch transcript)")
    logger.info("    - POST /internal/generate-summary (AI summary)")
    logger.info("    - POST /internal/generate-quiz (AI quiz)")
    logger.info("    - POST /internal/chat (AI chat streaming)")
    logger.info("=" * 60)
    logger.info(" All features require user authentication through Express")
    logger.info(" User tracking enabled for analytics and abuse prevention")
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"{settings.app_name} shutting down...")
