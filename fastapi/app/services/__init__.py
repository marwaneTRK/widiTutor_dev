from config import get_settings
from app.core import groq_client
from app.services.ai import AIService
from app.services.transcript import TranscriptService
from app.services.youtube import YouTubeService

settings = get_settings()

youtube_service = YouTubeService(settings.youtube_api_key)
transcript_service = TranscriptService()
ai_service = AIService(groq_client)
