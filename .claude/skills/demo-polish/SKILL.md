---
name: demo-polish
description: "Polish campaign demo: landing page, visual identity, AI theatrics. Runs after testing, before deploy."
trigger: /polish
arguments:
  - name: pass
    description: Run a specific pass only (landing, visual, theatrics)
    required: false
---

# Demo Polish

Three-pass polish workflow that transforms a functional demo into a visually impressive, technically theatrical product. Runs in a dedicated fresh session after testing passes, before deployment.

Context budget goes entirely to DESIGN-PHILOSOPHY.md + solicitation details + the running app. Build sessions lose this context by prompt 05/07.

## Step 0: Load Context (runs before every pass)

Before any pass, load these files in order:

1. Read `DESIGN-PHILOSOPHY.md` (all 6 sections, primary reference for all decisions)
   - Section 1: Why These Demos Exist
   - Section 2: Who's Looking At This
   - Section 3: Visual Identity
   - Section 4: Technical Theater
   - Section 5: What Makes It Feel Real
   - Section 6: Anti-Patterns
2. Read `docs/solicitation/SOURCES.md` + all `*-extracted.md` files (RFP requirements to reframe)
3. Read `docs/requirements/*-environment-constraints.md` (org branding, colors, tech constraints)
4. Read `docs/plans/*.md` feature designs (capability inventory)
5. Read `docs/architecture/architecture.md` (tech stack, system overview)
6. Detect frontend framework from `package.json`, `next.config.js`, `next.config.ts`, `vite.config.ts`, or similar
7. Determine app URL from `docker-compose.yml` port mapping (typically `http://localhost:<port>`)
8. Verify app is running. If not: `docker compose up --build -d` and wait for health check

---

## Pass 1: Landing Page

**Reference**: DESIGN-PHILOSOPHY.md Section 3 (Visual Identity), Section 6 (Anti-Patterns), Build Standard #9

### Evaluate

1. Screenshot the app root URL with the `browsing` skill
2. Determine: does the entry point show a landing page, or does it jump straight to the main application?
3. If a landing page exists, evaluate against Build Standard #9. If missing, create one.

### Landing Page Structure

Build following this structure. Not every demo needs every element, but maintain the ordering and density.

#### 1. Prototype Badge (required)
Small label at top: "Prototype Demonstration" or "Technical Demo". Styling: small inline-block, subtle background, rounded corners.

#### 2. Title + Subtitle (required)
- **Title**: Product name (not the solicitation number)
- **Subtitle**: One sentence describing what the system does, specific to the domain

#### 3. Methodology Statement (required)
2-3 sentences describing *how* the system works, using specific technical terminology (AI inference, RAG pipeline, vector similarity, real-time scoring, adaptive orchestration, etc.). This is not a feature list. It explains the intelligent approach so the viewer understands what makes the system smart before interacting with it. Source this from the hero feature's design doc and the architecture overview.

#### 4. Domain Grid (when applicable)
If the solicitation defines categories, domains, or functional areas, display them in a compact grid (2x3 or 3x3). Each item: small card with subdued background, text only. Communicates scope at a glance.

Examples: assessment domains, service categories, workflow stages. Skip if the demo has no natural category set.

#### 5. Capabilities Callout (required)
Colored background box (use org accent color, blue tones as fallback) containing:
- Heading: "System Capabilities" or "Demo Features"
- 3-6 items, each as **Bold Label:** description
- Source: mine `docs/solicitation/*-extracted.md` for requirements
- Reframe from "must support X" to "**X Support:** description of how system handles X"
- These are confident declarations, not checklist items

#### 6. How-to-Use Walkthrough (required)
Different colored background box (yellow/amber tones) containing:
- Heading: "How to Use This Demo"
- 3-5 numbered steps walking the viewer through the demo's workflow
- Steps must be specific: reference actual UI elements, button labels, page names
- Example: "1. Select a subject profile from the dropdown" not "1. Navigate the interface"

#### 7. CTA Button (required)
Centered, prominent button leading to the main application view.
Label must be action-specific: "Select Subject Profile", "Enter Dashboard", "Start Analysis"
Not generic: "Get Started", "Continue", "Learn More"

#### 8. Solicitation Footer (required)
Bottom of page, centered, muted text:
"Prototype demonstration for {solicitation_number} . {agency_name}"

#### 9. Tech Stack Badge (recommended)
Fixed-position element (bottom-right corner), semi-transparent background:
"Powered by {Tech1} . {Tech2} . {Tech3}"
Only include technologies a buyer would recognize (Claude, GPT-4o, Whisper, ElevenLabs). Skip generic framework names unless they are the point of the demo.

### Style Rules

