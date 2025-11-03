# Minimal Dockerfile for Retail-Analytics-Platform
# Builds and runs the backend service located in ./backend

FROM python:3.11-slim

WORKDIR /app

# Install system deps and Rust toolchain so packages that require compilation
# (pydantic-core, some cryptography builds, etc.) can build inside the image.
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
    # Install rustup (non-interactive) to get cargo/rustc for building wheels
    && curl https://sh.rustup.rs -sSf | sh -s -- -y \
    # Make cargo available in PATH for subsequent RUN steps
    && . /root/.cargo/env

# Ensure cargo is on PATH for all subsequent layers
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy and install Python dependencies from backend
COPY backend/requirements.txt ./requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

EXPOSE 8000

# Start the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
