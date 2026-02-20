import re
from xml.etree import ElementTree

import requests
from fastapi import HTTPException

from config import get_settings
from app.logging_config import logger
from app.services.youtube import YouTubeService

settings = get_settings()


class TranscriptService:
    """Service for fetching video transcripts"""

    @staticmethod
    def extract_video_id(url_or_id: str) -> str:
        """Extract video ID from YouTube URL or return ID as-is"""
        if 'youtube.com' in url_or_id or 'youtu.be' in url_or_id:
            patterns = [
                r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
                r'(?:embed\/)([0-9A-Za-z_-]{11})',
                r'youtu\.be\/([0-9A-Za-z_-]{11})'
            ]
            for pattern in patterns:
                match = re.search(pattern, url_or_id)
                if match:
                    return match.group(1)
        return url_or_id

    @staticmethod
    def fetch_transcript(video_id: str) -> tuple[str, str]:
        """Fetch transcript, returns (transcript, method_used)"""
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = " ".join([entry['text'] for entry in transcript_list])
            logger.info(f"✅ Transcript fetched using youtube-transcript-api for {video_id}")
            return transcript_text, "youtube-transcript-api"
        except ImportError:
            logger.warning("⚠️  youtube-transcript-api not installed")
        except Exception as e:
            logger.warning(f"⚠️  Method 1 failed: {e}")

        try:
            url = f"https://www.youtube.com/watch?v={video_id}"
            response = requests.get(url, timeout=10)

            if 'captionTracks' in response.text:
                start = response.text.find('"captionTracks"')
                if start != -1:
                    end = response.text.find(']', start)
                    caption_data = response.text[start:end+1]

                    base_url_start = caption_data.find('"baseUrl":"') + 11
                    base_url_end = caption_data.find('"', base_url_start)
                    base_url = caption_data[base_url_start:base_url_end]
                    base_url = base_url.replace('\\u0026', '&').replace('\\/', '/')

                    caption_response = requests.get(base_url, timeout=10)
                    root = ElementTree.fromstring(caption_response.content)
                    transcript_parts = []

                    for child in root:
                        if child.text:
                            text = child.text.replace('&#39;', "'").replace('&quot;', '"')
                            text = text.replace('&amp;', '&').replace('\n', ' ')
                            transcript_parts.append(text)

                    transcript_text = " ".join(transcript_parts)
                    if transcript_text:
                        logger.info(f"✅ Transcript fetched using direct URL for {video_id}")
                        return transcript_text, "direct-url"
        except Exception as e:
            logger.warning(f"⚠️  Method 2 failed: {e}")

        logger.warning(f"⚠️  Using fallback method for {video_id}")
        youtube_service = YouTubeService(settings.youtube_api_key)
        video_info = youtube_service.get_video_info(video_id)

        if video_info:
            snippet = video_info.get('snippet', {})
            title = snippet.get('title', '')
            description = snippet.get('description', '')
            fallback_text = f"Title: {title}\n\nDescription: {description}"
            logger.info(f"✅ Using video description as fallback for {video_id}")
            return fallback_text, "video-description"

        raise HTTPException(status_code=404, detail="Could not fetch transcript from any source")
