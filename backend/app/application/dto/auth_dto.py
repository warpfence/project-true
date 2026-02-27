"""인증 관련 DTO (Data Transfer Object)."""

from pydantic import BaseModel


class GoogleLoginRequest(BaseModel):
    """구글 로그인 요청."""

    id_token: str


class TokenResponse(BaseModel):
    """JWT 토큰 응답."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    """토큰 갱신 요청."""

    refresh_token: str
