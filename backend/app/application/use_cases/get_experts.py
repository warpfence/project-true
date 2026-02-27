"""전문가 조회 Use Case."""

from app.domain.entities.expert import Expert
from app.domain.repositories.expert_repository import AbstractExpertRepository


class GetExpertsUseCase:
    """전문가 목록 조회 및 타입별 조회를 처리한다."""

    def __init__(self, expert_repository: AbstractExpertRepository) -> None:
        self._expert_repo = expert_repository

    async def get_all(self) -> list[Expert]:
        """전체 전문가 목록을 반환한다."""
        return await self._expert_repo.find_all()

    async def get_by_type(self, expert_type: str) -> Expert:
        """분야 코드로 전문가를 조회한다.

        Raises:
            ValueError: 해당 분야의 전문가가 없는 경우
        """
        expert = await self._expert_repo.find_by_type(expert_type)
        if expert is None:
            raise ValueError(f"해당 분야의 전문가가 없습니다: {expert_type}")
        return expert
