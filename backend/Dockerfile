FROM rust:1.91 as builder
WORKDIR /app
COPY . .

ENV SQLX_OFFLINE=true

RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/app /app/backend
COPY --from=builder /app/.env /app/.env
COPY --from=builder /app/photos /app/photos

EXPOSE 8000
CMD ["./backend"]