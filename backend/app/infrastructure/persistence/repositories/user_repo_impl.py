"""사용자 리포지토리 구현체."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.user import User
from app.domain.repositories.user_repository import AbstractUserRepository
from app.infrastructure.persistence.models import UserModel


class UserRepositoryImpl(AbstractUserRepository):
    """SQLAlchemy 기반 사용자 리포지토리 구현체."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: UserModel) -> User:
        """ORM 모델을 도메인 엔티티로 변환한다."""
        return User(
            id=model.id,
            google_id=model.google_id,
            email=model.email,
            nickname=model.nickname,
            profile_image_url=model.profile_image_url,
            subscription_type=model.subscription_type,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    async def find_by_id(self, user_id: UUID) -> User | None:
        """ID로 사용자를 조회한다."""
        result = await self._session.get(UserModel, user_id)
        return self._to_entity(result) if result else None

    async def find_by_google_id(self, google_id: str) -> User | None:
        """구글 ID로 사용자를 조회한다."""
        stmt = select(UserModel).where(UserModel.google_id == google_id)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def find_by_email(self, email: str) -> User | None:
        """이메일로 사용자를 조회한다."""
        stmt = select(UserModel).where(UserModel.email == email)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def save(self, user: User) -> User:
        """사용자를 저장(생성)한다."""
        model = UserModel(
            id=user.id,
            google_id=user.google_id,
            email=user.email,
            nickname=user.nickname,
            profile_image_url=user.profile_image_url,
            subscription_type=user.subscription_type,
        )
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)

    async def update(self, user: User) -> User:
        """사용자 정보를 갱신한다."""
        model = await self._session.get(UserModel, user.id)
        if model is None:
            raise ValueError(f"사용자를 찾을 수 없습니다: {user.id}")
        model.nickname = user.nickname
        model.profile_image_url = user.profile_image_url
        model.subscription_type = user.subscription_type
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)
