from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Helmet SIVIR API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    SUPABASE_URL: str = ""
    SUPABASE_PUBLISHABLE_KEY: str = ""
    SUPABASE_SECRET_KEY: str = ""
    SUPABASE_JWKS_URL: str = ""

    # CORS settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://riderserver.vercel.app",
        "https://riderserver-pspk.vercel.app",
    ]
    
    # ESP32 settings
    ESP32_PORT: str = "/dev/ttyUSB0"  # Linux
    # ESP32_PORT: str = "COM3"  # Windows
    
    class Config:
        env_file = ".env"

settings = Settings()
