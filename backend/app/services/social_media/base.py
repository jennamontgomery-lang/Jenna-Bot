from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime


class BaseSocialMediaFetcher(ABC):
    """Abstract base class for social media platform fetchers"""

    def __init__(self, credentials: Dict[str, Any]):
        self.credentials = credentials
        self.platform = None
        self.authenticated = False

    @abstractmethod
    def authenticate(self) -> bool:
        """Authenticate with platform using credentials"""
        pass

    @abstractmethod
    def fetch_posts(self, limit: int = 100, since_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """
        Fetch posts from the account

        Args:
            limit: Maximum number of posts to fetch
            since_date: Only fetch posts after this date

        Returns:
            List of normalized post dictionaries
        """
        pass

    @abstractmethod
    def parse_post(self, raw_post: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse raw platform post into normalized schema

        Returns dict with keys:
        - platform_id: Unique ID on platform
        - text_content: Post text
        - media_urls: List of media URLs
        - hashtags: List of hashtags
        - engagement: Dict with likes, shares, comments
        - posted_at: Datetime posted
        - content_type: 'text', 'image', 'video', 'carousel'
        - original_url: Link to original post
        """
        pass

    def extract_hashtags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        import re
        return re.findall(r'#\w+', text)

    def normalize_post(self, raw_post: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize post to standard schema"""
        parsed = self.parse_post(raw_post)
        return {
            "platform_id": parsed.get("platform_id"),
            "text_content": parsed.get("text_content", ""),
            "media_urls": parsed.get("media_urls", []),
            "hashtags": parsed.get("hashtags", []),
            "engagement": parsed.get("engagement", {}),
            "posted_at": parsed.get("posted_at"),
            "content_type": parsed.get("content_type", "text"),
            "original_url": parsed.get("original_url"),
        }
