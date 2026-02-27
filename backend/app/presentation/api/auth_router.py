"""인증 API 라우터.

POST /api/auth/google, POST /api/auth/refresh, GET /api/auth/me
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto.auth_dto import (
    GoogleLoginRequest,
    RefreshRequest,
    TokenResponse,
)
from app.application.use_cases.auth_user import AuthUserUseCase
from app.domain.repositories.user_repository import AbstractUserRepository
from app.infrastructure.config.settings import Settings, get_settings
from app.infrastructure.external.google_auth import GoogleAuthVerifier
from app.presentation.dependencies import get_user_repository
from app.presentation.middleware.auth_middleware import get_current_user_id

router = APIRouter(prefix="/api/auth", tags=["인증"])


def get_auth_use_case(
    user_repo: AbstractUserRepository = Depends(get_user_repository),
    settings: Settings = Depends(get_settings),
) -> AuthUserUseCase:
    """인증 Use Case 의존성을 제공한다."""
    return AuthUserUseCase(
        user_repository=user_repo,
        google_verifier=GoogleAuthVerifier(),
        settings=settings,
    )


@router.post("/google", response_model=TokenResponse)
async def google_login(
    request: GoogleLoginRequest,
    use_case: AuthUserUseCase = Depends(get_auth_use_case),
):
    """구글 ID Token으로 로그인/회원가입을 처리한다."""
    try:
        return await use_case.login_with_google(request.id_token)
    except ValueError as e:
        error_msg = str(e)
        if "이메일 인증" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg,
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 Google ID Token입니다.",
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshRequest,
    use_case: AuthUserUseCase = Depends(get_auth_use_case),
):
    """JWT Access Token을 갱신한다."""
    try:
        return await use_case.refresh_token(request.refresh_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않거나 만료된 Refresh Token입니다.",
        )


@router.get("/me")
async def get_me(
    user_id: UUID = Depends(get_current_user_id),
    use_case: AuthUserUseCase = Depends(get_auth_use_case),
):
    """현재 로그인 사용자 정보를 조회한다."""
    try:
        user = await use_case.get_current_user(user_id)
        return {
            "id": str(user.id),
            "email": user.email,
            "nickname": user.nickname,
            "profile_image_url": user.profile_image_url,
            "subscription_type": user.subscription_type,
            "created_at": user.created_at.isoformat(),
        }
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 실패",
        )
