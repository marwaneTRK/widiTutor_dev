from typing import List, Dict

import requests
from fastapi import HTTPException

from config import get_settings
from app.logging_config import logger
from app.models import Video

settings = get_settings()


class YouTubeService:
    """YouTube API service for video search and info"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.googleapis.com/youtube/v3"

    def search_videos(self, query: str, max_results: int = 10) -> List[Video]:
        """Search YouTube videos"""
        url = f"{self.base_url}/search"
        params = {
            'part': 'snippet',
            'q': query,
            'type': 'video',
            'maxResults': min(max_results, settings.youtube_max_results),
            'key': self.api_key
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            # if the key is invalid/restricted you'll get 403 and this will raise
            response.raise_for_status()
            data = response.json()

            videos = []
            for item in data.get('items', []):
                video = Video(
                    id=item['id']['videoId'],
                    title=item['snippet']['title'],
                    description=item['snippet']['description'],
                    thumbnail=item['snippet']['thumbnails']['medium']['url'],
                    channel=item['snippet']['channelTitle']
                )
                videos.append(video)

            logger.info(f"Found {len(videos)} videos for query: {query}")
            return videos

        except requests.HTTPError as e:
            # log status code and body for easier debugging
            status = getattr(e.response, 'status_code', None)
            body = getattr(e.response, 'text', '')
            logger.error(
                "YouTube API HTTP error %s: %s - body: %s",
                status,
                e,
                body,
            )

            # inspect error body to provide more specific feedback
            try:
                err_json = e.response.json()
                reason = err_json.get('error', {}).get('errors', [])[0].get('reason')
            except Exception:
                reason = None

            if reason == 'quotaExceeded':
                # YouTube returns 403 for quota issues; map to 429
                raise HTTPException(
                    status_code=429,
                    detail="YouTube API quota exceeded. Please wait or check your billing/quota settings.",
                )

            raise HTTPException(
                status_code=500,
                detail=f"YouTube API HTTP error {status}: {body or str(e)}",
            )
        except requests.RequestException as e:
            logger.error("YouTube API request failed: %s", e)
            raise HTTPException(status_code=500, detail=f"YouTube API error: {str(e)}")

    def get_video_info(self, video_id: str) -> Dict:
        """Get video details"""
        url = f"{self.base_url}/videos"
        params = {
            'part': 'snippet,contentDetails,statistics',
            'id': video_id,
            'key': self.api_key
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            if 'items' in data and len(data['items']) > 0:
                return data['items'][0]
            return {}
        except Exception as e:
            logger.error(f"Error getting video info: {e}")
            return {}
