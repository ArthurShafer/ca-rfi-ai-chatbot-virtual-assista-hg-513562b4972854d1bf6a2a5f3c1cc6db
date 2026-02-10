# Implementation Prompt: Seed Data & Polish

## Metadata
- **Order**: 9
- **Dependencies**: All previous prompts (08-docker-deployment)
- **Skills**: ui-ux-pro-max
- **Scope**: Small
- **Estimated Tokens**: ~50K

## Context
The full application is built and containerized. We need to polish the first-run experience: seed data for when the scraper hasn't run yet, starter questions, error states, loading animations, and final UI tweaks.

## Objective
Create seed data, suggested questions, error handling UX, and final polish to make the demo feel production-ready.

## Requirements

### Seed data (`backend/db/seed_content.sql`)
- If scraper hasn't been run (content_chunks is empty), insert curated fallback content for each department
- 5-10 high-quality chunks per department covering the most common questions:
  - HHSA: CalFresh application process, Medi-Cal eligibility, WIC info, behavioral health crisis line
  - RMA: Building permit process, zoning info, inspection scheduling
  - Clerk-Recorder: Birth/marriage/death certificates, property records
  - Sheriff: Non-emergency contact, inmate lookup, community programs
  - Animal Services: Adoption, stray reporting, licensing
  - Fire: Burn permits, safety inspections
  - General: County hours, holiday closures, board meetings
- Content sourced from our environment-constraints research (real info)
- Include real Tulare County phone numbers, addresses, and URLs

### Suggested questions (`frontend/lib/suggested-questions.ts`)
- 5 questions per language (EN/ES) that showcase different departments:
  - EN: "How do I apply for CalFresh benefits?", "What do I need for a building permit?", "How do I get a copy of my birth certificate?", "Where is the nearest animal shelter?", "What are the county office hours?"
  - ES: "¿Cómo solicito los beneficios de CalFresh?", "¿Qué necesito para un permiso de construcción?", "¿Cómo obtengo una copia de mi acta de nacimiento?", "¿Dónde está el refugio de animales más cercano?", "¿Cuáles son las horas de oficina del condado?"

### Error states
- **API unreachable**: Show message "Our AI assistant is temporarily unavailable. Please call (559) 636-5000 for assistance." with retry button
- **Claude API error**: Show "I'm having trouble thinking right now. Please try again in a moment." with retry button
- **Empty RAG results**: Bot responds "I don't have specific information about that. Let me connect you with the right department." + shows escalation contacts
- **Rate limit** (if ever needed): "I'm helping a lot of people right now. Please try again shortly."

### Loading states
- **Initial load**: Skeleton shimmer on chat panel while connecting
- **Waiting for response**: Animated typing indicator (three bouncing dots)
- **Streaming**: Token-by-token render with subtle fade-in on each chunk

### Final polish
- Favicon: Simple chat bubble icon
- Page title: "Tulare County AI Assistant"
- Meta description for SEO
- Open Graph tags (for when partners share the link)
- Smooth scroll to latest message
- Auto-focus on chat input when widget opens
- Message timestamps formatted nicely ("2 min ago", "Today at 3:15 PM")

## Acceptance Criteria
- Fresh database with no scraped content still provides useful answers from seed data
- All 5 suggested questions in both languages produce relevant, accurate responses
- API down state shows helpful fallback message
- Typing indicator appears during response generation
- Page has proper favicon, title, and OG tags
- The demo feels polished and professional — no lorem ipsum, no broken states

## Technical Notes
- Seed content should have embeddings pre-computed and stored as VECTOR literals in the SQL
- For pre-computing embeddings: run the embedding model on seed content text and include the vector arrays directly in the INSERT statements
- OG image: create a simple 1200x630 card with "Tulare County AI Assistant" text on county-colored background
- Keep error messages warm and helpful, not technical. Citizens don't know what an API is.
