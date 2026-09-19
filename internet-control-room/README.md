# Internet Control Room

A frontend-only operational dashboard for observing an AI agent's
GOAL → PLAN → TOOLS → EXECUTE → VERIFY → RECOVER → RESULT pipeline.

This is the **frontend only**. It ships with a mock service layer so
it runs and demos fully without any backend, and is pre-wired to a
future Node.js/Express + Socket.IO backend via the API contract below.

## Run it

```
npm install
npm run dev
```

Open the printed local URL (default http://localhost:5173).

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

```
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` (default): everything runs on `src/services/mockService.js`
  — no backend required. Great for demos.
- `VITE_USE_MOCK=false`: the app calls the real backend via
  `src/services/api.js` and connects to it over Socket.IO via
  `src/services/socket.js`.

## Mock mode

With `VITE_USE_MOCK=true`:
- `Home` → "Run Agent" creates an in-memory run and navigates to
  `/control-room/:runId`.
- `mockService.simulateAgentRun()` plays out a realistic sequence:
  plan created → tasks run → one task fails and recovers via retry/fallback
  → an approval step is requested → final result is generated.
- `Tool Registry` is pre-seeded with 5 demo tools and supports registering
  new ones (kept in memory for the session).
- `Run History` lists every run started in the current session.

All fake behavior lives only in `src/services/mockService.js` — no
mock logic is scattered through components.

## Backend integration points

REST (`src/services/api.js`):
- `POST /api/agent/run` — body `{ goal }` → `{ runId }`
- `GET /api/agent/:runId` — full run state
- `POST /api/agent/:runId/approve` — body `{ approved }`
- `GET /api/tools`
- `POST /api/tools`
- `GET /api/runs` — run history (assumed, mirrors the same pattern)

Socket.IO (`src/services/socket.js`, consumed via `src/hooks/useSocket.js`):
`agent_started`, `plan_created`, `task_started`, `task_completed`,
`task_failed`, `verification_started`, `verification_completed`,
`recovery_started`, `approval_required`, `agent_completed`, `agent_failed`,
plus a `log` event for the live log panel.

To go live: set `VITE_USE_MOCK=false` and `VITE_API_URL` to your backend.
No component code needs to change — `useAgentRun` and `useSocket` already
branch on `USE_MOCK`.

## Routes

- `/` — Home / landing, goal input
- `/control-room/:runId` — live dashboard for a run
- `/tools` — tool registry + register-tool modal
- `/history` — run history

## Structure

```
src/
├── components/{layout,dashboard,tools,common}
├── pages/{Home,ControlRoom,ToolRegistry,RunHistory}.jsx
├── services/{api,mockService,socket}.js
├── hooks/{useAgentRun,useSocket}.js
├── utils/{formatters,constants}.js
```
