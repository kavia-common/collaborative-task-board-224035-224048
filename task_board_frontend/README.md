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

If Supabase vars are missing, the app shows a setup screen and runs in limited mode.

## Features
- Ocean Professional theme (rounded corners, subtle shadows, gradients)
- Top navigation with search, filters, user avatar
- Sidebar with teams, boards, quick stats
- Kanban board (Backlog, In Progress, Review, Done)
- Drag-and-drop with persistent order_index per column
- Supabase Realtime updates across clients
- Email magic-link auth (Supabase Auth)
- Centralized logging and error handling

## Environment variables
See .env.example for a complete list. No secrets are hardcoded.

## Notes
- Ensure Supabase tables exist (see src/lib/schema.js for reference DDL).
- For production, set REACT_APP_LOG_LEVEL=warn or error.
