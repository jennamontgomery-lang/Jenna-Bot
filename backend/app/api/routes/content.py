from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from ...database import get_db
from ...models import Content, Account
from ...schemas import ContentSchema, ContentListResponse
from ...services.classifier import ContentClassifier

router = APIRouter()


@router.get("", response_model=ContentListResponse)
async def list_content(
    db: Session = Depends(get_db),
    account_id: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    is_evergreen: Optional[bool] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort_by: str = Query("date", regex="^(date|engagement|classification_score)$"),
):
    """
    List content with filtering and pagination

    Query Parameters:
    - account_id: Filter by account UUID
    - platform: Filter by platform (twitter, instagram, linkedin)
    - is_evergreen: Filter by evergreen status
    - category: Filter by category
    - search: Full-text search
    - limit: Results per page (1-100)
    - offset: Pagination offset
    - sort_by: Sort by date, engagement, or classification_score
    """

    query = db.query(Content)

    # Apply filters
    if account_id:
        query = query.filter(Content.account_id == account_id)

    if platform:
        query = query.join(Account).filter(Account.platform == platform)

    if is_evergreen is not None:
        query = query.filter(Content.is_evergreen == is_evergreen)

    if search:
        search_term = f"%{search}%"
        query = query.filter(Content.text_content.ilike(search_term))

    # Apply sorting
    if sort_by == "date":
        query = query.order_by(Content.posted_at.desc())
    elif sort_by == "engagement":
        # Sort by likes count from engagement JSON
        query = query.order_by(Content.engagement["likes"].desc())
    elif sort_by == "classification_score":
        query = query.order_by(Content.classification_score.desc())

    # Get total count
    total = query.count()

    # Apply pagination
    content_items = query.offset(offset).limit(limit).all()

    # Build response
    items = []
    for content in content_items:
        schema_dict = {
            "id": content.id,
            "account": {
                "id": content.account.id,
                "handle": content.account.handle,
                "account_name": content.account.account_name,
                "platform": content.account.platform,
                "profile_url": content.account.profile_url,
            },
            "content_type": content.content_type,
            "text_content": content.text_content,
            "media_urls": content.media_urls or [],
            "hashtags": content.hashtags or [],
            "engagement": content.engagement or {},
            "is_evergreen": content.is_evergreen,
            "classification_score": content.classification_score,
            "classification_reason": content.classification_reason,
            "repost_ready_copy": content.repost_ready_copy,
            "posted_at": content.posted_at,
            "original_url": content.original_url,
            "created_at": content.created_at,
        }

        if content.classification:
            schema_dict["classification"] = {
                "confidence_score": content.classification.confidence_score,
                "categories": content.classification.detected_categories or [],
                "reason": content.classification.reason,
                "time_sensitive_indicators": content.classification.time_sensitive_indicators or [],
                "evergreen_indicators": content.classification.evergreen_indicators or [],
            }

        items.append(ContentSchema(**schema_dict))

    return ContentListResponse(
        items=items,
        total=total,
        has_more=offset + limit < total,
        limit=limit,
        offset=offset,
    )


@router.get("/{content_id}", response_model=ContentSchema)
async def get_content(content_id: str, db: Session = Depends(get_db)):
    """Get a single content item by ID"""
    content = db.query(Content).filter(Content.id == content_id).first()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    schema_dict = {
        "id": content.id,
        "account": {
            "id": content.account.id,
            "handle": content.account.handle,
            "account_name": content.account.account_name,
            "platform": content.account.platform,
            "profile_url": content.account.profile_url,
        },
        "content_type": content.content_type,
        "text_content": content.text_content,
        "media_urls": content.media_urls or [],
        "hashtags": content.hashtags or [],
        "engagement": content.engagement or {},
        "is_evergreen": content.is_evergreen,
        "classification_score": content.classification_score,
        "classification_reason": content.classification_reason,
        "repost_ready_copy": content.repost_ready_copy,
        "posted_at": content.posted_at,
        "original_url": content.original_url,
        "created_at": content.created_at,
    }

    if content.classification:
        schema_dict["classification"] = {
            "confidence_score": content.classification.confidence_score,
            "categories": content.classification.detected_categories or [],
            "reason": content.classification.reason,
            "time_sensitive_indicators": content.classification.time_sensitive_indicators or [],
            "evergreen_indicators": content.classification.evergreen_indicators or [],
        }

    return ContentSchema(**schema_dict)


@router.post("/{content_id}/classify")
async def classify_content(content_id: str, db: Session = Depends(get_db)):
    """Force re-classification of content"""
    content = db.query(Content).filter(Content.id == content_id).first()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    classifier = ContentClassifier(db)
    success = classifier.classify_and_save(content)

    if not success:
        raise HTTPException(status_code=500, detail="Classification failed")

    return {
        "id": content.id,
        "is_evergreen": content.is_evergreen,
        "classification_score": content.classification_score,
        "reason": content.classification_reason,
    }


@router.post("/{content_id}/override")
async def override_classification(
    content_id: str,
    db: Session = Depends(get_db),
    is_evergreen: bool = None,
):
    """Manually override content classification"""
    content = db.query(Content).filter(Content.id == content_id).first()

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    if is_evergreen is not None:
        content.is_evergreen = is_evergreen

        if content.classification:
            content.classification.manual_override = True
            content.classification.reason = f"Manually overridden to {is_evergreen}"

        db.commit()

    return {
        "id": content.id,
        "is_evergreen": content.is_evergreen,
        "message": "Classification overridden",
    }
