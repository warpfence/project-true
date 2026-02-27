"""상담 요약 Use Case.

대화 이력을 기반으로 Gemini를 통해 요약을 생성하고,
채팅방 제목과 상태를 업데이트한다.
"""

import json
import logging
from uuid import UUID

from app.application.interfaces.ai_client import AbstractAIClient
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)

logger = logging.getLogger(__name__)

SUMMARY_PROMPT = """다음 상담 대화를 분석하여 요약을 생성해 주세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트를 포함하지 마세요.

{
  "topic": "상담 주제 (한 줄 요약)",
  "key_advice": ["핵심 조언 1", "핵심 조언 2", "핵심 조언 3"],
  "action_items": ["다음 행동 1", "다음 행동 2", "다음 행동 3"]
}

조건:
- topic: 상담의 핵심 주제를 한 문장으로 요약
- key_advice: 상담에서 제공된 주요 조언 3개
- action_items: 사용자가 취할 수 있는 구체적 행동 3개
"""


class SummarizeConsultationUseCase:
    """상담을 요약하고 마무리한다."""

    def __init__(
        self,
        chat_room_repository: AbstractChatRoomRepository,
        message_repository: AbstractMessageRepository,
        ai_client: AbstractAIClient,
    ) -> None:
        self._chat_room_repo = chat_room_repository
        self._message_repo = message_repository
        self._ai_client = ai_client

    async def execute(self, user_id: UUID, room_id: UUID) -> dict:
        """상담 요약을 생성한다.

        Args:
            user_id: 현재 사용자 ID
            room_id: 채팅방 ID

        Returns:
            요약 정보 딕셔너리

        Raises:
            ValueError: 채팅방이 없거나 권한이 없는 경우
        """
        # 1. 채팅방 검증
        chat_room = await self._chat_room_repo.find_by_id(room_id)
        if chat_room is None:
            raise ValueError("채팅방을 찾을 수 없습니다.")
        if chat_room.user_id != user_id:
            raise ValueError("해당 채팅방에 접근 권한이 없습니다.")
        if chat_room.status == "completed":
            raise ValueError("이미 요약이 생성된 상담입니다.")

        # 2. 대화 이력 조회
        messages = await self._message_repo.find_by_chat_room_id(
            chat_room_id=room_id,
            limit=100,
        )
        messages.sort(key=lambda m: m.created_at)

        if len(messages) < 2:
            raise ValueError("요약을 생성하려면 최소 2개 이상의 메시지가 필요합니다.")

        # 3. 대화 이력 텍스트 구성
        conversation_text = "\n".join(
            f"{'사용자' if msg.role == 'user' else 'AI 전문가'}: {msg.content}"
            for msg in messages
        )

        # 4. Gemini로 요약 생성
        full_response = ""
        async for chunk in self._ai_client.stream_response(
            system_instruction=SUMMARY_PROMPT,
            messages=[],
            new_message=conversation_text,
        ):
            full_response += chunk

        # 5. JSON 파싱
        summary = self._parse_summary(full_response)

        # 6. 채팅방 업데이트 (요약 저장 + 상태 변경 + 제목 설정)
        chat_room.summary = json.dumps(summary, ensure_ascii=False)
        chat_room.status = "completed"
        chat_room.title = summary.get("topic", "상담 완료")
        await self._chat_room_repo.update(chat_room)

        return {
            "room_id": str(room_id),
            "title": chat_room.title,
            "summary": summary,
            "status": chat_room.status,
        }

    @staticmethod
    def _parse_summary(response: str) -> dict:
        """AI 응답에서 JSON 요약을 추출한다."""
        # JSON 블록 추출 시도
        text = response.strip()

        # ```json ... ``` 블록 처리
        if "```json" in text:
            start = text.index("```json") + 7
            end = text.index("```", start)
            text = text[start:end].strip()
        elif "```" in text:
            start = text.index("```") + 3
            end = text.index("```", start)
            text = text[start:end].strip()

        try:
            summary = json.loads(text)
            # 필수 키 검증
            if not isinstance(summary.get("topic"), str):
                summary["topic"] = "상담 요약"
            if not isinstance(summary.get("key_advice"), list):
                summary["key_advice"] = []
            if not isinstance(summary.get("action_items"), list):
                summary["action_items"] = []
            return summary
        except (json.JSONDecodeError, ValueError):
            logger.warning("요약 JSON 파싱 실패, 기본 형식 사용: %s", text[:200])
            return {
                "topic": "상담 요약",
                "key_advice": ["상담 내용을 참고해 주세요."],
                "action_items": ["추가 상담이 필요하면 새 상담을 시작해 주세요."],
            }
