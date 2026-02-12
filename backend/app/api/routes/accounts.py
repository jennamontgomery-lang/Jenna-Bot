from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from ...database import get_db
from ...models import Account
from ...schemas import AccountSchema, AccountCreateSchema, AccountUpdateSchema
from ...services.fetcher import ContentFetcher
from ...services.social_media import TwitterFetcher, InstagramFetcher, LinkedInFetcher

router = APIRouter()

FETCHER_CLASSES = {
    "twitter": TwitterFetcher,
    "instagram": InstagramFetcher,
    "linkedin": LinkedInFetcher,
}


@router.get("")
async def list_accounts(db: Session = Depends(get_db)):
    """List all configured social media accounts"""
    accounts = db.query(Account).all()

    return [
        {
            "id": acc.id,
            "platform": acc.platform,
            "handle": acc.handle,
            "account_name": acc.account_name,
            "profile_url": acc.profile_url,
            "is_active": acc.is_active,
            "last_synced": acc.last_synced.isoformat() if acc.last_synced else None,
        }
        for acc in accounts
    ]


@router.post("", response_model=AccountSchema)
async def create_account(
    account: AccountCreateSchema,
    db: Session = Depends(get_db),
):
    """Add a new social media account"""

    # Validate platform
    if account.platform not in FETCHER_CLASSES:
        raise HTTPException(
            status_code=400,
            detail=f"Platform must be one of: {', '.join(FETCHER_CLASSES.keys())}",
        )

    # Check for duplicate handle
    existing = db.query(Account).filter(Account.handle == account.handle).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists")

    # Validate credentials by attempting authentication
    fetcher_class = FETCHER_CLASSES[account.platform]
    fetcher = fetcher_class(account.credentials)

    if not fetcher.authenticate():
        raise HTTPException(
            status_code=401,
            detail="Failed to authenticate with platform. Check credentials.",
        )

    # Create account record
    new_account = Account(
        platform=account.platform,
        handle=account.handle,
        account_name=account.account_name,
        profile_url=account.profile_url,
        credentials_encrypted=str(account.credentials),  # TODO: Encrypt before storing
        is_active=True,
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return AccountSchema.from_orm(new_account)


@router.get("/{account_id}", response_model=AccountSchema)
async def get_account(account_id: str, db: Session = Depends(get_db)):
    """Get account details"""
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return AccountSchema.from_orm(account)


@router.patch("/{account_id}", response_model=AccountSchema)
async def update_account(
    account_id: str,
    update: AccountUpdateSchema,
    db: Session = Depends(get_db),
):
    """Update account settings"""
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if update.account_name:
        account.account_name = update.account_name

    if update.is_active is not None:
        account.is_active = update.is_active

    if update.credentials:
        account.credentials_encrypted = str(update.credentials)

    db.commit()
    db.refresh(account)

    return AccountSchema.from_orm(account)


@router.delete("/{account_id}")
async def delete_account(account_id: str, db: Session = Depends(get_db)):
    """Remove an account"""
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    db.delete(account)
    db.commit()

    return {"message": "Account deleted successfully"}


@router.post("/{account_id}/sync")
async def sync_account(account_id: str, db: Session = Depends(get_db)):
    """Trigger manual sync for an account"""
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not account.is_active:
        raise HTTPException(status_code=400, detail="Account is not active")

    try:
        fetcher = ContentFetcher(db)
        result = fetcher.fetch_account(account)

        return {
            "message": "Sync completed",
            "result": result,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
