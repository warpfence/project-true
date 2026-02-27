"""FastAPI 의존성 주입 (DI) 체이닝 설정.

get_db_session → get_*_repository → get_*_use_case 패턴을 구현한다.
"""

from collections.abc import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.persistence.database import async_session_factory
from app.infrastructure.persistence.repositories.user_repo_impl import (
    UserRepositoryImpl,
)
from app.infrastructure.persistence.repositories.expert_repo_impl import (
    ExpertRepositoryImpl,
)
from app.infrastructure.persistence.repositories.chat_room_repo_impl import (
    ChatRoomRepositoryImpl,
)
from app.infrastructure.persistence.repositories.message_repo_impl import (
    MessageRepositoryImpl,
)
from app.domain.repositories.user_repository import AbstractUserRepository
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)


# --- 세션 ---

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """비동기 DB 세션을 제공한다."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# --- 리포지토리 ---

def get_user_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AbstractUserRepository:
    """사용자 리포지토리를 제공한다."""
    return UserRepositoryImpl(session)


def get_expert_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AbstractExpertRepository:
    """전문가 리포지토리를 제공한다."""
    return ExpertRepositoryImpl(session)


def get_chat_room_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AbstractChatRoomRepository:
    """채팅방 리포지토리를 제공한다."""
    return ChatRoomRepositoryImpl(session)


def get_message_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AbstractMessageRepository:
    """메시지 리포지토리를 제공한다."""
    return MessageRepositoryImpl(session)
