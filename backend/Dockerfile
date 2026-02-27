FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 엔트리포인트 실행 권한 부여
RUN chmod +x entrypoint.sh

# 포트 설정
EXPOSE 8000

# 실행 (마이그레이션 → 시드 → 서버 시작)
CMD ["./entrypoint.sh"]
