"""인증 Use Case.

Google ID Token 검증 → DB upsert → JWT 발급 흐름을 처리한다.
"""

from datetime import datetime, timedelta, timezone
from uuid import UUID

from jose import jwt

from app.domain.entities.user import User
from app.domain.repositories.user_repository import AbstractUserRepository
from app.infrastructure.external.google_auth import GoogleAuthVerifier
from app.infrastructure.config.settings import Settings
from app.application.dto.auth_dto import TokenResponse


class AuthUserUseCase:
    """사용자 인증 Use Case."""

    def __init__(
        self,
        user_repository: AbstractUserRepository,
        google_verifier: GoogleAuthVerifier,
        settings: Settings,
    ) -> None:
        self._user_repo = user_repository
        self._google_verifier = google_verifier
        self._settings = settings

    async def login_with_google(self, id_token_str: str) -> TokenResponse:
        """구글 ID Token으로 로그인/회원가입을 처리한다.

        Args:
            id_token_str: Google ID Token 문자열

        Returns:
            JWT 토큰 응답 (access_token, refresh_token)
        """
        # 1. Google ID Token 검증
        google_info = await self._google_verifier.verify_id_token(id_token_str)

        # 2. DB에서 사용자 조회 또는 생성 (upsert)
        user = await self._user_repo.find_by_google_id(google_info["google_id"])
        if user is None:
            user = User(
                google_id=google_info["google_id"],
                email=google_info["email"],
                nickname=google_info["name"] or google_info["email"].split("@")[0],
                profile_image_url=google_info.get("picture"),
            )
            user = await self._user_repo.save(user)
        else:
            # 프로필 이미지 URL 갱신
            if google_info.get("picture") and user.profile_image_url != google_info["picture"]:
                user.profile_image_url = google_info["picture"]
                user = await self._user_repo.update(user)

        # 3. JWT 발급
        return self._create_tokens(user.id)

    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        """Refresh Token으로 Access Token을 갱신한다.

        Args:
            refresh_token: JWT Refresh Token

        Returns:
            새 JWT 토큰 응답
        """
        try:
            payload = jwt.decode(
                refresh_token,
                self._settings.jwt_secret_key,
                algorithms=[self._settings.jwt_algorithm],
            )
            if payload.get("type") != "refresh":
                raise ValueError("유효하지 않은 Refresh Token입니다.")

            user_id = UUID(payload["sub"])
            user = await self._user_repo.find_by_id(user_id)
            if user is None:
                raise ValueError("사용자를 찾을 수 없습니다.")

            return self._create_tokens(user_id)
        except Exception:
            raise ValueError("유효하지 않거나 만료된 Refresh Token입니다.")

    async def get_current_user(self, user_id: UUID) -> User:
        """현재 사용자 정보를 반환한다."""
        user = await self._user_repo.find_by_id(user_id)
        if user is None:
            raise ValueError("사용자를 찾을 수 없습니다.")
        return user

    def _create_tokens(self, user_id: UUID) -> TokenResponse:
        """Access Token과 Refresh Token을 생성한다."""
        now = datetime.now(timezone.utc)

        # Access Token
        access_payload = {
            "sub": str(user_id),
            "type": "access",
            "exp": now + timedelta(minutes=self._settings.jwt_expire_minutes),
            "iat": now,
        }
        access_token = jwt.encode(
            access_payload,
            self._settings.jwt_secret_key,
            algorithm=self._settings.jwt_algorithm,
        )

        # Refresh Token
        refresh_payload = {
            "sub": str(user_id),
            "type": "refresh",
            "exp": now + timedelta(days=self._settings.jwt_refresh_expire_days),
            "iat": now,
        }
        refresh_token = jwt.encode(
            refresh_payload,
            self._settings.jwt_secret_key,
            algorithm=self._settings.jwt_algorithm,
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=self._settings.jwt_expire_minutes * 60,
        )
