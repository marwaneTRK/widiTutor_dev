from datetime import datetime

from fastapi import APIRouter

from app.core import settings, groq_client

router = APIRouter()


@router.get("/", tags=["root"])
async def root():
    """Root endpoint - API information"""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "architecture": "internal-only",
        "authentication": "All endpoints require Express JWT + HMAC authentication",
        "docs": "/docs" if not settings.is_production else "disabled",
        "features": [
            "youtube-search (authenticated)",
            "transcripts (authenticated)",
            "ai-summaries (authenticated)",
            "ai-quizzes (authenticated)",
            "ai-chat (authenticated)"
        ],
        "endpoints": {
            "public": [
                "GET /",
                "GET /health"
            ],
            "internal": [
                "POST /internal/search-videos",
                "POST /internal/get-transcript",
                "POST /internal/generate-summary",
                "POST /internal/generate-quiz",
                "POST /internal/chat"
            ]
        }
    }


@router.get("/health", tags=["health"])
async def health():
    """Public health check endpoint"""
    try:
        test_response = groq_client.models.list()
        groq_status = True
    except:
        groq_status = False

    return {
        "status": "healthy" if groq_status else "degraded",
        "service": "ai-backend",
        "version": settings.app_version,
        "groq_api": groq_status,
        "youtube_api": bool(settings.youtube_api_key),
        "timestamp": datetime.now().isoformat(),
        "environment": settings.node_env
    }
