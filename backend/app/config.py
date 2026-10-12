import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def _allowed_origins() -> list[str]:
    extra = os.getenv("ALLOWED_ORIGINS", "")
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    origins.extend(item.strip() for item in extra.split(",") if item.strip())
    return origins


class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    ALLOWED_ORIGINS: list[str] = _allowed_origins()


settings = Settings()
