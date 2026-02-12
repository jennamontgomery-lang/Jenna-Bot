from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from ...database import get_db
from ...models import Account, Content, Classification
from ...services.fetcher import ContentFetcher
from ...services.classifier import ContentClassifier

router = APIRouter()


@router.get("/sync-status")
async def get_sync_status(db: Session = Depends(get_db)):
    """Get current sync status and statistics"""
    accounts = db.query(Account).all()
    total_content = db.query(Content).count()
    evergreen_content = db.query(Content).filter(Content.is_evergreen == True).count()
    unclassified_content = db.query(Content).filter(Content.is_evergreen == None).count()

    account_statuses = []
    for account in accounts:
        content_count = db.query(Content).filter(Content.account_id == account.id).count()
        evergreen_count = db.query(Content).filter(
            Content.account_id == account.id,
            Content.is_evergreen == True
        ).count()

        account_statuses.append({
            "id": str(account.id),
            "handle": account.handle,
            "platform": account.platform,
            "is_active": account.is_active,
            "last_synced": account.last_synced.isoformat() if account.last_synced else None,
            "content_count": content_count,
            "evergreen_count": evergreen_count,
        })

    return {
        "total_accounts": len(accounts),
        "active_accounts": sum(1 for a in accounts if a.is_active),
        "total_content": total_content,
        "evergreen_content": evergreen_content,
        "unclassified_content": unclassified_content,
        "accounts": account_statuses,
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.post("/trigger-sync")
async def trigger_sync(db: Session = Depends(get_db)):
    """Manually trigger content sync for all active accounts"""
    fetcher = ContentFetcher(db)
    result = fetcher.fetch_all_accounts()

    # Auto-classify new content
    classifier = ContentClassifier(db)
    classification_result = classifier.classify_all_unclassified()

    return {
        "fetch_result": result,
        "classification_result": classification_result,
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/classifications/stats")
async def get_classification_stats(db: Session = Depends(get_db)):
    """Get classification statistics"""
    total_content = db.query(Content).count()
    classified_content = db.query(Content).filter(Content.is_evergreen != None).count()
    evergreen_content = db.query(Content).filter(Content.is_evergreen == True).count()
    time_sensitive_content = db.query(Content).filter(Content.is_evergreen == False).count()

    # Calculate average confidence score
    classifications = db.query(Classification).all()
    avg_confidence = 0
    if classifications:
        avg_confidence = sum(c.confidence_score for c in classifications) / len(classifications)

    # Get most common categories
    categories = {}
    for classification in classifications:
        if classification.detected_categories:
            for cat in classification.detected_categories:
                categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_content": total_content,
        "classified_content": classified_content,
        "evergreen_content": evergreen_content,
        "time_sensitive_content": time_sensitive_content,
        "classification_rate": f"{(classified_content / total_content * 100):.1f}%" if total_content > 0 else "0%",
        "average_confidence": f"{avg_confidence:.2f}",
        "top_categories": sorted(categories.items(), key=lambda x: x[1], reverse=True)[:10],
    }


@router.post("/classify-all")
async def classify_all_content(db: Session = Depends(get_db)):
    """Classify all unclassified content"""
    classifier = ContentClassifier(db)
    result = classifier.classify_all_unclassified()

    return {
        "message": "Classification completed",
        "result": result,
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/system-info")
async def get_system_info(db: Session = Depends(get_db)):
    """Get system information and health status"""
    try:
        # Test database connection
        db.query(Account).limit(1).all()
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "running",
        "database": db_status,
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }
