#!/bin/bash
set -e

echo "=== DB 마이그레이션 실행 ==="
alembic upgrade head

echo "=== 전문가 시드 데이터 삽입 ==="
python -m seed.seed_experts

echo "=== 서버 시작 ==="
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
