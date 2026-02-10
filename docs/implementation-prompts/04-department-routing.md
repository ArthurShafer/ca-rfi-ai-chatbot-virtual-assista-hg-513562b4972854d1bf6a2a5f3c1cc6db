# Implementation Prompt: Department Routing & Intent Detection

## Metadata
- **Order**: 4
- **Dependencies**: 03-fastapi-backend (extends the chat endpoint)
- **Skills**: fastapi-templates
- **Scope**: Small
- **Estimated Tokens**: ~50K

## Context
FastAPI backend is running with a basic chat endpoint that does RAG retrieval across all content. We need to add intelligent department routing so the chatbot narrows its context to the relevant department, improving answer quality and enabling the department-specific UI experience.

## Objective
Add department routing logic to the chat endpoint: keyword-based fast path, LLM classification fallback, and sticky routing within a conversation.

## Requirements
- New service at `backend/app/services/routing.py`
- **Keyword matching (fast path)**:
  - Check user message against department keywords array from the departments table
  - Case-insensitive, whole-word matching
  - If exactly one department matches, route there
  - If multiple match, use LLM classification
- **LLM classification (fallback)**:
  - If no keyword match, ask Claude to classify the message into one of the known departments
  - Use a simple function call: `classify_department(department_slug: str)`
  - Single LLM call with department list + user message, no RAG context needed
  - Cache classification for the conversation
- **Sticky routing**:
  - Store detected department_id on the conversation record
  - Subsequent messages in the same conversation default to that department
  - If user explicitly changes topic (detected by keyword or LLM), update the department
- **Integration with chat endpoint**:
  - Before RAG retrieval, determine department
  - Filter pgvector query by department_id when department is known
  - Include department info in the SSE response: `{ department: { slug, name, name_es } }`
- **Update conversations table**: Set department_id when routing occurs

## Acceptance Criteria
- "How do I get a building permit?" routes to RMA department
- "Necesito aplicar para CalFresh" routes to HHSA department
- Follow-up messages in same conversation stay routed to same department
- "Actually, I need help with my property tax" in an HHSA conversation re-routes to Clerk-Recorder
- Unknown topics route to General department
- Department info included in chat response

## Technical Notes
- Keyword matching should be fast — load keywords into memory at startup, not per-query DB lookup
- LLM classification should use Claude Haiku (cheapest) with a minimal prompt — keep it under 500 input tokens
- The classify_department function call schema should list all department slugs with short descriptions
- Spanish keywords should also be included (e.g., "permiso" → RMA, "beneficios" → HHSA)
