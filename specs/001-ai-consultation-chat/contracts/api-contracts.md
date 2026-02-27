# API Contracts: AI 전문가 상담 채팅 서비스

**Branch**: `001-ai-consultation-chat` | **Date**: 2026-02-27

## Base URL

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## Common Headers

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
```

## Common Error Response

```json
{
  "detail": "에러 메시지"
}
```

---

## 1. 인증 API

### POST /api/auth/google

구글 ID Token으로 로그인/회원가입 처리 후 JWT를 반환한다.

**Request**:
```json
{
  "id_token": "google_id_token_string"
}
```

**Response** (200):
```json
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Errors**:
- 401: 유효하지 않은 Google ID Token
- 400: 이메일 인증이 완료되지 않은 계정

---

### POST /api/auth/refresh

JWT Access Token을 갱신한다.

**Request**:
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response** (200):
```json
{
  "access_token": "new_jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Errors**:
- 401: 유효하지 않거나 만료된 Refresh Token

---

### GET /api/auth/me

현재 로그인 사용자 정보를 조회한다.

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nickname": "사용자",
  "profile_image_url": "https://...",
  "subscription_type": "free",
  "created_at": "2026-02-27T12:00:00Z"
}
```

**Errors**:
- 401: 인증 실패

---

## 2. 전문가 API

### GET /api/experts

전문가 목록을 조회한다 (4개).

**Auth**: 불필요

**Response** (200):
```json
[
  {
    "id": "uuid",
    "expert_type": "career",
    "name": "커리어 컨설턴트 김커리어",
    "description": "취업, 이직, 면접 준비, 자기소개서 등 커리어 전반에 대해 상담합니다.",
    "icon": "💼"
  },
  {
    "id": "uuid",
    "expert_type": "love",
    "name": "연애 상담사 이하트",
    "description": "연애, 썸, 관계 고민, 이별 등 연애 전반에 대해 상담합니다.",
    "icon": "💕"
  }
]
```

---

### GET /api/experts/{expert_type}

특정 분야 전문가 정보를 조회한다.

**Path Params**: `expert_type` — career | love | fortune | parenting

**Response** (200):
```json
{
  "id": "uuid",
  "expert_type": "career",
  "name": "커리어 컨설턴트 김커리어",
  "description": "취업, 이직, 면접 준비, 자기소개서 등 커리어 전반에 대해 상담합니다.",
  "icon": "💼"
}
```

**Errors**:
- 404: 해당 분야의 전문가가 없음

---

## 3. 채팅 API

### POST /api/chat/rooms

새 채팅방을 생성한다.

**Auth**: 필수

**Request**:
```json
{
  "expert_type": "career"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "expert_id": "uuid",
  "expert_name": "커리어 컨설턴트 김커리어",
  "expert_type": "career",
  "expert_icon": "💼",
  "title": null,
  "status": "active",
  "created_at": "2026-02-27T12:00:00Z"
}
```

**Errors**:
- 400: 유효하지 않은 expert_type
- 401: 인증 실패

---

### GET /api/chat/rooms

내 채팅방 목록을 조회한다 (나의 상담 이력).

**Auth**: 필수

**Query Params**:
- `status` (optional): active | completed — 상태 필터
- `limit` (optional, default: 20): 조회 개수
- `offset` (optional, default: 0): 페이지네이션 오프셋

**Response** (200):
```json
{
  "rooms": [
    {
      "id": "uuid",
      "expert_name": "커리어 컨설턴트 김커리어",
      "expert_type": "career",
      "expert_icon": "💼",
      "title": "이직 고민 상담",
      "status": "active",
      "last_message_preview": "포트폴리오 정리를 먼저...",
      "updated_at": "2026-02-27T14:30:00Z"
    }
  ],
  "total": 5
}
```

---

### GET /api/chat/rooms/{room_id}

채팅방 상세 정보와 메시지 목록을 조회한다.

**Auth**: 필수

**Query Params**:
- `limit` (optional, default: 50): 메시지 조회 개수
- `before` (optional): 이 시각 이전의 메시지 조회 (커서 기반 페이지네이션)

