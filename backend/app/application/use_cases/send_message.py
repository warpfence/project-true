"""메시지 전송 Use Case.

사용자 메시지를 DB에 저장하고, 대화 이력을 기반으로
AI 모델에 스트리밍 응답을 요청한 뒤 AI 응답을 DB에 저장한다.
"""

import logging
from collections.abc import AsyncGenerator
from uuid import UUID

from app.application.interfaces.ai_client import AbstractAIClient
from app.domain.entities.message import Message
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)

logger = logging.getLogger(__name__)


class SendMessageUseCase:
    """사용자 메시지를 처리하고 AI 응답을 스트리밍한다."""

    def __init__(
        self,
        chat_room_repository: AbstractChatRoomRepository,
        message_repository: AbstractMessageRepository,
        expert_repository: AbstractExpertRepository,
        ai_client: AbstractAIClient,
    ) -> None:
        self._chat_room_repo = chat_room_repository
        self._message_repo = message_repository
        self._expert_repo = expert_repository
        self._ai_client = ai_client

    async def execute(
        self,
        user_id: UUID,
        room_id: UUID,
        content: str,
    ) -> AsyncGenerator[str, None]:
        """메시지를 전송하고 AI 응답을 스트리밍한다.

        Args:
            user_id: 현재 사용자 ID
            room_id: 채팅방 ID
            content: 사용자 메시지 내용

        Yields:
            AI 응답 텍스트 청크

        Raises:
            ValueError: 채팅방이 없거나 권한이 없는 경우
        """
        # 1. 채팅방 검증
        chat_room = await self._chat_room_repo.find_by_id(room_id)
        if chat_room is None:
            raise ValueError("채팅방을 찾을 수 없습니다.")
        if chat_room.user_id != user_id:
            raise ValueError("해당 채팅방에 접근 권한이 없습니다.")
        if chat_room.status != "active":
            raise ValueError("이미 종료된 상담입니다.")

        # 2. 사용자 메시지 저장
        user_message = Message(
            chat_room_id=room_id,
            role="user",
            content=content,
        )
        await self._message_repo.save(user_message)

        # 3. 전문가 정보 및 대화 이력 조회
        expert = await self._expert_repo.find_by_id(chat_room.expert_id)
        if expert is None:
            raise ValueError("전문가 정보를 찾을 수 없습니다.")

        history = await self._message_repo.find_by_chat_room_id(
            chat_room_id=room_id,
            limit=50,
        )

        # 이력을 시간순으로 정렬 (가장 오래된 것부터)
        history.sort(key=lambda m: m.created_at)

        # 새 사용자 메시지를 제외한 이전 대화를 Gemini 형식으로 변환
        messages = [
            {"role": msg.role, "content": msg.content}
            for msg in history
            if msg.id != user_message.id
        ]

        # 4. AI 스트리밍 응답 생성 및 전체 응답 수집
        full_response = ""
        async for chunk in self._ai_client.stream_response(
            system_instruction=expert.system_prompt,
            messages=messages,
            new_message=content,
        ):
            full_response += chunk
            yield chunk

        # 5. AI 응답 메시지 DB 저장
        ai_message = Message(
            chat_room_id=room_id,
            role="assistant",
            content=full_response,
        )
        await self._message_repo.save(ai_message)
        logger.info("AI 응답 저장 완료: room_id=%s, 길이=%d", room_id, len(full_response))
