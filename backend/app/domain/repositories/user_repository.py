"""사용자 리포지토리 추상 인터페이스."""

from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities.user import User


class AbstractUserRepository(ABC):
    """사용자 데이터 접근을 위한 추상 인터페이스."""

    @abstractmethod
    async def find_by_id(self, user_id: UUID) -> User | None:
        """ID로 사용자를 조회한다."""
        ...

    @abstractmethod
    async def find_by_google_id(self, google_id: str) -> User | None:
        """구글 ID로 사용자를 조회한다."""
        ...

    @abstractmethod
    async def find_by_email(self, email: str) -> User | None:
        """이메일로 사용자를 조회한다."""
        ...

    @abstractmethod
    async def save(self, user: User) -> User:
        """사용자를 저장(생성 또는 갱신)한다."""
        ...

    @abstractmethod
    async def update(self, user: User) -> User:
        """사용자 정보를 갱신한다."""
        ...
