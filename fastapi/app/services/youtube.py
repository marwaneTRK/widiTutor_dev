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

        except requests.RequestException as e:
            logger.error(f"YouTube API error: {e}")
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
