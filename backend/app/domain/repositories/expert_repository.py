"""전문가 리포지토리 추상 인터페이스."""

from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities.expert import Expert


class AbstractExpertRepository(ABC):
    """전문가 데이터 접근을 위한 추상 인터페이스."""

    @abstractmethod
    async def find_all(self) -> list[Expert]:
        """모든 전문가를 조회한다."""
        ...

    @abstractmethod
    async def find_by_id(self, expert_id: UUID) -> Expert | None:
        """ID로 전문가를 조회한다."""
        ...

    @abstractmethod
    async def find_by_type(self, expert_type: str) -> Expert | None:
        """분야 코드로 전문가를 조회한다."""
        ...

    @abstractmethod
    async def save(self, expert: Expert) -> Expert:
        """전문가를 저장한다."""
        ...
