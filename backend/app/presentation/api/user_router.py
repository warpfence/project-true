"""사용자 API 라우터.

GET /api/users/me (내 정보 조회)
PATCH /api/users/me (닉네임 수정)
"""

import re
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto.user_dto import UpdateUserRequest, UserResponse
from app.domain.repositories.user_repository import AbstractUserRepository
from app.presentation.dependencies import get_user_repository
from app.presentation.middleware.auth_middleware import get_current_user_id

router = APIRouter(prefix="/api/users", tags=["사용자"])


@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: UUID = Depends(get_current_user_id),
    user_repo: AbstractUserRepository = Depends(get_user_repository),
):
    """현재 로그인한 사용자 정보를 반환한다."""
    user = await user_repo.find_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )

    return UserResponse(
        id=str(user.id),
        email=user.email,
        nickname=user.nickname,
        profile_image_url=user.profile_image_url,
    )


@router.patch("/me", response_model=UserResponse)
async def update_me(
    request: UpdateUserRequest,
    user_id: UUID = Depends(get_current_user_id),
    user_repo: AbstractUserRepository = Depends(get_user_repository),
):
    """현재 사용자의 닉네임을 수정한다."""
    # 닉네임 유효성 검증
    nickname = request.nickname.strip()
    if not nickname:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="닉네임을 입력해 주세요.",
        )
    if len(nickname) > 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="닉네임은 30자 이내로 입력해 주세요.",
        )
    if not re.match(r"^[가-힣a-zA-Z0-9_\- ]+$", nickname):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="닉네임은 한글, 영문, 숫자, 밑줄, 하이픈, 공백만 사용할 수 있습니다.",
        )

    user = await user_repo.find_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다.",
        )

    user.nickname = nickname
    updated = await user_repo.update(user)

    return UserResponse(
        id=str(updated.id),
        email=updated.email,
        nickname=updated.nickname,
        profile_image_url=updated.profile_image_url,
    )
