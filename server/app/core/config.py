from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Required Supabase settings
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # Optional settings with defaults
    ALLOWED_EXTENSIONS: str = "pdf,jpg,jpeg,png,txt"
    MAX_FILE_SIZE: int = 10485760  # 10MB
    UPLOAD_PATH: str = "uploads/"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

settings = Settings()