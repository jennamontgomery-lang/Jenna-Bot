import tweepy
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from .base import BaseSocialMediaFetcher

logger = logging.getLogger(__name__)


class TwitterFetcher(BaseSocialMediaFetcher):
    """Fetcher for Twitter/X posts using Tweepy"""

    def __init__(self, credentials: Dict[str, Any]):
        super().__init__(credentials)
        self.platform = "twitter"
        self.client = None
        self.api = None
        self.user_id = None
        self.handle = None

    def authenticate(self) -> bool:
        """Authenticate with Twitter API v2"""
        try:
            bearer_token = self.credentials.get("bearer_token")
            if not bearer_token:
                logger.error("Missing bearer_token in Twitter credentials")
                return False

            self.client = tweepy.Client(
                bearer_token=bearer_token,
                wait_on_rate_limit=True
            )

            # Verify credentials by getting authenticated user info
            handle = self.credentials.get("handle")
            if handle:
                # Remove @ if present
                handle = handle.lstrip("@")

                user = self.client.get_user(username=handle)
                if user.data:
                    self.user_id = user.data.id
                    self.handle = user.data.username
                    self.authenticated = True
                    logger.info(f"Successfully authenticated as @{self.handle}")
                    return True

            logger.error("Failed to authenticate: could not retrieve user info")
            return False

        except Exception as e:
            logger.error(f"Twitter authentication error: {str(e)}")
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
            # Build query parameters
            query_params = {
                "max_results": min(limit, 100),  # API limit is 100 per request
                "tweet_fields": "created_at,public_metrics,author_id",
                "expansions": "author_id",
                "user_fields": "username",
                "media_fields": "media_key,type,url,preview_image_url",
                "pollsfail": "fail",  # Fail silently on polls
            }

            if since_date:
                query_params["start_time"] = since_date.isoformat()

            # Fetch tweets
            posts = []
            paginator = tweepy.Paginator(
                self.client.get_users_tweets,
                id=self.user_id,
                **query_params
            )

            for page in paginator:
                if page.data:
                    for tweet in page.data:
                        posts.append(tweet)
                        if len(posts) >= limit:
                            return posts

            logger.info(f"Fetched {len(posts)} posts from Twitter @{self.handle}")
            return posts

        except Exception as e:
            logger.error(f"Error fetching Twitter posts: {str(e)}")
            return []

    def parse_post(self, raw_post: Any) -> Dict[str, Any]:
        """Parse tweet into normalized schema"""

        try:
            metrics = raw_post.public_metrics
            media_urls = []

            # Handle media (requires includes from API)
            if hasattr(raw_post, "attachments") and raw_post.attachments:
                # Note: We need to fetch media from includes in the paginator response
                # For now, we'll extract from expanded URLs if available
                pass

            return {
                "platform_id": str(raw_post.id),
                "text_content": raw_post.text,
                "media_urls": media_urls,
                "hashtags": self.extract_hashtags(raw_post.text),
                "engagement": {
                    "likes": metrics.get("like_count", 0),
                    "retweets": metrics.get("retweet_count", 0),
                    "replies": metrics.get("reply_count", 0),
                    "quotes": metrics.get("quote_count", 0),
                },
                "posted_at": raw_post.created_at,
                "content_type": "image" if media_urls else "text",
                "original_url": f"https://twitter.com/{self.handle}/status/{raw_post.id}",
            }

        except Exception as e:
            logger.error(f"Error parsing tweet: {str(e)}")
            return {}

    def get_media_urls(self, tweet_data: Dict[str, Any], includes: Dict[str, Any]) -> List[str]:
        """Extract media URLs from tweet data and includes"""
        media_urls = []

        if not includes.get("media"):
            return media_urls

        media_map = {m["media_key"]: m for m in includes["media"]}

        if "attachments" in tweet_data and "media_keys" in tweet_data["attachments"]:
            for key in tweet_data["attachments"]["media_keys"]:
                media = media_map.get(key)
                if media:
                    if media["type"] == "photo":
                        media_urls.append(media["url"])
                    elif media["type"] in ("video", "animated_gif"):
                        if "preview_image_url" in media:
                            media_urls.append(media["preview_image_url"])

        return media_urls
