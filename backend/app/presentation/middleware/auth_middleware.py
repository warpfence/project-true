"""JWT 인증 미들웨어.

HTTPBearer 스킴을 사용하여 JWT Access Token을 검증한다.
"""

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.infrastructure.config.settings import Settings, get_settings

security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    settings: Settings = Depends(get_settings),
) -> UUID:
    """JWT 토큰에서 현재 사용자 ID를 추출한다.

    Args:
        credentials: Bearer 토큰 인증 정보
        settings: 애플리케이션 설정

    Returns:
        사용자 UUID

    Raises:
        HTTPException: 토큰 검증 실패 시 401 에러
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        user_id_str: str | None = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 인증 토큰입니다.",
            )
        return UUID(user_id_str)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 만료되었거나 유효하지 않습니다.",
        )
