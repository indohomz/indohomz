# Minimal Dockerfile for Retail-Analytics-Platform
# Builds and runs the backend service located in ./backend

FROM python:3.11-slim AS builder

WORKDIR /app

# Install system deps and Rust toolchain so packages that require compilation
# (pydantic-core, some cryptography builds, etc.) can build in the builder stage.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libpq-dev \
        curl \
        ca-certificates \
        pkg-config \
        libssl-dev \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/* \
    && curl https://sh.rustup.rs -sSf | sh -s -- -y \
    && . /root/.cargo/env

ENV PATH="/root/.cargo/bin:${PATH}"

# Copy and install Python dependencies in the builder
COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install --no-cache-dir -r requirements.txt

# Copy app code (so builds that compile extensions with C-extensions can use sources)
COPY backend/ ./

# ---- runtime stage ----
FROM python:3.11-slim AS runtime
WORKDIR /app

# Copy site-packages from builder to runtime
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY --from=builder /app /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