- Use org colors from environment-constraints, not generic white/blue
- Dense and informative, not a marketing hero page (Section 6 anti-pattern)
- No oversized hero section with a giant headline and a single button
- The viewer should understand what makes this system intelligent before they interact with it
- **Single viewport constraint**: The landing page must fit in one browser viewport at 1440x900 with no scrollbar. If it scrolls, cut content until it doesn't.
- Follow the 9-element structure above in order: badge, title, methodology, grid, capabilities, walkthrough, CTA, footer, tech badge
- Landing pages are dense information screens, not splash pages. Every pixel earns its place.

### Reference Implementation

RIDOC demo landing page (`ridoc-demo/src/app/page.tsx`) if available in the campaigns directory.

---

## Pass 2: Visual Identity & Styling

**Reference**: DESIGN-PHILOSOPHY.md Sections 3 (Visual Identity), 5 (What Makes It Feel Real), 6 (Anti-Patterns)

**Before applying fixes, determine the visual style:**
1. Run `/ui-ux-pro-max` to identify the appropriate visual style for this product type (dashboard, chatbot, portal, form-heavy app, data visualization)
2. Filter results: exclude unprofessional styles (cyberpunk, vaporwave, retro-terminal, neon). For government demos, prefer: dark professional, enterprise dense, operations center, or clean modern
3. Apply the selected style as the baseline for all visual fixes in this pass

### Evaluate

1. Screenshot every route/page with the `browsing` skill
2. Evaluate each against the checks below
3. Fix issues in priority order (color scheme and density have the biggest impact)

### Check/Fix Matrix

