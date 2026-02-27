# Quickstart: AI 전문가 상담 채팅 서비스

**Branch**: `001-ai-consultation-chat` | **Date**: 2026-02-27

## 사전 준비

### 필수 도구
- Docker & Docker Compose
- Node.js 18+ (프론트엔드 개발)
- Python 3.11+ (백엔드 개발)
- Git

### 외부 서비스 설정
1. **Google Cloud Console** — OAuth 2.0 클라이언트 ID 생성
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET` 획득

2. **Google AI Studio** — Gemini API 키 발급
   - https://aistudio.google.com/apikey
   - `GEMINI_API_KEY` 획득

## 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
# Database
DB_PASSWORD=your_db_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# JWT (Backend)
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# NextAuth (Frontend)
AUTH_SECRET=your_nextauth_secret
AUTH_URL=http://localhost:3000

# Backend URL (Frontend → Backend)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Docker Compose로 실행

```bash
# 전체 서비스 실행 (DB + Backend + Frontend)
docker compose up -d

# 로그 확인
docker compose logs -f

# DB 마이그레이션 실행
docker compose exec backend alembic upgrade head

# 전문가 시드 데이터 삽입
docker compose exec backend python -m seed.seed_experts
```

서비스 접속: http://localhost:3000

## 로컬 개발 환경 (Docker 없이)

### Backend

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv .venv
source .venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일을 backend/ 에도 복사하거나 export)
export DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/ai_consultation

# DB 마이그레이션
alembic upgrade head

# 시드 데이터 삽입
python -m seed.seed_experts

# 개발 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

## 개발 워크플로우

### DB 마이그레이션 추가

```bash
cd backend
alembic revision --autogenerate -m "설명"
alembic upgrade head
```

### 주요 파일 위치

```
backend/
├── app/main.py                    # FastAPI 진입점
├── app/domain/entities/           # 비즈니스 엔티티
├── app/application/use_cases/     # 비즈니스 로직
├── app/infrastructure/            # DB, 외부 API 구현체
└── app/presentation/api/          # API 라우터

frontend/
├── src/app/page.tsx               # 온보딩 페이지
├── src/app/main/                  # 로그인 후 페이지들
├── src/components/                # UI 컴포넌트
├── src/hooks/                     # 커스텀 훅
└── src/services/                  # API 클라이언트
```

## 확인 사항

- [ ] Docker 서비스 3개 (db, backend, frontend) 모두 실행 중
- [ ] http://localhost:8000/docs 에서 FastAPI Swagger UI 접근 가능
- [ ] http://localhost:3000 에서 온보딩 페이지 표시
- [ ] 구글 로그인 후 메인 화면 진입 가능
- [ ] 전문가 선택 후 채팅방 생성 및 AI 응답 수신 가능
