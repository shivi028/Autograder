# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    ALLOWED_EXTENSIONS: str = "pdf,jpg,jpeg,png,txt"
    MAX_FILE_SIZE: int = 10485760  # 10MB
    UPLOAD_PATH: str = "uploads/"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    class Config:
        extra = "ignore"
        case_sensitive = False

settings = Settings()
