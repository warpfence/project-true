# Research: AI 전문가 상담 채팅 서비스

**Branch**: `001-ai-consultation-chat` | **Date**: 2026-02-27

## R-001: SSE 스트리밍 (FastAPI → 프론트엔드)

**Decision**: `sse-starlette`의 `EventSourceResponse` + `google-genai` SDK 비동기 스트리밍

**Rationale**:
- `sse-starlette`는 W3C SSE 프로토콜을 자동 준수하고, 클라이언트 disconnect 감지와 keepalive ping을 내장
- `google-genai` SDK(`googleapis/python-genai`)는 Google의 신규 공식 SDK로, `client.aio.models.generate_content_stream()`으로 네이티브 비동기 스트리밍 지원
- FastAPI의 async generator와 직접 연결 가능

**Alternatives Considered**:
- `StreamingResponse` (raw): SSE 프로토콜 수동 구현 필요, disconnect 감지 수동. 프로덕션 신뢰성 낮음
- WebSocket: 양방향 불필요한 단방향 AI 응답에 과도한 복잡성
- 구 `google-generativeai` SDK: deprecated 경로. 신규 SDK로 전환 필요

**Key Pattern**:
- FastAPI 엔드포인트에서 `EventSourceResponse(event_generator(), ping=15)` 반환
- 각 청크마다 `ServerSentEvent(data=json.dumps({"content": chunk}), event="message")` 전송
- 완료 시 `event="done"`, 에러 시 `event="error"` 이벤트 전송
- `X-Accel-Buffering: no` 헤더로 Nginx 버퍼링 비활성화

---

## R-002: 인증 아키텍처 (Google OAuth + JWT)

**Decision**: "Google ID Token 중계 + FastAPI 자체 JWT 발급" 패턴

**Rationale**:
- NextAuth.js v5가 Google OAuth를 처리하고, `jwt()` 콜백에서 `account.id_token`을 캡처
- 서버 사이드에서 FastAPI `/auth/google-login`으로 ID Token 전달
- FastAPI가 `google-auth` 라이브러리로 ID Token 직접 검증 후 자체 JWT(Access 30분 + Refresh 7일) 발급
- FastAPI JWT를 NextAuth 세션 JWT 내부에 중첩 저장 → httpOnly 쿠키로 전달

**Alternatives Considered**:
- `fastapi-nextauth-jwt` 라이브러리: NextAuth 내부 암호화에 강하게 결합, 장기 유지보수 불확실
- FastAPI가 Google OAuth 직접 처리: Next.js 라우트 보호를 별도 구현해야 하는 복잡도 증가
- NextAuth 세션만 사용 (FastAPI JWT 없음): 모바일 앱/마이크로서비스 확장 불가

**Key Flow**:
```
브라우저 → NextAuth(Google OAuth) → jwt() 콜백에서 id_token 캡처
→ 서버사이드 fetch → FastAPI /auth/google-login
→ google-auth로 ID Token 검증 → DB upsert → JWT 발급
→ NextAuth 세션에 저장 → httpOnly 쿠키
→ 이후 API 호출: Authorization: Bearer <FastAPI JWT>
```

**Token 저장**: httpOnly 쿠키 (NextAuth 기본값, AES-256-GCM 암호화)
**Token 갱신**: FastAPI Refresh Token으로 Access Token 갱신, NextAuth `jwt()` 콜백에서 자동 처리

---

## R-003: Clean Architecture (FastAPI + SQLAlchemy)

**Decision**: 4-Layer Clean Architecture + FastAPI `Depends()` 기반 DI + SQLAlchemy 2.0 Async + Alembic async 템플릿

**Rationale**:
- 의존성 방향 단방향 고정 (Presentation → Application → Domain ← Infrastructure)
- Domain이 SQLAlchemy/FastAPI를 모르므로 비즈니스 로직을 DB 없이 테스트 가능
- `Depends()` 체이닝으로 별도 DI 컨테이너 없이 표준 FastAPI 방식으로 주입
- `app.dependency_overrides`로 테스트 시 mock 교체 용이

**Alternatives Considered**:
- `dependency-injector` 라이브러리: 추가 의존성, FastAPI 네이티브 DI로 충분
- 단순 모놀리식 구조: 테스트와 유지보수성 저하
- 전통적 3-Layer (Controller-Service-Repository): Application 레이어 없이 비즈니스 로직 분리 미흡

**Key Patterns**:
- Domain: `dataclass` 엔티티 + `ABC` 추상 Repository
- Application: Pydantic v2 DTO (`from_attributes=True`) + Use Case 클래스
- Infrastructure: SQLAlchemy ORM 모델 + ABC 구현체 + `_to_entity()` 변환
- Presentation: `get_session → get_repository → get_use_case` DI 체이닝
- Async 필수 설정: `expire_on_commit=False`, `session.begin()` 컨텍스트 매니저
- Alembic: `-t async` 템플릿, `run_sync()` 래퍼

---

## R-004: SSE 프론트엔드 소비 (Next.js 채팅 UI)

**Decision**: `fetch` API + `ReadableStream` 수동 파싱 방식

**Rationale**:
- `EventSource`는 GET 전용이며 커스텀 헤더(JWT) 추가 불가
- `fetch`는 POST body + JWT 헤더 지원, AbortController로 즉시 연결 해제 가능
- 커스텀 에러 분기 및 재시도 로직 구현 가능

**Alternatives Considered**:
- `EventSource`: JWT 헤더 불가로 탈락
- `@microsoft/fetch-event-source`: 추가 의존성, 간단한 케이스에 과도
- Vercel AI SDK (`useChat`): FastAPI 백엔드와의 프로토콜 맞춤 제약
- WebSocket: 단방향 스트림에 과도한 복잡도

**Key Pattern**:
- `useChat` 커스텀 훅: messages 상태 관리, SSE 연결/해제, 에러 처리
- `ReadableStream.getReader().read()` 루프로 청크 수신
- `setMessages(prev => prev.map(...))` 함수형 업데이트로 스트리밍 메시지 점진적 렌더링
- AbortController로 사용자 중단 및 컴포넌트 언마운트 시 정리
- 스마트 자동 스크롤: 사용자가 위로 스크롤한 경우 자동 스크롤 비활성화
- 타이핑 인디케이터: 스트리밍 시작 시 점 세 개 애니메이션

---

## R-005: 주요 라이브러리 버전 결정

| 영역 | 패키지 | 버전 | 비고 |
|------|--------|------|------|
| Backend | Python | 3.11+ | 타입 힌트, async/await |
| Backend | FastAPI | 0.115+ | 최신 안정 버전 |
| Backend | SQLAlchemy | 2.0+ | Async + Mapped 타입 |
| Backend | asyncpg | 0.30+ | PostgreSQL async 드라이버 |
| Backend | Alembic | 1.14+ | Async 마이그레이션 지원 |
| Backend | Pydantic | 2.0+ | v2 (from_attributes) |
| Backend | google-genai | 1.0+ | Gemini API 공식 SDK |
| Backend | google-auth | 2.0+ | ID Token 검증 |
| Backend | python-jose | 3.3+ | JWT 생성/검증 |
| Backend | sse-starlette | 2.0+ | SSE 응답 |
| Frontend | Next.js | 14.x | App Router |
| Frontend | React | 18.x | |
| Frontend | TypeScript | 5.x | |
| Frontend | Tailwind CSS | 3.x | |
| Frontend | next-auth | 5.x (beta) | Auth.js v5 |
| DB | PostgreSQL | 16 | |
| Infra | Docker | latest | |
| Infra | Docker Compose | 3.8+ | |
