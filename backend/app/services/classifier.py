import re
import logging
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from ..models import Content, Classification

logger = logging.getLogger(__name__)


class ContentClassifier:
    """Classifies content as evergreen or time-sensitive"""

    # Time-sensitive keywords and phrases
    TIME_SENSITIVE_PATTERNS = [
        r"\b(upcoming|coming soon|save the date|register now|limited time)\b",
        r"\b(next week|tomorrow|today|this week|this month|this year)\b",
        r"\b(early bird|early access|last chance|hurry|deadline)\b",
        r"\b(event|conference|summit|workshop|speaker)\s+\d{4}",  # Year reference
        r"\d{4}(?:\s+conference|\s+event|\s+summit)",  # Year + event
        r"\b(Q[1-4]\s+\d{4}|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b",
        r"\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b",
        r"\d{1,2}[/-]\d{1,2}[/-]\d{4}",  # Date format MM/DD/YYYY
    ]

    # Evergreen keywords and phrases
    EVERGREEN_PATTERNS = [
        r"\b(how to|guide|tutorial|tips?|best practices)\b",
        r"\b(bitcoin|crypto|blockchain)\s+(basics|101|explained|fundamentals)\b",
        r"\b(security|privacy|protection)\s+(practices|tips|guide)\b",
        r"\b(beginner|newbie|newcomer)\b",
        r"\b(what is|why bitcoin|why crypto)\b",
        r"\b(history|origin|early days|since launch)\b",
        r"\b(principle|philosophy|principle|vision|mission)\b",
        r"\b(adoption|use case|application)\b",
        r"\b(technical|deep dive|explanation)\b",
        r"\b(success|story|learn from)\b",
    ]

    # Year indicators (should mark as time-sensitive if recent)
    CURRENT_YEARS = ["2024", "2025", "2026"]

    def __init__(self, db: Session):
        self.db = db
        self.version = "1.0"

    def classify(self, content: Content) -> Tuple[bool, float, List[str], List[str], str]:
        """
        Classify content as evergreen or time-sensitive

        Returns:
            Tuple of (is_evergreen, confidence_score, detected_categories, indicators, reason)
        """
        try:
            text = (content.text_content or "").lower()

            # Run classification checks
            time_indicators = self._detect_time_sensitive(text)
            evergreen_indicators = self._detect_evergreen_patterns(text)
            categories = self._detect_categories(text)

            # Calculate confidence and make decision
            is_evergreen, confidence, reason = self._calculate_classification(
                time_indicators,
                evergreen_indicators,
                categories,
                text
            )

            return is_evergreen, confidence, categories, time_indicators, reason

        except Exception as e:
            logger.error(f"Error classifying content {content.id}: {str(e)}")
            return None, 0.0, [], [], f"Classification error: {str(e)}"

    def classify_and_save(self, content: Content) -> bool:
        """Classify content and save classification to database"""
        try:
            is_evergreen, confidence, categories, indicators, reason = self.classify(content)

            if is_evergreen is None:
                return False

            # Create or update classification record
            classification = self.db.query(Classification).filter(
                Classification.content_id == content.id
            ).first()

            if not classification:
                classification = Classification(
                    content_id=content.id,
                    classifier_version=self.version,
                )

            classification.confidence_score = confidence
            classification.detected_categories = categories
            classification.time_sensitive_indicators = indicators
            classification.reason = reason

            # Update content record
            content.is_evergreen = is_evergreen
            content.classification_score = confidence
            content.classification_reason = reason

            # Generate repost-ready copy
            content.repost_ready_copy = self._generate_repost_copy(content, is_evergreen)

            if not classification.id:
                self.db.add(classification)

            self.db.commit()
            logger.info(f"Classified content {content.id}: is_evergreen={is_evergreen}, confidence={confidence}")
            return True

        except Exception as e:
            logger.error(f"Error saving classification: {str(e)}")
            self.db.rollback()
            return False

    def _detect_time_sensitive(self, text: str) -> List[str]:
        """Detect time-sensitive indicators in text"""
        indicators = []

        for pattern in self.TIME_SENSITIVE_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                indicators.extend(matches)

        return list(set(indicators))

    def _detect_evergreen_patterns(self, text: str) -> List[str]:
        """Detect evergreen content patterns"""
        indicators = []

        for pattern in self.EVERGREEN_PATTERNS:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                indicators.extend(matches)

        return list(set(indicators))

    def _detect_categories(self, text: str) -> List[str]:
        """Detect content categories"""
        categories = []

        category_patterns = {
            "bitcoin_basics": r"\b(bitcoin|btc)\s+(basics|101|explained|fundamentals|what is)\b",
            "security": r"\b(security|privacy|protection|safe|secure)\b",
            "trading": r"\b(trading|buy|sell|price|market|investment)\b",
            "technology": r"\b(technology|blockchain|mining|code|development)\b",
            "adoption": r"\b(adoption|use case|application|payment|merchant)\b",
            "education": r"\b(learn|guide|tutorial|howto|understand)\b",
            "philosophy": r"\b(philosophy|principle|vision|mission|decentralized)\b",
            "news": r"\b(news|update|announcement|breaking|report)\b",
        }

        for category, pattern in category_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                categories.append(category)

        return categories

    def _calculate_classification(
        self,
        time_indicators: List[str],
        evergreen_indicators: List[str],
        categories: List[str],
        text: str
    ) -> Tuple[bool, float, str]:
        """Calculate if content is evergreen based on indicators"""

        # Scoring system
        score = 0.5  # Start at neutral

        # Penalize time-sensitive indicators
        if time_indicators:
            score -= min(0.3, len(time_indicators) * 0.1)

        # Reward evergreen indicators
        if evergreen_indicators:
            score += min(0.3, len(evergreen_indicators) * 0.1)

        # Consider engagement (older content with high engagement = likely evergreen)
        # This would be added when we have historical data

        # If contains current year, more likely time-sensitive
        for year in self.CURRENT_YEARS:
            if year in text:
                score -= 0.1

        # Clamp score between 0 and 1
        score = max(0.0, min(1.0, score))

        # Determine classification
        # Use 0.5 as threshold, but require confidence > 0.6 to be confident
        is_evergreen = score >= 0.5
        confidence = abs(score - 0.5) + 0.5  # Convert to confidence 0.5-1.0

        # Generate reason
        if score >= 0.65:
            reason = f"Strong evergreen indicators. Categories: {', '.join(categories)}"
        elif score <= 0.35:
            reason = f"Time-sensitive content detected: {', '.join(time_indicators[:3])}"
        else:
            reason = "Marginal classification - manual review recommended"

        return is_evergreen, confidence, reason

    def _generate_repost_copy(self, content: Content, is_evergreen: bool) -> str:
        """Generate repost-ready copy"""
        if not is_evergreen:
            return ""

        # Start with original text
        copy = content.text_content or ""

        # Remove year references
        for year in self.CURRENT_YEARS:
            copy = copy.replace(year, "[YEAR]")

        # Add context if needed
        if not copy:
            copy = f"Evergreen Bitcoin content from @{content.account.handle}"

        # Append hashtags
        if content.hashtags:
            copy += "\n\n" + " ".join(f"#{tag}" for tag in content.hashtags[:5])

        return copy

    def classify_all_unclassified(self) -> Dict[str, Any]:
        """Classify all unclassified content"""
        try:
            unclassified = self.db.query(Content).filter(
                Content.is_evergreen == None
            ).all()

            results = {
                "total": len(unclassified),
                "classified": 0,
                "errors": 0,
            }

            for content in unclassified:
                if self.classify_and_save(content):
                    results["classified"] += 1
                else:
                    results["errors"] += 1

            logger.info(f"Classified {results['classified']} items, {results['errors']} errors")
            return results

        except Exception as e:
            logger.error(f"Error in classify_all_unclassified: {str(e)}")
            return {"error": str(e)}
