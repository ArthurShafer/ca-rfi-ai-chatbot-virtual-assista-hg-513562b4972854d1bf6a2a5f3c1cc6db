# Implementation Prompt: Chat Widget Component

## Metadata
- **Order**: 6
- **Dependencies**: 05-nextjs-frontend-shell (lives in the frontend shell)
- **Skills**: react-best-practices, ui-ux-pro-max
- **Scope**: Medium
- **Estimated Tokens**: ~120K

## Context
Next.js frontend shell exists with bilingual framework, Tailwind, and API proxy. We need the core chat widget — the main user-facing component of the entire demo.

## Objective
Build the accessible, bilingual chat widget with streaming responses, SB 313 AI disclosure, department routing indicators, suggested questions, and human escalation.

## Requirements
- Component at `frontend/components/chat/ChatWidget.tsx`
- Supporting components:
  ```
  frontend/components/chat/
    ChatWidget.tsx        # Main widget (floating button + expanded panel)
    ChatMessage.tsx       # Individual message bubble (user/assistant)
    ChatInput.tsx         # Text input with send button
    SuggestedQuestions.tsx # Clickable starter questions
    DepartmentBadge.tsx   # Shows current routed department
    AIDisclosure.tsx      # SB 313 compliance banner
    EscalationButton.tsx  # "Talk to a person" button
    TypingIndicator.tsx   # Animated dots while AI responds
  ```
- **Floating widget**:
  - Bottom-right corner, 60px circular button with chat icon
  - Click to expand to chat panel (400px wide, 600px tall on desktop; full-screen on mobile)
  - Smooth open/close animation
- **SB 313 AI disclosure banner**:
  - Always visible at top of chat panel, never dismissable
  - EN: "You are chatting with an AI assistant. For human help, call (559) 636-5000"
  - ES: "Está chateando con un asistente de IA. Para ayuda humana, llame al (559) 636-5000"
  - Subtle but clear styling — not alarming, but always present
- **Chat messages**:
  - User messages right-aligned, blue background
  - Assistant messages left-aligned, gray background
  - Streaming: assistant messages render token-by-token as SSE chunks arrive
  - Timestamps on each message
  - Source citations: when RAG context is used, show "Source: [page title]" below assistant message
- **Suggested questions**:
  - Show on initial load when no messages exist
  - 4-5 questions in current language
  - Clickable — clicking sends the question as a user message
  - Disappear after first user message
- **Department badge**:
  - Shows current department when routing is active
  - Color-coded by department
  - Appears below the AI disclosure banner
- **Human escalation**:
  - "Talk to a person" button always visible in chat footer
  - Clicking shows a panel with department phone numbers and emails
  - Panel is bilingual
- **Bilingual**:
  - All UI text uses the useTranslation() hook from prompt 05
  - Bot responses come from Claude in the user's selected language
  - Language switch mid-conversation sends the new language preference to the API
- **WCAG 2.1 AA**:
  - Full keyboard navigation: Tab to input, Enter to send, Escape to close widget
  - `aria-live="polite"` on the message container for screen reader announcements
  - `role="log"` on the message list
  - 4.5:1 contrast on all text
  - Focus trap when widget is open (focus stays within the panel)
  - Focus moves to newest message when assistant responds
  - All interactive elements have visible focus indicators
  - Chat input has proper `<label>` (visually hidden but screen-reader accessible)
- **State management**: Use Vercel AI SDK `useChat` hook for message state and streaming

## Acceptance Criteria
- Chat widget renders as floating button on the page
- Clicking opens the chat panel with AI disclosure banner visible
- Typing a message and pressing Enter sends it to the API
- Response streams in token-by-token
- Suggested questions appear on first load, disappear after first message
- Department badge appears when routing detects a department
- "Talk to a person" shows department contacts
- Language toggle switches all widget text and sends language to API
- Keyboard-only navigation works end-to-end (Tab, Enter, Escape)
- Screen reader announces new assistant messages
- Widget works on mobile (full-screen mode)

## Technical Notes
- Use Vercel AI SDK's `useChat` with a custom `api` endpoint pointing to `/api/chat` (the Next.js proxy route)
- The SSE stream from FastAPI needs to be compatible with Vercel AI SDK's expected format — may need adapter
- For streaming compatibility, the backend may need to return Vercel AI SDK-compatible stream format (data: prefix with JSON chunks)
- Animation: use Tailwind transitions for open/close, not a heavy animation library
- Department colors: HHSA=#2d6a4f (green), RMA=#b45309 (amber), Clerk=#6d28d9 (purple), Sheriff=#1e40af (blue), Animal=#059669 (emerald), Fire=#dc2626 (red), General=#6b7280 (gray)
