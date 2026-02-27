"""채팅 API 라우터.

POST /api/chat/rooms (채팅방 생성)
POST /api/chat/rooms/{room_id}/messages (메시지 전송, SSE 스트리밍)
GET /api/chat/rooms (채팅방 목록)
GET /api/chat/rooms/{room_id} (채팅방 상세)
POST /api/chat/rooms/{room_id}/summary (요약 생성 - Phase 7)
PATCH /api/chat/rooms/{room_id} (채팅방 수정 - Phase 7)
"""

import json
import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sse_starlette.sse import EventSourceResponse

from app.application.dto.chat_dto import (
    CreateRoomRequest,
    SendMessageRequest,
    UpdateRoomRequest,
)
from app.application.interfaces.ai_client import AbstractAIClient
from app.application.use_cases.get_chat_history import GetChatHistoryUseCase
from app.application.use_cases.get_chat_room_detail import (
    GetChatRoomDetailUseCase,
)
from app.application.use_cases.send_message import SendMessageUseCase
from app.application.use_cases.start_consultation import (
    StartConsultationUseCase,
)
from app.application.use_cases.summarize_consultation import (
    SummarizeConsultationUseCase,
)
from app.domain.repositories.chat_room_repository import (
    AbstractChatRoomRepository,
)
from app.domain.repositories.expert_repository import AbstractExpertRepository
from app.domain.repositories.message_repository import (
    AbstractMessageRepository,
)
from app.infrastructure.external.gemini_client import GeminiClient
from app.presentation.dependencies import (
    get_chat_room_repository,
    get_expert_repository,
    get_message_repository,
)
from app.presentation.middleware.auth_middleware import get_current_user_id

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["채팅"])


# --- 의존성 ---

def get_ai_client() -> AbstractAIClient:
    """AI 클라이언트를 제공한다."""
    return GeminiClient()


def get_start_consultation_use_case(
    expert_repo: AbstractExpertRepository = Depends(get_expert_repository),
    chat_room_repo: AbstractChatRoomRepository = Depends(
        get_chat_room_repository
    ),
    message_repo: AbstractMessageRepository = Depends(
        get_message_repository
    ),
) -> StartConsultationUseCase:
    """상담 시작 Use Case 의존성을 제공한다."""
    return StartConsultationUseCase(
        expert_repository=expert_repo,
        chat_room_repository=chat_room_repo,
        message_repository=message_repo,
    )


def get_send_message_use_case(
    chat_room_repo: AbstractChatRoomRepository = Depends(
        get_chat_room_repository
    ),
    message_repo: AbstractMessageRepository = Depends(
        get_message_repository
    ),
    expert_repo: AbstractExpertRepository = Depends(get_expert_repository),
    ai_client: AbstractAIClient = Depends(get_ai_client),
) -> SendMessageUseCase:
    """메시지 전송 Use Case 의존성을 제공한다."""
    return SendMessageUseCase(
        chat_room_repository=chat_room_repo,
        message_repository=message_repo,
        expert_repository=expert_repo,
        ai_client=ai_client,
    )


def get_chat_history_use_case(
    chat_room_repo: AbstractChatRoomRepository = Depends(
        get_chat_room_repository
    ),
    expert_repo: AbstractExpertRepository = Depends(get_expert_repository),
    message_repo: AbstractMessageRepository = Depends(
        get_message_repository
    ),
) -> GetChatHistoryUseCase:
    """상담 이력 조회 Use Case 의존성을 제공한다."""
    return GetChatHistoryUseCase(
        chat_room_repository=chat_room_repo,
        expert_repository=expert_repo,
        message_repository=message_repo,
    )


def get_chat_room_detail_use_case(
    chat_room_repo: AbstractChatRoomRepository = Depends(
        get_chat_room_repository
    ),
    expert_repo: AbstractExpertRepository = Depends(get_expert_repository),
    message_repo: AbstractMessageRepository = Depends(
        get_message_repository
    ),
) -> GetChatRoomDetailUseCase:
    """채팅방 상세 조회 Use Case 의존성을 제공한다."""
    return GetChatRoomDetailUseCase(
        chat_room_repository=chat_room_repo,
        expert_repository=expert_repo,
        message_repository=message_repo,
    )


def get_summarize_consultation_use_case(
    chat_room_repo: AbstractChatRoomRepository = Depends(
        get_chat_room_repository
    ),
    message_repo: AbstractMessageRepository = Depends(
        get_message_repository
    ),
    ai_client: AbstractAIClient = Depends(get_ai_client),
) -> SummarizeConsultationUseCase:
    """상담 요약 Use Case 의존성을 제공한다."""
    return SummarizeConsultationUseCase(
        chat_room_repository=chat_room_repo,
        message_repository=message_repo,
        ai_client=ai_client,
    )


# --- 엔드포인트 ---


