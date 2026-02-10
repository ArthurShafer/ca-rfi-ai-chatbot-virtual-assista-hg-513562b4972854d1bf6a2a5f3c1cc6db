# Implementation Prompt: Analytics Backend & Dashboard

## Metadata
- **Order**: 7
- **Dependencies**: 03-fastapi-backend, 05-nextjs-frontend-shell
- **Skills**: fastapi-templates, react-best-practices
- **Scope**: Medium
- **Estimated Tokens**: ~100K

## Context
Backend is logging conversations and messages. Frontend shell exists with an `/admin` route placeholder. We need analytics endpoints on the backend and a dashboard UI on the frontend.

## Objective
Build analytics API endpoints and an admin dashboard showing conversation volume, department breakdown, language stats, top questions, and recent conversations.

## Requirements

### Backend (FastAPI)
- New router at `backend/app/routers/analytics.py`
- `GET /api/analytics/overview` — Returns:
  - total_conversations (today, 7d, 30d)
  - total_messages (today, 7d, 30d)
  - avg_response_time_ms
  - avg_satisfaction_rating
- `GET /api/analytics/departments` — Returns conversation count by department (7d)
- `GET /api/analytics/languages` — Returns conversation count by language (7d)
- `GET /api/analytics/top-questions` — Returns top 10 most common user messages (simple frequency count, 7d)
- `GET /api/analytics/conversations?limit=20` — Returns recent conversations with message previews
- All analytics endpoints protected by `X-Admin-Password` header matching `ADMIN_PASSWORD` env var
- Queries run against conversations, messages, and departments tables directly (no materialized views needed for demo traffic)

### Frontend (Next.js)
- Admin page at `frontend/app/admin/page.tsx`
- Simple password gate: prompt for password, store in sessionStorage, send as header
- Dashboard layout:
  - **Top row**: 4 stat cards (total conversations, total messages, avg response time, satisfaction)
  - **Middle row**: Department breakdown bar chart + Language pie chart (side by side)
  - **Bottom row**: Top questions table + Recent conversations list
- Charts: Use recharts (lightweight, React-native charting library)
- Responsive: works on tablet and desktop
- Auto-refresh: reload data every 60 seconds
- Bilingual: Admin dashboard is English-only (internal tool)

## Acceptance Criteria
- GET /api/analytics/overview returns correct aggregates
- Admin dashboard renders at /tulare-chatbot/admin
- Password gate blocks unauthorized access
- Stat cards show real numbers from the database
- Department chart shows bars for each department with conversation counts
- Language chart shows EN vs ES split
- Top questions table shows real user messages
- Recent conversations list shows clickable conversation previews
- Dashboard auto-refreshes

## Technical Notes
- For "top questions": simple GROUP BY on normalized user messages (lowercase, trim). No need for ML clustering in the demo.
- Recharts is ~50KB gzipped — acceptable for admin page. Only import the chart components needed (BarChart, PieChart).
- The password gate is NOT real security — just enough to prevent casual access. Fine for a demo.
- Admin page does NOT need to be bilingual — it's an internal tool for county staff.
- Use `fetch` with SWR or simple `useEffect` for data loading — don't over-engineer.