| Check | What to look for | Fix |
|-------|-----------------|-----|
| Generic color scheme | White backgrounds, default blue links, framework defaults | Pull org colors from environment-constraints. Fallback: dark header (#1a1a2e or similar), light content area, accent color from state/agency seal or brand |
| Oversized hero / whitespace | Large empty sections, hero banners, excessive padding | Increase information density. Government tools are data-rich. Reduce padding, use grid layouts |
| Framework favicon | React atom, Next.js triangle, Vite lightning bolt | Replace with org initial(s) as a simple SVG/PNG favicon (e.g., "DoC" for Department of Corrections) |
| Default page title | "React App", "Next.js", "Vite + React" in browser tab | Set to application name matching the landing page title |
| Missing OG meta tags | No og:title, og:description, og:image | Add OpenGraph meta tags with app name and description |
| Purple/cyan/violet gradients | Startup-coded color palettes (indigo-to-purple, cyan-to-teal) | Replace with org brand palette or muted professional tones |
| Emoji as icons | Emoji characters used where icons belong | Replace with Heroicons or Lucide React icons |
| Startup aesthetics | Rounded pills, glassmorphism, frosted glass, gradient cards | Flatten to enterprise professional. Subtle shadows, clean borders, muted backgrounds |
| AI-generated layout | Centered hero + gradient heading + 3-column feature cards + "Get Started" CTA. This is the default output of every AI coding tool. | Break the symmetry. Use asymmetric grids, sidebar layouts, data-dense panels. Government tools look like Bloomberg terminals, not Stripe landing pages |
| Template text | "Welcome to [App]", "Empowering X through Y", "Streamline your workflow", any sentence that could describe any product | Replace with domain-specific language pulled from the RFP. Reference actual agency terminology, program names, data types |
| Suspiciously perfect symmetry | Every card same height, every section same padding, every grid perfectly 3-column. Real products have asymmetric layouts driven by content density | Vary card sizes by content importance. Let data tables breathe differently than action panels. Mix 2-column and 3-column sections |
| Gradient overuse | Background gradients on cards, buttons, headers, sections. One gradient is a design choice; five gradients is ChatGPT | Limit gradients to one accent element max. Use solid colors with subtle borders for everything else |
| Stock iconography | Generic icons that add nothing (lightbulb for "insights", gear for "settings", rocket for "launch"). AI tools default to these | Remove decorative icons. Use icons only where they aid navigation or comprehension. Prefer text labels |
| Default fonts | System fonts (Inter, system-ui) or framework defaults. Not wrong, but indistinguishable from every other app | Pick one distinctive font pairing: a clean sans-serif for UI (IBM Plex Sans, Source Sans Pro, DM Sans) and optionally a serif for headings if appropriate to the domain. Load via Google Fonts or self-host. One font change signals "designed" vs "generated" |

### Color Application Pattern

When applying org colors:
- **Header/nav**: Dark variant of primary color
- **Sidebar** (if present): Slightly lighter than header, or white with colored accents
- **Content area**: White or very light gray (#f8f9fa)
- **Accent/CTA**: Secondary brand color or complement to primary
- **Data tables, cards**: White with subtle borders, colored header rows
- **Status indicators**: Keep standard green/yellow/red for semantic meaning

---

## Pass 3: AI Theatrics

**Reference**: DESIGN-PHILOSOPHY.md Section 4 (Technical Theater), Section 2 (Who's Looking At This)

**Important**: AI theatrical elements should already be specified in `docs/plans/*.md` feature designs under "## Theatrical Design" sections. This pass refines and polishes those designs. It does NOT invent theatrical elements from scratch. If no theatrical design exists in the feature plans, flag this as a gap and consult the user before proceeding.

The viewer is a buyer, not an end user. AI reasoning, retrieval processes, matching logic, and system orchestration should be visible. That's where the differentiation lives.

### Load Wow Moments and Hero Feature from Design Docs

Before grepping the codebase, check `docs/plans/*.md` for:

1. **Hero feature classification** from brainstorming. One feature was designated the hero (gets 60% of theatrical design attention), others as supporting or background. The hero feature's "Theatrical Design" section is the primary target for refinement in this pass. If no hero was designated, ask the user which feature is the centerpiece before proceeding.

2. **Wow moments** identified during brainstorming. Each AI-powered feature design should name its wow moment explicitly. These are the primary targets for theatrical treatment. If a feature's wow moment is "watch the AI reason through the match," that feature gets a reasoning panel. If it's "watch 50 documents get classified in seconds," that feature gets a processing pipeline visualization.

List the hero feature and wow moments found. If none were documented (older designs, pre-brainstorming update), identify them now by reading the design docs and asking: which AI feature would make a buyer say "show me that again"?

### Discover AI Touchpoints

Grep the codebase for AI integration points:

```
# API client references
anthropic, openai, claude, gpt, llm, ai_client, chat_completion

# Processing functions
score, classify, match, retrieve, rank, analyze, extract, summarize, embed

# Prompt construction
system_prompt, user_prompt, messages, prompt_template, few_shot

# Fetch calls to AI endpoints
/api/.*ai, /api/.*analyze, /api/.*score, /api/.*classify
```

### Evaluate Against Theater Levels

For each AI touchpoint, determine which theater level applies:

**Level 2: Orchestration** (transitions, initialization, processing sequences)
- Does the system show what it's coordinating when performing multi-step operations?
- If not, add initialization/processing sequence modals with:
  - Named steps (e.g., "Loading knowledge base", "Connecting to AI engine", "Indexing documents")
  - Status indicators per step (pending, in-progress spinner, complete checkmark)
  - Subtle timing (500ms-1s per step) to make the sequence feel real
  - Fade-out after completion

**Level 3: Real-time Intelligence** (core AI operations visible to the viewer)
- During the primary AI operation, does the viewer see reasoning?
- If not, add reasoning panels showing:
  - What factors the AI considered
  - Confidence scores or match percentages
  - Category/classification breakdowns
  - Source attribution (which documents/data informed the result)

### Prioritize Additions

Not every demo needs all patterns. Pick the highest-impact additions:

1. **One orchestration sequence** if the app has a startup flow, session initialization, or document processing step. This is low-effort, high-impact.
2. **One real-time reasoning panel** for the most impressive AI operation (the one that makes a buyer say "show me how it does that"). Attach it to the primary analysis/scoring/matching feature.
3. **Confidence/score displays** for any scoring or classification that already produces numeric output but only shows the result, not the breakdown.

### Pattern Catalog

Each pattern has an implementation approach. Pick the highest-impact patterns for this demo, not all of them.

#### Orchestration Patterns (Level 2)

**Initialization Sequence Modal**
When: App startup, session creation, document upload/processing, any multi-step backend operation.
What: Modal overlay with 3-6 named steps, each transitioning through pending > active (spinner) > complete (checkmark). Steps have domain-specific names, not generic ("Indexing policy documents" not "Loading data").
Implementation: Frontend-only component with timed transitions (500ms-1s per step). Actual backend call fires in parallel. Modal dismisses when both the animation and the real operation complete.
Impact: High. Low effort. Makes any initialization feel intentional rather than "loading..."

**Processing Pipeline Visualization**
When: Data flows through multiple stages (upload > parse > classify > score > store).
What: Horizontal or vertical pipeline diagram showing data moving through named stages. Each stage lights up as processing reaches it. Current stage shows a brief status message.
Implementation: State machine in frontend. Backend emits stage updates via SSE or polling. Each stage maps to a real processing step.
Impact: High. Medium effort. Shows the buyer "this isn't just a form submission, it's an intelligent pipeline."

**Document Ingestion Theater**
When: System processes uploaded documents (PDFs, spreadsheets, etc.).
What: Show the document being parsed, sections being identified, key terms being extracted, classifications being assigned. Not a progress bar. A play-by-play.
Implementation: Backend returns structured progress events. Frontend renders them as a scrolling log or staged visualization.
Impact: High for document-heavy demos. Transforms "uploading..." into "watch the AI read."

#### Intelligence Patterns (Level 3)

**Reasoning Panel / Analysis Sidebar**
When: AI makes a decision, scores something, classifies something, or generates a recommendation.
What: Side panel or expandable section showing what the AI considered. Factors weighted, sources cited, confidence breakdown per dimension. Shows the "why" not just the "what."
Implementation: Backend returns structured reasoning alongside the result. Frontend renders it in a collapsible panel. Can use streaming to show reasoning appearing in real-time before the final result.
Impact: Highest. This is the "show me how it does that" moment. Every demo with a scoring/classification feature needs this.

**Confidence Score Breakdown**
When: Any numeric score, match percentage, or classification result.
What: Instead of showing "Match: 87%", show the breakdown: "Requirements alignment: 92%, Technical fit: 85%, Budget range: 78%, Timeline feasibility: 91%." Horizontal bar charts or radar diagram.
Implementation: Backend already produces scores. Decompose into sub-scores and return them. Frontend renders as stacked bars, radar chart, or score cards.
Impact: High. Makes a single number feel like a considered judgment.

**Streaming AI Response with Visible Thought**
When: Any LLM call that generates text (analysis, summary, recommendation).
What: Stream the response token by token. Optionally show a "thinking" phase before the response starts (e.g., "Analyzing 3 documents... Comparing against 12 criteria... Formulating recommendation...").
Implementation: Use SSE or WebSocket for streaming. Frontend renders tokens as they arrive. Thinking phase can be real (structured output from a chain-of-thought prompt) or staged (timed messages while the LLM processes).
Impact: Medium-high. Streaming alone is table stakes. The "thinking" prelude is what makes it theatrical.

**Source Attribution Panel**
When: AI response references or was informed by specific documents, records, or data.
What: Clickable citations in AI-generated text that expand to show the source passage. "Based on Section 4.2 of the RFP [1]" where [1] expands to the actual text.
Implementation: Backend returns source references alongside generated text. Frontend renders inline citations with expandable source cards.
Impact: Medium. Builds trust. Shows the AI isn't hallucinating.

#### Reference Implementations

Existing demos that demonstrate these patterns:

- **VoiceSelectionAnimation** (RIDOC): Initialization sequence modal. 4-step modal during voice agent initialization.
- **Pipeline flow** (RIDOC): Processing pipeline visualization. MIC > STT > LLM > LOG > TTS with real-time data flow.
- **AnalysisPanel** (RIDOC): Reasoning panel. Live domain coverage radar, risk assessment, emotional tone indicators.

As more demos are built, add reference implementations here so future polish sessions can pull from proven patterns.

### What NOT to add

- Don't fake AI where none exists. Only add theater around actual AI operations.
- Don't add loading delays to non-AI operations just for effect.
- Don't create complex animation systems that could break. Keep implementations simple and reliable.
- Don't add theater that slows down the demo walkthrough. The buyer has 15 minutes. Every animation earns its seconds.

---

## Post-Polish Verification

After all passes complete:

### First-Impression Audit (10-Second Test)

Before checking details, do the gut check. Screenshot the landing page and the primary application view. For each, answer honestly:

1. **Does this look like a real product or a coding exercise?** Real products have visual weight, intentional hierarchy, and domain-specific language. Coding exercises have centered text, generic icons, and "Welcome to [App Name]."
2. **Would a CTO take this seriously in a 15-minute walkthrough?** If the first screen looks like a bootcamp project, no amount of good functionality recovers that impression. The CTO has already decided your credibility before they click anything.
3. **Can you tell what domain this is for without reading text?** Color scheme, layout density, and visual tone should signal "government tool" or "enterprise system" before a single word is read. If it could be a SaaS marketing page for any industry, it's wrong.
4. **Does anything scream "AI generated this"?** The centered-hero + 3-column-cards + gradient-heading pattern is the calling card of AI-generated UIs. If the layout matches what ChatGPT or v0 would produce for "create a dashboard," redesign it.

If any answer is wrong, go back to the relevant pass and fix before proceeding.

### Detail Verification

1. Screenshot every page/route again with the `browsing` skill
2. Compare against pre-polish screenshots (mental diff)
3. Verify:
   - Landing page loads and has all required elements
   - No pages show blank screens or broken layouts
   - Color scheme is consistent across all views
   - Favicon and page title are correct
   - AI theatrics animate smoothly without errors
   - Browser console has no new errors
4. Summarize all changes made in each pass
5. Note any remaining items that need manual attention

---

## Running Individual Passes

If invoked with `--pass <name>`, run only that pass (Step 0 context loading still runs first):

- `/polish --pass landing` - Pass 1 only
- `/polish --pass visual` - Pass 2 only
- `/polish --pass theatrics` - Pass 3 only

Without `--pass`, run all three passes in sequence.
