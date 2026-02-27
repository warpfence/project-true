"""메시지 리포지토리 구현체."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.message import Message
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)
from app.infrastructure.persistence.models import MessageModel


class MessageRepositoryImpl(AbstractMessageRepository):
    """SQLAlchemy 기반 메시지 리포지토리 구현체."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _to_entity(self, model: MessageModel) -> Message:
        """ORM 모델을 도메인 엔티티로 변환한다."""
        return Message(
            id=model.id,
            chat_room_id=model.chat_room_id,
            role=model.role,
            content=model.content,
            created_at=model.created_at,
        )

    async def find_by_chat_room_id(
        self,
        chat_room_id: UUID,
        limit: int = 50,
        before: datetime | None = None,
        latest_first: bool = False,
    ) -> list[Message]:
        """채팅방 ID로 메시지 목록을 조회한다."""
        order = MessageModel.created_at.desc() if latest_first else MessageModel.created_at.asc()
        stmt = (
            select(MessageModel)
            .where(MessageModel.chat_room_id == chat_room_id)
            .order_by(order)
            .limit(limit)
        )
        if before:
            stmt = stmt.where(MessageModel.created_at < before)
        result = await self._session.execute(stmt)
        return [self._to_entity(m) for m in result.scalars().all()]

    async def count_by_chat_room_id(self, chat_room_id: UUID) -> int:
        """채팅방의 메시지 수를 반환한다."""
        stmt = select(func.count()).where(
            MessageModel.chat_room_id == chat_room_id
        )
        result = await self._session.execute(stmt)
        return result.scalar_one()

    async def save(self, message: Message) -> Message:
        """메시지를 저장한다."""
        model = MessageModel(
            id=message.id,
            chat_room_id=message.chat_room_id,
            role=message.role,
            content=message.content,
        )
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)
