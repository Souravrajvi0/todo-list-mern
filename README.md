# To-Do List App (MERN)

Mobile-first To-Do List built from the assignment Figma: create, edit, delete, and search tasks; track weekly open vs completed progress (weeks run **Monday → Sunday**).

## Stack

- **MongoDB** + **Express** + **React** (Vite) + **Node.js**
- **Tailwind CSS v4** for UI
- Frontend deploy: **Netlify**
- API deploy: any Node host (Render / Railway / Fly.io)

## Project structure

```
├── client/          # React + Vite + Tailwind UI
├── server/          # Express + Mongoose API
├── netlify.toml     # Netlify build for client
└── README.md
```

## Features

- Onboarding → Home → Search flows matching the Figma
- Create / edit tasks (title, description, date, start/end time, priority)
- Mark tasks Completed or In Progress
- Delete tasks
- Keyword search (title & description)
- Weekly summary cards + progress bar
- Expandable weeks overview (open vs completed per week)

## Local setup

### 1. Install

```bash
npm run install:all
```

### 2. API env

```bash
cp server/.env.example server/.env
```

| Variable | Notes |
|----------|--------|
| `MONGODB_URI` | Atlas connection string, or `memory` for local in-memory MongoDB |
| `PORT` | Default `5000` |
| `CLIENT_URL` | CORS origin(s), comma-separated |
| `SEED_ON_START` | `true` to insert sample tasks when DB is empty |

### 3. Run

Terminal A — API:

```bash
npm run dev:server
```

Terminal B — UI:

```bash
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173).

Optional seed (against your configured DB):

```bash
npm run seed
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List (`?date=` or `?weekStart=`) |
| GET | `/api/tasks/search?q=` | Search |
| GET | `/api/tasks/stats/week` | Current week stats + tasks |
| GET | `/api/tasks/stats/weeks` | Multi-week overview |
| POST | `/api/tasks` | Create |
| PUT | `/api/tasks/:id` | Update |
| DELETE | `/api/tasks/:id` | Delete |

## Deploy

### All-in-one (Netlify)

`netlify.toml` builds the React app and exposes the REST API via **Netlify Functions** (`/api/*`), so one deploy gives you UI + API.

- Live site connects to same-origin `/api`
- Function store is ephemeral (fine for demos); use the Express + MongoDB Atlas API below for durable data

### Backend with MongoDB (Render + Atlas)

1. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and copy the connection string.
2. New Web Service from `server/` (or use `render.yaml`).
3. Build: `npm install` · Start: `npm start`
4. Env: `MONGODB_URI`, `CLIENT_URL` (Netlify URL), `SEED_ON_START=true`
5. On Netlify, set `VITE_API_URL=https://your-api.onrender.com/api` and redeploy the client.

## Figma

[To-Do List Mobile app](https://www.figma.com/design/mz2PJoTwa5DxYrdrFPem3f/To-Do-List-Mobile-app?node-id=0-1)
