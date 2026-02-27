"""사용자 관련 DTO (Data Transfer Object)."""

from pydantic import BaseModel, Field


class UserResponse(BaseModel):
    """사용자 정보 응답."""

    id: str
    email: str
    nickname: str | None
    profile_image_url: str | None

    class Config:
        from_attributes = True


class UpdateUserRequest(BaseModel):
    """사용자 정보 수정 요청."""

    nickname: str = Field(..., min_length=1, max_length=30)
