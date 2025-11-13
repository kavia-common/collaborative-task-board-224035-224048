# Collaborative Task Board - Frontend

Modern React UI for a real-time collaborative Kanban board powered by Supabase.

## Quick start

1) Install
- npm install

2) Configure
- Copy .env.example to .env and set:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY
  - Optional: REACT_APP_FRONTEND_URL (used for magic-link redirect)

3) Run
- npm start (http://localhost:3000)

If Supabase vars are missing, the app shows a setup screen and runs in limited mode with demo data (no persistence or realtime).

## Features
- Ocean Professional theme (rounded corners, subtle shadows, gradients)
- Top navigation with search, filters, user avatar
- Sidebar with teams, boards, quick stats
- Team sidebar with members (presence TODO)
- Kanban board (Backlog, In Progress, Review, Done)
- Drag-and-drop with persistent order_index per column
- Supabase Realtime updates across clients
- Email magic-link auth (Supabase Auth)
- Centralized logging and error handling
- Guided setup banner when env vars are missing

## Environment variables
See .env.example for a complete list. No secrets are hardcoded.

## Supabase schema (reference)
- tables: teams, boards, tasks, team_members, profiles (for email), columns (optional), task_assignees (optional), activity_logs (optional)
- tasks minimally require: id (uuid), title (text), status (text), order_index (int), board_id (uuid), created_at, updated_at

## Notes
- App uses env-injected configuration and never hardcodes secrets.
- For production, set REACT_APP_LOG_LEVEL=warn or error.

## Acceptance
- Running at port 3000 shows a Kanban board with sample data without Supabase config.
- With Supabase env set, app connects, shows real data, supports drag-and-drop ordering, and receives realtime updates.
