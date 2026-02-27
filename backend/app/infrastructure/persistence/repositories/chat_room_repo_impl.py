"""채팅방 리포지토리 구현체."""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.chat_room import ChatRoom
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.infrastructure.persistence.models import ChatRoomModel


class ChatRoomRepositoryImpl(AbstractChatRoomRepository):
    """SQLAlchemy 기반 채팅방 리포지토리 구현체."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: ChatRoomModel) -> ChatRoom:
        """ORM 모델을 도메인 엔티티로 변환한다."""
        return ChatRoom(
            id=model.id,
            user_id=model.user_id,
            expert_id=model.expert_id,
            title=model.title,
            status=model.status,
            summary=model.summary,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    async def find_by_id(self, room_id: UUID) -> ChatRoom | None:
        """ID로 채팅방을 조회한다."""
        result = await self._session.get(ChatRoomModel, room_id)
        return self._to_entity(result) if result else None

    async def find_by_user_id(
        self,
        user_id: UUID,
        status: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[ChatRoom]:
        """사용자 ID로 채팅방 목록을 조회한다."""
        stmt = (
            select(ChatRoomModel)
            .where(ChatRoomModel.user_id == user_id)
            .order_by(ChatRoomModel.updated_at.desc())
            .limit(limit)
            .offset(offset)
        )
        if status:
            stmt = stmt.where(ChatRoomModel.status == status)
        result = await self._session.execute(stmt)
        return [self._to_entity(m) for m in result.scalars().all()]

    async def count_by_user_id(
        self, user_id: UUID, status: str | None = None
    ) -> int:
        """사용자의 채팅방 수를 반환한다."""
        stmt = select(func.count()).where(
            ChatRoomModel.user_id == user_id
        )
        if status:
            stmt = stmt.where(ChatRoomModel.status == status)
        result = await self._session.execute(stmt)
        return result.scalar_one()

    async def save(self, chat_room: ChatRoom) -> ChatRoom:
        """채팅방을 저장(생성)한다."""
        model = ChatRoomModel(
            id=chat_room.id,
            user_id=chat_room.user_id,
            expert_id=chat_room.expert_id,
            title=chat_room.title,
            status=chat_room.status,
            summary=chat_room.summary,
        )
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)

    async def update(self, chat_room: ChatRoom) -> ChatRoom:
        """채팅방 정보를 갱신한다."""
        model = await self._session.get(ChatRoomModel, chat_room.id)
        if model is None:
            raise ValueError(f"채팅방을 찾을 수 없습니다: {chat_room.id}")
        model.title = chat_room.title
        model.status = chat_room.status
        model.summary = chat_room.summary
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)
