"""FastAPI 앱 진입점.

CORS 설정, 라우터 등록, 글로벌 예외 핸들러, lifespan 이벤트를 관리한다.
"""

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.infrastructure.config.settings import get_settings

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """애플리케이션 시작/종료 시 실행되는 lifespan 이벤트."""
    logger.info("애플리케이션 시작")
    yield
    logger.info("애플리케이션 종료")
    from app.infrastructure.persistence.database import engine

    await engine.dispose()


app = FastAPI(
    title="AI 전문가 상담 서비스",
    description="생성형 AI를 활용한 전문가 상담 채팅 API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 글로벌 예외 핸들러 ---


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """ValueError를 400 Bad Request로 변환한다."""
    logger.warning("ValueError: %s | path=%s", exc, request.url.path)
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )


@app.exception_handler(RuntimeError)
async def runtime_error_handler(request: Request, exc: RuntimeError):
    """RuntimeError를 500으로 변환한다."""
    logger.error("RuntimeError: %s | path=%s", exc, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """예상치 못한 예외를 500으로 변환한다."""
    logger.error(
        "예상치 못한 오류: %s(%s) | path=%s",
        type(exc).__name__,
        exc,
        request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "서버 오류가 발생했습니다."},
    )


# 라우터 등록
from app.presentation.api.auth_router import router as auth_router
from app.presentation.api.expert_router import router as expert_router
from app.presentation.api.chat_router import router as chat_router
from app.presentation.api.user_router import router as user_router

app.include_router(auth_router)
app.include_router(expert_router)
app.include_router(chat_router)
app.include_router(user_router)


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트."""
    return {"status": "ok"}
