# Implementation Prompt: Next.js Frontend Shell

## Metadata
- **Order**: 5
- **Dependencies**: 03-fastapi-backend (needs API to call)
- **Skills**: react-best-practices, tailwind-design-system, ui-ux-pro-max, nextjs-app-router-patterns
- **Scope**: Medium
- **Estimated Tokens**: ~100K

## Context
FastAPI backend is running with chat and health endpoints. We need the Next.js frontend that will host the chat widget and admin dashboard. This prompt builds the shell — layout, routing, bilingual framework, Tailwind config, API client — but NOT the chat widget itself (that's prompt 06).

## Objective
Create the Next.js 14 App Router application with Tailwind CSS, bilingual (EN/ES) support, layout structure, and API integration layer.

## Requirements
- Project structure:
  ```
  frontend/
    app/
      layout.tsx         # Root layout with providers
      page.tsx           # Landing page with chat widget mount point
      admin/
        page.tsx         # Analytics dashboard (placeholder for prompt 07)
      api/
        chat/
          route.ts       # Proxy to FastAPI backend (avoids CORS for Vercel)
    components/
      providers/
        LanguageProvider.tsx  # EN/ES context provider
      layout/
        Header.tsx       # Tulare County header with language toggle
        Footer.tsx       # Footer with county contact info
      ui/                # Shared UI components (Button, Card, etc.)
    lib/
      api.ts            # API client for FastAPI backend
      i18n.ts           # Translation strings (EN/ES)
    public/
      tulare-county-seal.svg  # County seal/logo placeholder
    tailwind.config.ts
    next.config.ts       # basePath: '/tulare-chatbot'
    package.json
    Dockerfile
  ```
- **Tailwind config**: Tulare County-ish color palette (blues and greens — professional government look), custom font stack (system fonts for performance)
- **Bilingual framework**:
  - React Context provider for language state (EN/ES)
  - `useTranslation()` hook that returns translated strings
  - `i18n.ts` with all UI strings in both languages
  - Language toggle component in the header
  - Language preference persisted in localStorage
- **Layout**:
  - Header with county name, seal, language toggle
  - Main content area
  - Footer with contact info and accessibility statement
  - Responsive: mobile-first, works on phone screens
- **API proxy route** at `/api/chat` that forwards to FastAPI backend (SSE pass-through). This avoids CORS issues when deployed on Vercel.
- **next.config.ts**: Set `basePath: '/tulare-chatbot'` for arthurshafer.com deployment
- **Vercel AI SDK**: Install and configure for streaming chat responses

## Acceptance Criteria
- `npm run dev` starts the frontend on localhost:3000
- Landing page renders with Tulare County branding
- Language toggle switches all UI text between English and Spanish
- API proxy route successfully forwards requests to FastAPI backend
- Responsive layout works on mobile (375px) through desktop (1440px)
- Dockerfile builds and serves the production build
- basePath config works (app accessible at /tulare-chatbot/)

## Technical Notes
- Use Next.js 14 App Router (not Pages Router)
- Vercel AI SDK `useChat` hook will be used in the chat widget (prompt 06) — just install it here
- For the county seal, use a placeholder SVG — we don't need the actual county logo for a teaming demo
- Tailwind colors: primary blue (#1e3a5f or similar navy), accent green (#2d6a4f), neutral grays
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Keep the landing page simple: county name, brief description, and the chat widget area
