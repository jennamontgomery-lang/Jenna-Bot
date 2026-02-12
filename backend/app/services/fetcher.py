import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from ..models import Content, Account
from .social_media import TwitterFetcher, InstagramFetcher, LinkedInFetcher

logger = logging.getLogger(__name__)


class ContentFetcher:
    """Orchestrates content fetching from multiple social media platforms"""

    FETCHER_CLASSES = {
        "twitter": TwitterFetcher,
        "instagram": InstagramFetcher,
        "linkedin": LinkedInFetcher,
    }

    def __init__(self, db: Session):
        self.db = db

    def fetch_all_accounts(self) -> Dict[str, Any]:
        """Fetch content from all active accounts"""
        results = {
            "total_fetched": 0,
            "total_errors": 0,
            "by_platform": {},
            "timestamp": datetime.utcnow(),
        }

        # Get all active accounts
        accounts = self.db.query(Account).filter(Account.is_active == True).all()

        for account in accounts:
            try:
                platform_result = self.fetch_account(account)
                results["total_fetched"] += platform_result.get("fetched", 0)
                results["total_errors"] += platform_result.get("errors", 0)

                if account.platform not in results["by_platform"]:
                    results["by_platform"][account.platform] = []

                results["by_platform"][account.platform].append({
                    "handle": account.handle,
                    "result": platform_result,
                })
            except Exception as e:
                logger.error(f"Error fetching account {account.handle}: {str(e)}")
                results["total_errors"] += 1

        return results

    def fetch_account(self, account: Account) -> Dict[str, Any]:
        """Fetch content from a single account"""
        result = {
            "fetched": 0,
            "errors": 0,
            "new_content": 0,
            "duplicates": 0,
        }

        try:
            # Get fetcher class for platform
            fetcher_class = self.FETCHER_CLASSES.get(account.platform)
            if not fetcher_class:
                logger.error(f"No fetcher for platform: {account.platform}")
                result["errors"] += 1
                return result

            # Retrieve and decrypt credentials (placeholder for encryption)
            credentials = self._get_account_credentials(account)
            if not credentials:
                logger.error(f"No credentials for account: {account.handle}")
                result["errors"] += 1
                return result

            # Instantiate fetcher and authenticate
            fetcher = fetcher_class(credentials)
            if not fetcher.authenticate():
                logger.error(f"Failed to authenticate {account.platform} account: {account.handle}")
                result["errors"] += 1
                return result

            # Fetch posts
            posts = fetcher.fetch_posts(limit=100)
            logger.info(f"Fetched {len(posts)} posts from {account.handle}")

            # Process each post
            for post in posts:
                try:
                    normalized = fetcher.normalize_post(post)
                    is_new = self._save_content(account, normalized)

                    if is_new:
                        result["new_content"] += 1
                    else:
                        result["duplicates"] += 1

                    result["fetched"] += 1

                except Exception as e:
                    logger.error(f"Error processing post: {str(e)}")
                    result["errors"] += 1

            # Update account's last_synced timestamp
            account.last_synced = datetime.utcnow()
            self.db.commit()

        except Exception as e:
            logger.error(f"Error in fetch_account: {str(e)}")
            result["errors"] += 1

        return result

    def _get_account_credentials(self, account: Account) -> Optional[Dict[str, Any]]:
        """Retrieve and decrypt credentials for account"""
        # TODO: Implement credential decryption from database
        # For now, return None to indicate credentials need to be configured
        return None

    def _save_content(self, account: Account, normalized_post: Dict[str, Any]) -> bool:
        """
        Save content to database
        Returns: True if new content, False if duplicate
        """
        try:
            # Check for duplicate using platform_id
            existing = self.db.query(Content).filter(
                Content.platform_id == normalized_post["platform_id"]
            ).first()

            if existing:
                # Update engagement metrics if exists
                existing.engagement = normalized_post.get("engagement", {})
                existing.updated_at = datetime.utcnow()
                self.db.commit()
                return False

            # Create new content record
            content = Content(
                account_id=account.id,
                platform_id=normalized_post["platform_id"],
                content_type=normalized_post.get("content_type", "text"),
                text_content=normalized_post.get("text_content"),
                media_urls=normalized_post.get("media_urls", []),
                hashtags=normalized_post.get("hashtags", []),
                engagement=normalized_post.get("engagement", {}),
                posted_at=normalized_post.get("posted_at", datetime.utcnow()),
                original_url=normalized_post.get("original_url"),
            )

            self.db.add(content)
            self.db.commit()
            logger.info(f"Saved new content: {content.platform_id}")
            return True

        except Exception as e:
            logger.error(f"Error saving content: {str(e)}")
            self.db.rollback()
            return False

    def classify_unclassified_content(self) -> Dict[str, Any]:
        """Classify all content that hasn't been classified yet"""
        # TODO: Integrate with classifier service
        return {
            "total_classified": 0,
            "total_errors": 0,
        }
