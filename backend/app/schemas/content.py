from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from uuid import UUID


class ClassificationSchema(BaseModel):
    confidence_score: float
    categories: List[str] = Field(default_factory=list)
    reason: str
    time_sensitive_indicators: List[str] = Field(default_factory=list)
    evergreen_indicators: List[str] = Field(default_factory=list)

    class Config:
        from_attributes = True


class AccountMinimalSchema(BaseModel):
    id: UUID
    handle: str
    account_name: str
    platform: str
    profile_url: Optional[str] = None

    class Config:
        from_attributes = True


class ContentSchema(BaseModel):
    id: UUID
    account: AccountMinimalSchema
    content_type: str
    text_content: Optional[str] = None
    media_urls: List[str] = Field(default_factory=list)
    hashtags: List[str] = Field(default_factory=list)
    engagement: Dict[str, Any] = Field(default_factory=dict)
    is_evergreen: Optional[bool] = None
    classification_score: Optional[float] = None
    classification_reason: Optional[str] = None
    classification: Optional[ClassificationSchema] = None
    repost_ready_copy: Optional[str] = None
    posted_at: datetime
    original_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ContentListResponse(BaseModel):
    items: List[ContentSchema]
    total: int
    has_more: bool
    limit: int
    offset: int
