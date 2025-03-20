# Grammy Bun Demo

## Giới thiệu

Telegram Chat Bot | Chat with AI (Gemini).

> Dự án được xây dựng làm demo cho buổi Live-stream Tech-talk của EGANY.

Tech-stack:

- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/)
- [Elysia](https://elysiajs.com/)
- [grammY](https://grammy.dev/)
- [Directus](https://directus.io/)

## Yêu cầu

- Bun 1.2.x
- Docker
- Directus (self-hosted)
- Telegram Bot

## Cài đặt

### 1. Setup Directus

> 

Truy cập vào thư mục `/docker` và chạy lệnh sau:

```bash
docker-compose up -d
```

Nếu setup thành công, Directus sẽ truy cập được tại http://localhost:8055

### 2. Setup environment variables

Rename hoặc copy file `.env.example` thành `.env` và điền giá trị của các variable có trong file.

### 3. Seed database

Chạy lệnh sau để tạo các model cần thiết trong Directus:

```bash
bun run seed
```
### 4. Start bot

```bash
# Development mode (live reload)
bun run dev

# Production mode
bun run start
```
