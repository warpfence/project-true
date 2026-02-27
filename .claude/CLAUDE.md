# AI 전문가 상담 채팅 서비스

## 프로젝트 개요

생성형 AI(Gemini API)를 활용한 전문가 1:1 상담 웹앱 채팅 서비스.
4개 분야(취업/커리어, 연애, 사주/운세, 육아)의 AI 전문가가 사용자와 실시간 채팅 상담을 진행한다.

## 현재 상태

- **브랜치**: `main` (단일 브랜치 운영)
- **구현 완료**: 전체 87개 태스크 (T001-T087) + 온보딩 리디자인 + 채팅 이력 삭제
- **태스크 명세**: `specs/001-ai-consultation-chat/tasks.md`
- **설계 문서**: `specs/001-ai-consultation-chat/plan.md`, `spec.md`, `data-model.md`, `contracts/`

## 기술 스택

- **Architecture**: Clean Architecture (4-Layer)
- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Python 3.11+ / FastAPI
- **Database**: PostgreSQL 16 + SQLAlchemy 2.0 (async ORM) + Alembic (Migration)
- **AI Model**: Google Gemini API (`gemini-2.0-flash`) — SSE 스트리밍
- **Authentication**: Google OAuth 2.0 (NextAuth.js ↔ FastAPI JWT)
- **Containerization**: Docker + Docker Compose

## 프로젝트 구조

```
project_true/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── domain/             # 엔티티(User, Expert, ChatRoom, Message), Repository ABC
│   │   ├── application/        # Use Cases, DTO(Pydantic), Interfaces(AbstractAIClient)
│   │   ├── infrastructure/     # SQLAlchemy ORM, Gemini 클라이언트, Google Auth, Settings
│   │   └── presentation/       # FastAPI 라우터(auth, expert, chat, user), 미들웨어, DI
│   ├── alembic/                # DB 마이그레이션 (versions/001_initial_schema.py)
│   ├── seed/                   # 전문가 시드 데이터 (seed_experts.py)
│   ├── entrypoint.sh           # Docker 엔트리포인트 (마이그레이션→시드→서버)
│   └── requirements.txt
├── frontend/                   # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/                # 페이지: /(온보딩), /main/start, /main/chat/[roomId],
│   │   │                       #         /main/history, /main/help, /main/account
│   │   ├── components/         # chat/, expert/, layout/, onboarding/, common/, ui/(shadcn)
│   │   ├── hooks/              # useAuth, useChat(SSE), useChatRooms, useExperts
│   │   ├── services/           # api, authService, chatService, expertService, userService
│   │   ├── types/              # chat, expert, message, user, next-auth.d
│   │   └── lib/                # constants, utils
│   │   ├── auth.ts             # NextAuth.js 설정
│   │   └── middleware.ts       # 인증 미들웨어
│   └── package.json
├── docker-compose.yml                      # 로컬 개발용 (build 사용)
├── docker-compose_project-true_nas.yml     # NAS 배포용 (image + Nginx SSL)
├── nginx/nginx.conf                        # Nginx 리버스 프록시 설정
├── .env                                    # 환경 변수 (gitignore 대상)
└── specs/                                  # Speckit 설계 산출물
```

## 주요 API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | /api/auth/google | Google OAuth 로그인 |
| POST | /api/auth/refresh | JWT 토큰 갱신 |
| GET | /api/auth/me | 현재 사용자 정보 |
| GET | /api/experts | 전문가 목록 |
| POST | /api/chat/rooms | 채팅방 생성 |
| GET | /api/chat/rooms | 채팅방 목록 |
| GET | /api/chat/rooms/{id} | 채팅방 상세 |
| POST | /api/chat/rooms/{id}/messages | 메시지 전송 (SSE 스트리밍) |
| POST | /api/chat/rooms/{id}/summary | 상담 요약 생성 |
| PATCH | /api/chat/rooms/{id} | 채팅방 수정 |
| DELETE | /api/chat/rooms/{id} | 채팅방 아카이브 후 삭제 |
| GET | /api/users/me | 사용자 프로필 |
| PATCH | /api/users/me | 닉네임 수정 |

## 아키텍처 원칙 (Clean Architecture)

의존성 방향: Presentation → Application → Domain (안쪽으로만 의존)

