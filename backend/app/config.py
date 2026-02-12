from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./evergreen.db"

    # Social Media API Keys
    twitter_bearer_token: Optional[str] = None
    twitter_api_key: Optional[str] = None
    twitter_api_secret: Optional[str] = None

    instagram_username: Optional[str] = None
    instagram_password: Optional[str] = None

    linkedin_api_key: Optional[str] = None

    # App Settings
    app_name: str = "Evergreen Content Tracker"
    sync_interval_hours: int = 6

    # Security
    encryption_key: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
