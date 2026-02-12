import logging
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from ..config import settings
from ..database import SessionLocal
from .fetcher import ContentFetcher
from .classifier import ContentClassifier

logger = logging.getLogger(__name__)


class ContentScheduler:
    """Background scheduler for automatic content fetching and classification"""

    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.scheduler.configure(
            timezone='UTC',
            job_defaults={'misfire_grace_time': 3600}
        )

    def start(self):
        """Start the scheduler"""
        if not self.scheduler.running:
            self._add_jobs()
            self.scheduler.start()
            logger.info(f"Scheduler started with interval: {settings.sync_interval_hours} hours")

    def stop(self):
        """Stop the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Scheduler stopped")

    def _add_jobs(self):
        """Add background jobs"""
        # Content sync job
        self.scheduler.add_job(
            self._sync_all_content,
            IntervalTrigger(hours=settings.sync_interval_hours),
            id='sync_all_content',
            name='Sync all social media accounts',
            replace_existing=True,
        )

        # Classification job - runs every hour
        self.scheduler.add_job(
            self._classify_new_content,
            IntervalTrigger(hours=1),
            id='classify_new_content',
            name='Classify unclassified content',
            replace_existing=True,
        )

        logger.info("Background jobs configured")

    @staticmethod
    def _sync_all_content():
        """Sync content from all active accounts"""
        try:
            db = SessionLocal()
            fetcher = ContentFetcher(db)
            result = fetcher.fetch_all_accounts()

            logger.info(
                f"Sync completed: {result['total_fetched']} items fetched, "
                f"{result['total_errors']} errors"
            )

        except Exception as e:
            logger.error(f"Sync failed: {str(e)}")
        finally:
            db.close()

    @staticmethod
    def _classify_new_content():
        """Classify all unclassified content"""
        try:
            db = SessionLocal()
            classifier = ContentClassifier(db)
            result = classifier.classify_all_unclassified()

            logger.info(
                f"Classification completed: {result.get('classified', 0)} classified, "
                f"{result.get('errors', 0)} errors"
            )

        except Exception as e:
            logger.error(f"Classification failed: {str(e)}")
        finally:
            db.close()


# Global scheduler instance
scheduler = ContentScheduler()
