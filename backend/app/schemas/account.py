from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID


class AccountCreateSchema(BaseModel):
    platform: str = Field(..., description="twitter, instagram, or linkedin")
    handle: str = Field(..., description="Account handle/username")
    account_name: str = Field(..., description="Display name of the account")
    profile_url: Optional[str] = None
    credentials: dict = Field(..., description="Platform-specific credentials")


class AccountSchema(BaseModel):
    id: UUID
    platform: str
    handle: str
    account_name: str
    profile_url: Optional[str] = None
    is_active: bool
    last_synced: Optional[str] = None

    class Config:
        from_attributes = True


class AccountUpdateSchema(BaseModel):
    account_name: Optional[str] = None
    is_active: Optional[bool] = None
    credentials: Optional[dict] = None
