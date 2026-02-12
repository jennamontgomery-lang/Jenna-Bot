from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Boolean, Float, DateTime,
    ForeignKey, JSON, Text, Enum, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
import enum

Base = declarative_base()


class Platform(str, enum.Enum):
    TWITTER = "twitter"
    INSTAGRAM = "instagram"
    LINKEDIN = "linkedin"


class ContentType(str, enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    CAROUSEL = "carousel"


class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform = Column(String(50), nullable=False)
    handle = Column(String(255), unique=True, nullable=False)
    account_name = Column(String(255), nullable=False)
    profile_url = Column(String(500))
    credentials_encrypted = Column(Text)
    is_active = Column(Boolean, default=True)
    last_synced = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    content = relationship("Content", back_populates="account", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Account {self.handle}>"


class Content(Base):
    __tablename__ = "content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False)
    platform_id = Column(String(500), unique=True, nullable=False)  # Original post ID from platform
    content_type = Column(String(50), nullable=False)
    text_content = Column(Text)
    media_urls = Column(JSON, default=list)  # Array of media URLs
    hashtags = Column(JSON, default=list)  # Array of hashtags
    engagement = Column(JSON, default=dict)  # likes, retweets, comments
    posted_at = Column(DateTime, nullable=False)
    fetched_at = Column(DateTime, default=datetime.utcnow)
    is_evergreen = Column(Boolean, default=None, nullable=True)  # None = unclassified
    classification_score = Column(Float, nullable=True)
    classification_reason = Column(Text)
    repost_ready_copy = Column(Text)
    original_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    account = relationship("Account", back_populates="content")
    classification = relationship("Classification", back_populates="content", uselist=False, cascade="all, delete-orphan")
    tags = relationship("ContentTag", back_populates="content", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_account_evergreen", "account_id", "is_evergreen"),
        Index("idx_posted_at", "posted_at"),
        Index("idx_platform_id", "platform_id"),
    )

    def __repr__(self):
        return f"<Content {self.id}>"


class Classification(Base):
    __tablename__ = "classifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_id = Column(UUID(as_uuid=True), ForeignKey("content.id"), nullable=False)
    classifier_version = Column(String(50), default="1.0")
    confidence_score = Column(Float, nullable=False)
    detected_categories = Column(JSON, default=list)  # evergreen_topic, time_ref, year_ref, etc
    time_sensitive_indicators = Column(JSON, default=list)
    evergreen_indicators = Column(JSON, default=list)
    reason = Column(Text)
    manual_override = Column(Boolean, default=False)
    manual_override_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    content = relationship("Content", back_populates="classification")

    def __repr__(self):
        return f"<Classification {self.id}>"


class ContentTag(Base):
    __tablename__ = "content_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_id = Column(UUID(as_uuid=True), ForeignKey("content.id"), nullable=False)
    tag = Column(String(255), nullable=False)
    source = Column(String(50), default="auto")  # auto or manual
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    content = relationship("Content", back_populates="tags")

    def __repr__(self):
        return f"<ContentTag {self.tag}>"
