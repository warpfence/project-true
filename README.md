# AI 전문가 상담 채팅 서비스

생성형 AI(Gemini API)를 활용한 전문가 상담 웹앱 채팅 서비스입니다.

## 상담 분야

| 분야 | 전문가 | 설명 |
|------|--------|------|
| 💼 취업 | 커리어 컨설턴트 김커리어 | 취업, 이직, 면접 준비, 자기소개서 |
| 💕 연애 | 연애 상담사 이하트 | 썸, 연애, 관계 갈등, 이별 극복 |
| 🔮 사주 | 사주 상담사 박운세 | 사주팔자, 운세, 궁합 |
| 👶 육아 | 육아 상담사 최아이 | 육아, 아이 발달, 교육 |

## 기술 스택

- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Python 3.11+ / FastAPI (Clean Architecture)
- **Database**: PostgreSQL 16
- **AI**: Google Gemini API
- **Auth**: Google OAuth 2.0

## 시작하기

### 1. 사전 준비

- Docker & Docker Compose 설치
- Google Cloud Console에서 OAuth 클라이언트 ID 발급
- Google AI Studio에서 Gemini API 키 발급

### 2. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 실제 값으로 수정
```

### 3. 실행

```bash
docker compose up --build
```

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 프로젝트 구조

```
ai-consultation-project/
├── CLAUDE.md              # Claude Code 프로젝트 명세 (코딩 컨벤션, 아키텍처 원칙)
├── PROJECT_SPEC.md        # 상세 명세서 (시나리오, DB, API, 프롬프트, 스프린트 계획)
├── docker-compose.yml
├── .env.example
├── backend/               # FastAPI 백엔드 (Clean Architecture)
│   ├── app/
│   │   ├── domain/        # Entities + Repository 인터페이스
│   │   ├── application/   # Use Cases + DTO
│   │   ├── infrastructure/# DB 구현체, Gemini 클라이언트, OAuth
│   │   └── presentation/  # API 라우터, 미들웨어
│   ├── alembic/
│   └── Dockerfile
└── frontend/              # Next.js 프론트엔드
    ├── src/
    │   ├── app/           # App Router (페이지)
    │   ├── components/    # 컴포넌트
    │   ├── hooks/         # 커스텀 훅
    │   ├── services/      # API 호출
    │   └── types/         # TypeScript 타입
    └── Dockerfile
```

## 개발 스프린트

| 스프린트 | 기간 | 목표 |
|---------|------|------|
| Sprint 1 | 1~2주 | 기반 구축 + 구글 로그인 + 온보딩 |
| Sprint 2 | 2주 | 채팅 핵심 기능 + Gemini 연동 |
| Sprint 3 | 1~2주 | 상담 이력 + 요약 카드 |
| Sprint 4 | 1~2주 | 마무리 + 품질 보완 |

## 면책 고지

> AI 조언은 참고용이며 전문가 상담을 대체하지 않습니다.