**Response** (200):
```json
{
  "id": "uuid",
  "expert_name": "커리어 컨설턴트 김커리어",
  "expert_type": "career",
  "expert_icon": "💼",
  "title": "이직 고민 상담",
  "status": "active",
  "summary": null,
  "messages": [
    {
      "id": "uuid",
      "role": "assistant",
      "content": "안녕하세요, 커리어 컨설턴트 김커리어입니다...",
      "created_at": "2026-02-27T12:00:00Z"
    },
    {
      "id": "uuid",
      "role": "user",
      "content": "이직을 고민하고 있어요",
      "created_at": "2026-02-27T12:01:00Z"
    }
  ],
  "has_more": false
}
```

**Errors**:
- 403: 다른 사용자의 채팅방 접근 시도
- 404: 채팅방 없음

---

### POST /api/chat/rooms/{room_id}/messages

메시지를 전송하고 AI 응답을 SSE 스트리밍으로 수신한다.

**Auth**: 필수

**Request**:
```json
{
  "content": "이직 고민이에요"
}
```

**Response** (200, SSE Stream):
```
Content-Type: text/event-stream
X-Accel-Buffering: no

event: message
data: {"type": "chunk", "content": "안녕"}

event: message
data: {"type": "chunk", "content": "하세요,"}

event: message
data: {"type": "chunk", "content": " 어떤"}

event: done
data: {"type": "done", "message_id": "uuid", "full_content": "안녕하세요, 어떤 ..."}

```

**Error Events** (mid-stream):
```
event: error
data: {"type": "error", "message": "AI 응답 생성 중 오류가 발생했습니다."}
```

**Errors**:
- 400: 빈 메시지 또는 2000자 초과
- 403: 다른 사용자의 채팅방
- 404: 채팅방 없음

---

### POST /api/chat/rooms/{room_id}/summary

상담 요약을 생성한다.

**Auth**: 필수

**Response** (200):
```json
{
  "room_id": "uuid",
  "title": "이직 고민 상담",
  "summary": {
    "topic": "이직 고민 상담",
    "key_advice": [
      "현재 직무에서의 성장 가능성을 먼저 평가하세요",
      "이직 전 포트폴리오를 정리하세요"
    ],
    "action_items": [
      "GitHub 프로젝트 3개 정리",
      "업계 네트워킹 이벤트 참석"
    ]
  },
  "status": "completed"
}
```

**Errors**:
- 400: 메시지가 충분하지 않아 요약 생성 불가
- 403: 다른 사용자의 채팅방

---

### PATCH /api/chat/rooms/{room_id}

채팅방 정보를 수정한다 (제목 등).

**Auth**: 필수

**Request**:
```json
{
  "title": "새 제목"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "title": "새 제목",
  "status": "active",
  "updated_at": "2026-02-27T15:00:00Z"
}
```

---

## 4. 사용자 API

### GET /api/users/me

내 정보를 조회한다.

**Auth**: 필수

**Response** (200): (GET /api/auth/me와 동일)

---

### PATCH /api/users/me

내 정보를 수정한다 (닉네임 등).

**Auth**: 필수

**Request**:
```json
{
  "nickname": "새 닉네임"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "nickname": "새 닉네임",
  "profile_image_url": "https://...",
  "subscription_type": "free",
  "updated_at": "2026-02-27T15:00:00Z"
}
```

**Errors**:
- 400: 닉네임 유효성 검증 실패 (빈 문자열, 100자 초과)

---

## 5. Frontend Routes

| Route | 설명 | Auth |
|-------|------|------|
| `/` | 온보딩 랜딩 페이지 | 불필요 (로그인 시 /main/start 리다이렉트) |
| `/main/start` | 시작하기 (전문가 선택) | 필수 |
| `/main/history` | 나의 상담 이력 | 필수 |
| `/main/chat/[roomId]` | 채팅방 | 필수 |
| `/main/help` | 도움말 | 필수 |
| `/main/account` | 계정 정보 | 필수 |
| `/api/auth/[...nextauth]` | NextAuth 핸들러 | - |
