# NeuroPlay

NeuroPlay is a premium AI training laboratory for neuroevolution experiments across game environments.

## Stack

- Next.js App Router
- React + TypeScript
- TailwindCSS
- Framer Motion
- Zustand
- React Query
- Recharts
- React Flow
- Node.js + Express + Socket.IO backend skeleton

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend

```bash
npm run server:dev
```

The backend exposes `GET /health`, `GET /api/environments`, `GET /api/brains`, and a Socket.IO `training:update` stream placeholder.

## Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`

Copy `.env.example` to `.env.local` for local overrides when deploying outside Docker.

## Structure

```text
app/                  Next.js routes and app shell
components/           Reusable UI, dashboard, charts, game surfaces
config/               Environment catalog
lib/                  AI engine interfaces, store, utilities
public/assets/        Provided NeuroPlay SVG assets
server/               Express + TypeScript backend architecture
```
