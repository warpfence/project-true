"""Gemini AI 클라이언트.

google-genai SDK를 사용하여 Gemini 모델과 비동기 스트리밍 통신한다.
"""

import logging
from collections.abc import AsyncGenerator

from google import genai
from google.genai import types

from app.application.interfaces.ai_client import AbstractAIClient
from app.infrastructure.config.settings import get_settings

logger = logging.getLogger(__name__)


class GeminiClient(AbstractAIClient):
    """Google Gemini API 클라이언트."""

    MODEL_NAME = "gemini-2.5-flash"

    def __init__(self) -> None:
        settings = get_settings()
        self._client = genai.Client(api_key=settings.gemini_api_key)

    async def stream_response(
        self,
        system_instruction: str,
        messages: list[dict[str, str]],
        new_message: str,
    ) -> AsyncGenerator[str, None]:
        """Gemini 모델에 스트리밍 응답을 요청한다."""
        # 대화 이력을 Gemini 형식으로 변환
        contents = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])],
                )
            )

        # 새 사용자 메시지 추가
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=new_message)],
            )
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.8,
            max_output_tokens=2048,
        )

        try:
            stream = await self._client.aio.models.generate_content_stream(
                model=self.MODEL_NAME,
                contents=contents,
                config=config,
            )
            async for chunk in stream:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            logger.error("Gemini API 호출 실패: %s", e)
            raise RuntimeError(f"AI 응답 생성에 실패했습니다: {e}") from e
