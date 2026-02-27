"""AI 클라이언트 추상 인터페이스.

Gemini 등 AI 모델과의 통신을 위한 추상 계약을 정의한다.
"""

from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator


class AbstractAIClient(ABC):
    """AI 모델 클라이언트 추상 인터페이스."""

    @abstractmethod
    async def stream_response(
        self,
        system_instruction: str,
        messages: list[dict[str, str]],
        new_message: str,
    ) -> AsyncGenerator[str, None]:
        """AI 모델에 스트리밍 응답을 요청한다.

        Args:
            system_instruction: 전문가 시스템 프롬프트
            messages: 이전 대화 이력 [{"role": "user"|"assistant", "content": "..."}]
            new_message: 사용자의 새 메시지

        Yields:
            AI 응답 텍스트 청크
        """
        ...
