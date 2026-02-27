"""Google ID Token 검증 모듈.

google-auth 라이브러리를 사용하여 Google OAuth ID Token을 검증한다.
"""

from google.oauth2 import id_token
from google.auth.transport import requests

from app.infrastructure.config.settings import get_settings


class GoogleAuthVerifier:
    """Google ID Token 검증기."""

    def __init__(self) -> None:
        self._settings = get_settings()

    async def verify_id_token(self, token: str) -> dict:
        """Google ID Token을 검증하고 사용자 정보를 반환한다.

        Args:
            token: Google에서 발급한 ID Token

        Returns:
            사용자 정보 딕셔너리 (sub, email, name, picture 등)

        Raises:
            ValueError: 토큰 검증 실패 시
        """
        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                self._settings.google_client_id,
            )

            # 발급자 검증
            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                raise ValueError("잘못된 토큰 발급자입니다.")

            # 이메일 인증 여부 확인
            if not idinfo.get("email_verified", False):
                raise ValueError("이메일 인증이 완료되지 않은 계정입니다.")

            return {
                "google_id": idinfo["sub"],
                "email": idinfo["email"],
                "name": idinfo.get("name", ""),
                "picture": idinfo.get("picture"),
            }
        except ValueError as e:
            raise ValueError(f"Google ID Token 검증 실패: {e}")
