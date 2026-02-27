"""채팅 관련 DTO (Data Transfer Object)."""

from pydantic import BaseModel, Field


class CreateRoomRequest(BaseModel):
    """채팅방 생성 요청."""

    expert_type: str


class SendMessageRequest(BaseModel):
    """메시지 전송 요청."""

    content: str = Field(..., min_length=1, max_length=2000)


class UpdateRoomRequest(BaseModel):
    """채팅방 수정 요청."""

    title: str | None = Field(None, max_length=200)


class MessageResponse(BaseModel):
    """메시지 응답."""

    id: str
    role: str
    content: str
    created_at: str

    class Config:
        from_attributes = True


class RoomResponse(BaseModel):
    """채팅방 생성/수정 응답."""

    id: str
    user_id: str
    expert_id: str
    expert_name: str
    expert_type: str
    expert_icon: str
    title: str | None
    status: str
    created_at: str


class RoomListItem(BaseModel):
    """채팅방 목록 아이템."""

    id: str
    expert_name: str
    expert_type: str
    expert_icon: str
    title: str | None
    status: str
    last_message_preview: str | None
    updated_at: str


class RoomListResponse(BaseModel):
    """채팅방 목록 응답."""

    rooms: list[RoomListItem]
    total: int


class RoomDetailResponse(BaseModel):
    """채팅방 상세 응답."""

    id: str
    expert_name: str
    expert_type: str
    expert_icon: str
    title: str | None
    status: str
    summary: dict | None
    messages: list[MessageResponse]
    has_more: bool


class SummaryResponse(BaseModel):
    """상담 요약 응답."""

    room_id: str
    title: str
    summary: dict
    status: str