@router.post("/rooms", status_code=status.HTTP_201_CREATED)
async def create_room(
    request: CreateRoomRequest,
    user_id: UUID = Depends(get_current_user_id),
    use_case: StartConsultationUseCase = Depends(
        get_start_consultation_use_case
    ),
    expert_repo: AbstractExpertRepository = Depends(get_expert_repository),
):
    """새 채팅방을 생성한다."""
    try:
        chat_room, greeting = await use_case.execute(
            user_id=user_id,
            expert_type=request.expert_type,
        )

        expert = await expert_repo.find_by_id(chat_room.expert_id)

        return {
            "id": str(chat_room.id),
            "user_id": str(chat_room.user_id),
            "expert_id": str(chat_room.expert_id),
            "expert_name": expert.name if expert else "",
            "expert_type": expert.expert_type if expert else "",
            "expert_icon": expert.icon if expert else "",
            "title": chat_room.title,
            "status": chat_room.status,
            "created_at": chat_room.created_at.isoformat(),
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get("/rooms")
async def get_rooms(
    user_id: UUID = Depends(get_current_user_id),
    use_case: GetChatHistoryUseCase = Depends(get_chat_history_use_case),
    room_status: str | None = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """사용자의 채팅방 목록을 조회한다."""
    return await use_case.execute(
        user_id=user_id,
        status=room_status,
        limit=limit,
        offset=offset,
    )


@router.get("/rooms/{room_id}")
async def get_room_detail(
    room_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    use_case: GetChatRoomDetailUseCase = Depends(
        get_chat_room_detail_use_case
    ),
    limit: int = Query(50, ge=1, le=100),
    before: str | None = Query(None),
):
    """채팅방 상세 정보를 조회한다."""
    try:
        return await use_case.execute(
            user_id=user_id,
            room_id=room_id,
            limit=limit,
            before=before,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post("/rooms/{room_id}/messages")
async def send_message(
    room_id: UUID,
    request: SendMessageRequest,
    http_request: Request,
    user_id: UUID = Depends(get_current_user_id),
    use_case: SendMessageUseCase = Depends(get_send_message_use_case),
):
    """메시지를 전송하고 AI 응답을 SSE로 스트리밍한다.

    SSE 이벤트 형식:
    - event: chunk, data: {"content": "텍스트 청크"}
    - event: done, data: {"content": "전체 응답"}
    - event: error, data: {"message": "에러 메시지"}
    """

    async def event_generator():
        full_response = ""
        try:
            async for chunk in use_case.execute(
                user_id=user_id,
                room_id=room_id,
                content=request.content,
            ):
                if await http_request.is_disconnected():
                    logger.info("클라이언트 연결 해제: room_id=%s", room_id)
                    break

                full_response += chunk
                yield {
                    "event": "chunk",
                    "data": json.dumps(
                        {"content": chunk}, ensure_ascii=False
                    ),
                }

            yield {
                "event": "done",
                "data": json.dumps(
                    {"content": full_response}, ensure_ascii=False
                ),
            }

        except ValueError as e:
            logger.warning("메시지 전송 실패: %s", e)
            yield {
                "event": "error",
                "data": json.dumps(
                    {"message": str(e)}, ensure_ascii=False
                ),
            }
        except RuntimeError as e:
            logger.error("AI 응답 생성 실패: %s", e)
            yield {
                "event": "error",
                "data": json.dumps(
                    {"message": "AI 응답 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."},
                    ensure_ascii=False,
                ),
            }
        except Exception as e:
            logger.error("예상치 못한 오류: %s", e)
            yield {
                "event": "error",
                "data": json.dumps(
                    {"message": "서버 오류가 발생했습니다."},
                    ensure_ascii=False,
                ),
            }

    return EventSourceResponse(
        event_generator(),
        ping=15,
        media_type="text/event-stream",
    )


@router.post("/rooms/{room_id}/summary")
async def create_summary(
    room_id: UUID,
    user_id: UUID = Depends(get_current_user_id),
    use_case: SummarizeConsultationUseCase = Depends(
        get_summarize_consultation_use_case
    ),
):
    """상담 요약을 생성한다."""
    try:
        return await use_case.execute(
            user_id=user_id,
            room_id=room_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch("/rooms/{room_id}")
async def update_room(
    room_id: UUID,
    request: UpdateRoomRequest,
    user_id: UUID = Depends(get_current_user_id),
    chat_room_repo: AbstractChatRoomRepository = Depends(
        get_chat_room_repository
    ),
):
    """채팅방 정보를 수정한다."""
    chat_room = await chat_room_repo.find_by_id(room_id)
    if chat_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="채팅방을 찾을 수 없습니다.",
        )
    if chat_room.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="해당 채팅방에 접근 권한이 없습니다.",
        )

    if request.title is not None:
        chat_room.title = request.title

    updated = await chat_room_repo.update(chat_room)
    return {
        "id": str(updated.id),
        "title": updated.title,
        "status": updated.status,
    }
