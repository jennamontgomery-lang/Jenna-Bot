from instagrapi import Client
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from .base import BaseSocialMediaFetcher

logger = logging.getLogger(__name__)


class InstagramFetcher(BaseSocialMediaFetcher):
    """Fetcher for Instagram posts using Instagrapi"""

    def __init__(self, credentials: Dict[str, Any]):
        super().__init__(credentials)
        self.platform = "instagram"
        self.client = None
        self.user_id = None
        self.handle = None

    def authenticate(self) -> bool:
        """Authenticate with Instagram"""
        try:
            username = self.credentials.get("username")
            password = self.credentials.get("password")

            if not username or not password:
                logger.error("Missing username or password in Instagram credentials")
                return False

            self.client = Client()
            self.client.login(username, password)

            # Get user info
            user = self.client.user_info_by_username(username)
            self.user_id = user.pk
            self.handle = user.username
            self.authenticated = True

            logger.info(f"Successfully authenticated as @{self.handle}")
            return True

        except Exception as e:
            logger.error(f"Instagram authentication error: {str(e)}")
            return False

    def fetch_posts(
        self,
        limit: int = 100,
        since_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Fetch posts from authenticated user"""

        if not self.authenticated or not self.user_id:
            logger.error("Not authenticated or missing user_id")
            return []

        try:
            posts = self.client.user_medias(self.user_id, amount=limit)
            logger.info(f"Fetched {len(posts)} posts from Instagram @{self.handle}")
            return posts

        except Exception as e:
            logger.error(f"Error fetching Instagram posts: {str(e)}")
            return []

    def parse_post(self, raw_post: Any) -> Dict[str, Any]:
        """Parse Instagram media into normalized schema"""

        try:
            media_urls = []
            content_type = "text"

            # Handle different media types
            if raw_post.media_type == 1:  # Photo
                content_type = "image"
                media_urls = [raw_post.image_versions2.candidates[0].url]
            elif raw_post.media_type == 2:  # Video
                content_type = "video"
                if hasattr(raw_post, "video_versions"):
                    media_urls = [raw_post.video_versions[0].url]
            elif raw_post.media_type == 8:  # Carousel
                content_type = "carousel"
                for item in raw_post.carousel_media or []:
                    if item.media_type == 1:
                        media_urls.append(item.image_versions2.candidates[0].url)
                    elif item.media_type == 2:
                        media_urls.append(item.video_versions[0].url)

            caption = raw_post.caption or ""

            return {
                "platform_id": str(raw_post.id),
                "text_content": caption,
                "media_urls": media_urls,
                "hashtags": self.extract_hashtags(caption),
                "engagement": {
                    "likes": raw_post.like_count or 0,
                    "comments": raw_post.comment_count or 0,
                },
                "posted_at": datetime.fromtimestamp(raw_post.taken_at),
                "content_type": content_type,
                "original_url": f"https://instagram.com/p/{raw_post.code}/",
            }

        except Exception as e:
            logger.error(f"Error parsing Instagram post: {str(e)}")
            return {}
