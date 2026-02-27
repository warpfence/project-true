"""전문가 리포지토리 구현체."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.expert import Expert
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.infrastructure.persistence.models import ExpertModel


class ExpertRepositoryImpl(AbstractExpertRepository):
    """SQLAlchemy 기반 전문가 리포지토리 구현체."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: ExpertModel) -> Expert:
        """ORM 모델을 도메인 엔티티로 변환한다."""
        return Expert(
            id=model.id,
            expert_type=model.expert_type,
            name=model.name,
            description=model.description,
            system_prompt=model.system_prompt,
            icon=model.icon,
            created_at=model.created_at,
        )

    async def find_all(self) -> list[Expert]:
        """모든 전문가를 조회한다."""
        stmt = select(ExpertModel).order_by(ExpertModel.created_at)
        result = await self._session.execute(stmt)
        return [self._to_entity(m) for m in result.scalars().all()]

    async def find_by_id(self, expert_id: UUID) -> Expert | None:
        """ID로 전문가를 조회한다."""
        result = await self._session.get(ExpertModel, expert_id)
        return self._to_entity(result) if result else None

    async def find_by_type(self, expert_type: str) -> Expert | None:
        """분야 코드로 전문가를 조회한다."""
        stmt = select(ExpertModel).where(
            ExpertModel.expert_type == expert_type
        )
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def save(self, expert: Expert) -> Expert:
        """전문가를 저장한다."""
        model = ExpertModel(
            id=expert.id,
            expert_type=expert.expert_type,
            name=expert.name,
            description=expert.description,
            system_prompt=expert.system_prompt,
            icon=expert.icon,
        )
        self._session.add(model)
        await self._session.flush()
        return self._to_entity(model)
