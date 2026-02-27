"""애플리케이션 설정 모듈.

Pydantic Settings를 사용하여 환경 변수를 관리한다.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 전체 설정."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # 데이터베이스
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ai_consultation"

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    # Gemini API
    gemini_api_key: str = ""

    # JWT
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    jwt_refresh_expire_days: int = 7

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]


def get_settings() -> Settings:
    """설정 싱글턴 인스턴스를 반환한다."""
    return Settings()