1. **Domain**: 비즈니스 엔티티(dataclass), Repository 추상 인터페이스(ABC). 외부 의존성 없음.
2. **Application**: Use Case 클래스, Pydantic DTO, AbstractAIClient 인터페이스. Domain에만 의존.
3. **Infrastructure**: SQLAlchemy ORM 모델, Repository 구현체, GeminiClient, Settings. Application/Domain 구현.
4. **Presentation**: FastAPI 라우터, JWT 미들웨어, DI(dependencies.py). 가장 바깥 레이어.

## 핵심 구현 패턴

- **SSE 스트리밍**: Backend `EventSourceResponse` → Frontend `ReadableStream` 파싱 (JWT 헤더 필요로 EventSource 대신 fetch 사용)
- **DI 체이닝**: `get_db_session → get_*_repository → get_*_use_case` (dependencies.py + 각 라우터)
- **Gemini 통합**: `google-genai` SDK, `client.aio.models.generate_content_stream()` 비동기 스트리밍
- **상담 요약**: Gemini에 JSON 출력 요청 → `_parse_summary()`로 파싱 → room status "completed"로 변경

## 코딩 컨벤션

### Python (Backend)
- Python 3.11+ 타입 힌트 필수
- 함수/변수: snake_case, 클래스: PascalCase
- async/await 사용 (FastAPI 비동기 엔드포인트)
- Pydantic v2 모델 사용 (DTO, 설정)
- docstring은 한글로 작성

### TypeScript (Frontend)
- 컴포넌트: PascalCase, 함수/변수: camelCase
- interface 우선 사용 (type alias는 유니온/인터섹션에만)
- React Server Components 기본, 필요 시에만 'use client'
- 절대 경로 import (`@/components/...`)

### 공통
- 환경 변수는 .env 파일로 관리, 코드에 하드코딩 금지
- 에러 메시지는 한글로 작성
- 주석은 한글로 작성
- Git 커밋 메시지: `[feat]`, `[fix]`, `[refactor]`, `[docs]` 접두사, 한글 작성

## 실행 방법

```bash
# 로컬 개발 — Docker Compose (PostgreSQL + Backend + Frontend)
docker compose up --build

# 로컬 개발 (Backend)
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# 로컬 개발 (Frontend)
cd frontend && npm run dev
```

## NAS 배포 (Synology Container Manager)

### 배포 아키텍처

```
https://honi001.synology.me:9008
  → Nginx (SSL 종단, 포트 443→9008)
    → /api/auth/* → frontend:3000 (NextAuth)
    → /api/*      → backend:8000  (FastAPI)
    → /*          → frontend:3000 (Next.js)
```

- **NAS IP**: 192.168.0.15
- **도메인**: honi001.synology.me
- **설정 파일**: `docker-compose_project-true_nas.yml`
- **Nginx 설정**: `nginx/nginx.conf`

### 이미지 빌드 및 내보내기 (Mac → NAS)

NAS는 x86_64 아키텍처이므로 `--platform linux/amd64` 필수.
`NEXT_PUBLIC_API_URL`은 빌드타임에 인라인되므로 반드시 NAS 도메인/포트로 지정.

```bash
# backend (포트 변경 없으면 재빌드 불필요)
docker build --platform linux/amd64 -t project-true-backend:latest ./backend
docker save project-true-backend:latest -o project-true-backend.tar

# frontend (NEXT_PUBLIC_API_URL = Nginx HTTPS 주소)
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_API_URL=https://honi001.synology.me:9008 \
  -t project-true-frontend:latest ./frontend
docker save project-true-frontend:latest -o project-true-frontend.tar
```

### NAS 파일 배치

| 파일 | NAS 경로 |
|------|----------|
| `nginx.conf` | `/volume1/docker/project-true/nginx/nginx.conf` |
| SSL 인증서 | `/volume1/docker/project-true/ssl/fullchain.pem`, `privkey.pem` |
| `.env` | docker-compose와 같은 경로 |
| PostgreSQL 데이터 | `/volume1/docker/project-true/postgresql/` |

### Google OAuth 설정

Google Cloud Console에서 승인된 리디렉션 URI:
```
https://honi001.synology.me:9008/api/auth/callback/google
```

### 공유기 포트 포워딩

| 외부 포트 | 내부 IP | 내부 포트 |
|----------|---------|----------|
| 9008 | 192.168.0.15 | 9008 |
