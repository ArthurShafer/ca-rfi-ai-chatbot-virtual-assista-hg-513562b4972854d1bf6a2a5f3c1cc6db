# Design Philosophy

How demos should look, feel, and communicate. This document is the primary reference for any session making design decisions on a campaign demo. Read it before brainstorming.

---

## 1. Why These Demos Exist

These demos are not prototypes. They're not proof-of-concepts or wireframes with placeholder data. They are working products built to a specific solicitation's requirements, deployed and accessible via a live URL, that prove the solution already works.

The strategic context: Arthur doesn't have government contracting credentials, agency relationships, or corporate infrastructure. What he has is the ability to build a working system fast. Most bidders respond to an RFP with slide decks and promises. We show up with a deployable application that solves the stated problem. This changes the dynamic from "can you build this?" to "this already works, let's submit together."

Every demo is built to be handed to a prime contractor who wraps it in their corporate submission. The prime brings certifications, past performance, and agency relationships. We bring a working system, architecture docs, deployment playbooks, and a technical response package. The demo is the centerpiece of that package.

This means the demo has to survive scrutiny from multiple directions: a CTO evaluating whether the architecture is sound, a BD lead deciding whether teaming reduces their risk, and a government evaluator scoring against specific criteria in the solicitation. It can't just look good. It has to be real software that a technical evaluator would respect, packaged in a way that a non-technical decision-maker finds immediately impressive.

The bar is: someone with no context runs `docker compose up`, clicks around for 15 minutes, and walks away thinking a small team of engineers spent weeks building this.

---

## 2. Who's Looking At This

Every demo has two audiences seeing the same screens, evaluating different things.

**Prime contractor evaluators** are the first audience. The CTO or VP of Engineering needs to validate that the technical approach is sound and that teaming with us reduces their delivery risk. They're looking at architecture, code quality, and whether this could actually scale to production. The BD lead or CEO needs to see that the demo gives them a competitive edge in their proposal. They're asking: "Does this make our bid stronger than submitting without it?"

**Government agency evaluators** are the second audience. They score against specific criteria from the solicitation. They care about whether the solution addresses their stated requirements, whether it looks like something their staff would actually use, and whether the technical approach is credible. They are often not deeply technical, but they recognize when something feels real versus when it feels like a sales pitch.

The critical implication: demos should not be built as if the end user (an inmate, a caseworker, a citizen) is the viewer. The viewer is a buyer. This means the demo should expose technical capabilities that would normally be invisible. AI reasoning, retrieval processes, matching logic, system orchestration. An end user doesn't need to see the LLM thinking. A buyer absolutely does, because that's where the differentiation lives.

The demo should feel like a guided tour of a production system with the hood open. The user-facing interface should be polished and professional, but there should always be a way to see what's happening underneath, because that's what we're actually selling.

### Exposing Technical Capabilities

Demos should communicate technical depth at three levels, each serving a different moment in the viewer's experience:

**Level 1: Explain the methodology.** Before the viewer touches anything, they should understand what makes this system intelligent. A landing page or overview section that describes the approach, the architecture decisions, and the specific capabilities. Not marketing copy. Technical substance written plainly. "This system conducts adaptive interviews across nine domains, adjusts questioning based on detected risk indicators, and scores across four models simultaneously." This sets expectations and frames everything they're about to see. Without it, a viewer might watch the demo and think "nice chatbot." With it, they understand they're looking at a multi-model orchestration system.

This is a required build standard. Every demo must implement a landing page as its entry point. See "Demo Build Standards" in CLAUDE.md for the specific requirements and the RIDOC demo (ridoc-demo/src/app/page.tsx) as the reference implementation.

**Level 2: Show the orchestration.** When the system initializes or transitions between states, visualize what's happening behind the scenes. The RIDOC demo does this with a modal that steps through language detection, dialect matching, voice selection, and readiness checks, each with visual confirmation. Some of these steps happen instantly in code, but presenting them sequentially with status indicators communicates the complexity of what the system is coordinating. This is choreography, not deception. The processes are real; the visualization makes them legible to a non-technical viewer. Every demo should have moments like this where the system says "here's what I'm doing right now" during transitions, data loading, or AI processing.

**Level 3: Show the intelligence working in real time.** This is the most important layer. When the system is doing its core job, the viewer should see the reasoning, not just the output. In the RIDOC demo, the interview runs on the left while a real-time analysis panel on the right shows how the AI interprets responses. When an inmate says "my boss had it out for me," the panel surfaces inferences like antisocial attribution patterns, adjusts risk scores visually, and adapts the next question accordingly. This transforms the experience from "it asks questions and records answers" to "it reads between the lines and thinks." Without that panel, the viewer sees a voice chatbot. With it, they see an analytical engine. This is where technical differentiation lives, and every demo should find its equivalent of that split-screen moment.

The general principle: if the system is doing something smart, make it visible. RAG retrieval should show what documents were found and why. Matching algorithms should show the scores and weights. Classification should show the confidence levels and contributing factors. The viewer should never have to take your word for it that something intelligent is happening.

**What "behind the scenes" does not mean:** This is not about exposing application internals like API calls, database queries, or function execution. The viewer doesn't need to see code running. The focus is exclusively on AI-level reasoning: how the system interprets input, what it retrieves, how it scores and classifies, why it made a particular decision, and how it adapts. The technical theater is about making intelligence visible, not making software visible.

---

## 3. Visual Identity

The default starting point for any demo's visual identity is the target organization's existing presence. Find their website, their current systems (if screenshots or descriptions exist in the solicitation), their color palette, their logo usage. Use that as a foundation, not a constraint. The goal is recognition with elevation: someone from that agency should look at the demo and think "that looks like ours, but significantly better."

This means pulling their primary brand colors, typography feel, and general layout conventions, then modernizing. Government websites tend to be dated, cluttered, and built on older frameworks. The demo should feel like what their next redesign would look like if they hired a good team. Clean type hierarchy, consistent spacing, professional density. Not a radical departure, a visible upgrade.

When no reference material is available (no agency website, no screenshots in the solicitation), default to a clean, neutral enterprise aesthetic. Dark headers, light content areas, a single accent color pulled from the state or agency seal. Muted tones. The kind of interface you'd expect from a well-funded internal tool, not a consumer SaaS product.

**Default style specification (when org research doesn't yield a useful starting point):** Dark-themed interfaces are preferred over light for demos that showcase AI capabilities. Use a dark slate or navy background for the primary application views, with high-contrast accent colors for status indicators, data visualizations, and interactive elements. Light themes are acceptable for administrative/CRUD sections, but the features that showcase intelligence should feel like an operations center, not a spreadsheet. Avoid generic dashboard template aesthetics (white cards on gray backgrounds, default chart colors, Bootstrap/Material defaults). During the polish pass, invoke the ui-ux-pro-max skill to select an appropriate visual style for the product type. Filter out unprofessional options (cyberpunk, vaporwave, retro-terminal). The goal is a flagship modern application that looks like a funded product, not a starter template.

**What to avoid:** AI-generated color schemes default to purples, cyans, and gradients that scream "this was generated." Never use these unless the target org's actual branding happens to include them. Similarly, avoid startup aesthetics: oversized hero sections, excessive whitespace, playful illustrations, rounded-everything. These demos are enterprise tools for government agencies. They should feel dense, capable, and professional. Think Bloomberg Terminal energy applied to a modern web interface, not Notion.

---

## 4. Technical Theater

Every demo should have moments that create a visceral sense of sophistication. These are deliberately designed interactions where the system communicates its own complexity to the viewer. Not through text explanations, but through visual behavior.

The core technique is choreographed sequencing. When the system performs a complex operation (initializing a session, processing a document, running an analysis), break it into visible steps and present them with deliberate pacing. A loading spinner that runs for two seconds communicates nothing. A sequenced panel that shows "Parsing document... Extracting entities... Building knowledge graph... Matching against criteria... Generating assessment" communicates an engineered pipeline. Both take the same amount of time. The second one sells the system.

This applies to several common demo patterns:

**Initialization sequences.** When a user starts a session, workflow, or analysis, show a brief orchestration modal. Each step should name a real process the system performs, even if in production it happens in milliseconds. Language detection, model loading, context retrieval, configuration matching. Present them sequentially with status indicators (checkmarks, progress states) so the viewer understands the system is coordinating multiple subsystems.

**Real-time processing panels.** When AI is interpreting input, show the interpretation alongside the output. Split-screen layouts where one side shows the user experience and the other shows the system's reasoning. Confidence scores updating, categories being assigned, risk factors being flagged. This transforms passive viewing into active understanding.

**Retrieval and matching visualization.** When the system pulls from a knowledge base or matches against criteria, show what was found and why. Document cards with relevance scores. Highlighted passages that informed a decision. Weighted factor breakdowns. The viewer should see the evidence chain, not just the conclusion.

**Never display raw confidence scores.** Raw model output (cosine similarity, probability percentages, confidence floats) should never appear as numbers in a demo UI. A "40% confidence" score on a domain question makes the system look broken even when the answer is correct. Viewers interpret these numbers against human intuition (40% = "less than half sure") rather than against model output ranges. Instead, use visual representations that communicate reliability without exact percentages: animated source verification graphs, color-coded strength indicators (green/amber without numbers), or process visualizations that show grounding without quantifying certainty. If a score must be displayed, calibrate it so strong matches show 80%+ and weak matches are either hidden or shown as "reviewing." The goal is confidence in the system, not transparency about the system's uncertainty.

**Prefer dynamic process visualization over static result displays.** The most effective AI theatrics show the system thinking in real time, not just the finished output. Animated network graphs where query nodes connect to source documents with lines that draw and color-shift during verification. Traveling indicators that follow the data path through the pipeline. State transitions that move from grey (searching) to green (verified) as the system confirms its sources. These are consistently more impressive than static alternatives like confidence bars, percentage labels, or badge lists. The principle: the viewer should understand what the system is doing by watching it happen, not by reading a number after the fact. When designing transparency displays, always ask: "Can I animate the process instead of summarizing the result?"

**Calibrate scoring to realistic model ranges.** Embedding models (sentence-transformers, OpenAI embeddings) produce similarity scores in a narrow band, not a full 0-1 range. Raw cosine similarity from all-MiniLM-L6-v2 typically falls between 0.2 (unrelated) and 0.75 (strong match). Displaying a raw 0.72 as "72% confidence" undersells an excellent match. When implementing any scoring that will be visible in the UI, normalize against the model's empirical range: set a floor (e.g., 0.35) and ceiling (e.g., 0.75), then scale to a display range where strong matches read as 85-95%.

**Curate transparency indicators.** When showing compliance or transparency status indicators (source-cited, PII clean, knowledge boundary, escalation status), only include indicators that show positive or neutral states during normal operation. An indicator that frequently shows a negative or concerning state (escalation triggered, outside knowledge boundary) undermines the demo narrative even when it's technically accurate. Keep indicators that reinforce trust (source citations verified, no PII detected). Remove indicators that can make the system look like it's struggling. If a safeguard must be demonstrated (e.g., the SOW requires showing escalation capability), design it as a deliberate demo moment with a specific trigger, not as an always-visible status that might randomly turn red.

**Label demo-only elements.** Any UI component that exists for evaluation purposes and would not appear in a production deployment (intelligence panels, scoring displays, audit visualizations, orchestration modals) should include a subtle label: "For demo purposes only" in small muted text beneath the section header. This signals to prime contractor evaluators that you understand the difference between demo instrumentation and production UI, and that the transparency layer was built deliberately for their benefit.

**Adaptive behavior indicators.** When the system changes its approach based on input (adjusting questions, re-prioritizing results, escalating risk levels), make that pivot visible. A subtle indicator that says "Adjusting interview focus based on detected pattern" or score gauges that shift in real time. The viewer needs to see that the system is reacting, not just proceeding through a script.

**Input variation as intelligence demonstration.** When the system processes different inputs through an AI model and should produce different outputs, design the demo so the evaluator can see this. Let them select between varied inputs (different profiles, documents, scenarios) and observe how the AI's behavior adapts. If an inmate with a drug history gets substance-focused questions while an inmate with an assault history gets aggression-focused questions, that variation proves the system is reasoning, not scripted. This is one of the strongest signals that a system is actually working. Apply this pattern when: (a) the demo has distinct user roles that see different views, or (b) the system feeds entity-specific data into a model and the output should visibly change based on that data. Seed data should include at least 2-3 varied inputs that produce noticeably different AI behavior.

**Multilingual awareness.** If the SOW or solicitation mentions multilingual, multi-language, or translation capabilities, the demo must showcase this visually. Language badges on profiles, language selection UI, voice model switching during interaction. An English-speaking evaluator watching the system switch to Spanish mid-conversation is a powerful theatrical moment. Even if the prototype only fully supports English under the hood, the UI should demonstrate language awareness (selectable languages, detected language indicators, voice selection visualization). Do not assume multilingual is implicit or obvious. Make it a visible feature.

The line between theater and dishonesty: every visualization should represent a real capability of the system. The language detection step in the bootup sequence should correspond to actual language detection in the code. The scoring panel should reflect actual model output. The choreography is in the presentation, the pacing, and the visual treatment. Not in fabricating capabilities that don't exist. We're making real processes legible, not inventing fake ones.

---

## 5. What Makes It Feel Real

The difference between a demo that impresses and one that gets dismissed is in the details that signal "someone actually built this as a real system." Viewers have seen enough mockups and slide decks to spot the gaps instinctively. These are the details that close those gaps.

**Seed data that tells a story.** The demo should boot with data that's coherent and relevant to the issuing agency. Not "John Doe" and "Test Company." If it's a corrections system, the demo has realistic inmate profiles with plausible histories. If it's a procurement tool, it has actual-looking solicitations from the relevant state. The data should feel like a snapshot of a system that's been in use for six months. Enough volume to feel populated, enough variety to demonstrate edge cases, enough specificity to show domain understanding.

**No empty states on first run.** The viewer should never see a blank table, an empty dashboard, or a "no results found" screen during a walkthrough. Every view should have something meaningful to show. If a feature requires user-generated data, pre-populate it. The 15-minute demo window doesn't include time for the viewer to create test data.

**Graceful everything.** Errors show friendly messages, not stack traces. Loading states use skeletons or spinners, not frozen screens. Transitions are smooth. Clicking things that aren't implemented yet should either not be clickable or show a reasonable "coming soon" state, never a crash. The demo should feel unbreakable during a walkthrough.

**Responsive but not mobile-first.** These demos will primarily be viewed on laptops during meetings and screen shares. Optimize for 1280-1440px widths. They should not break on a tablet, but the primary experience is a full desktop browser. Don't spend time on mobile layouts that nobody will see during a demo walkthrough.

**Small details that compound.** Favicon should be the first letter or a logical two-letter abbreviation of the organization (e.g., "DoC" for Department of Corrections, not a generic React logo). Page titles should reflect the application name, not framework defaults like "React App" or "Build your next app." Set Open Graph meta tags (og:title, og:description, og:image) so that when the demo URL is shared via text or Slack, the preview shows a screenshot of the application with a proper title. These take minutes to set up and prevent the demo from looking like a boilerplate starter project.

---

## 6. Anti-Patterns

A quick reference of things to never do. If a future session is unsure about a design choice, checking this list should resolve most questions.

**Color:** No purple/cyan/violet gradient schemes. No neon accents. No rainbow color coding. These are the default palettes AI tools generate and they're immediately recognizable as such. When in doubt, use the organization's brand colors or a muted, professional palette.

**Layout:** No oversized hero sections with a single headline and a giant button. No excessive whitespace between sections. No full-screen modals for simple confirmations. Government tools are dense and information-rich. The interface should feel productive, not like a landing page.

**Icons:** No emoji as UI icons. Use a consistent SVG icon set (Heroicons, Lucide). Don't mix icon libraries. Don't use icons where a text label would be clearer.

**Copy:** No placeholder text ("Lorem ipsum", "Description goes here", "TODO"). No generic labels ("Item 1", "Test User"). No framework-default text anywhere in the UI. Every string in the interface should read like it belongs to the target agency's system.

**Behavior:** No non-functional buttons or links without indication. No features that crash or show raw error output. No console errors visible in the browser. No network requests visibly failing in the background.

**Aesthetics:** No rounded-everything pill shapes on every element. No glassmorphism or frosted-glass effects unless they serve a purpose. No animated gradients, particle effects, or decorative motion that doesn't communicate information. Light interfaces are appropriate for administrative views and CRUD workflows. However, features that expose real-time AI reasoning (interview panels, analysis dashboards, processing visualizations, inference monitors) should use a dark theme. The dark background creates contrast for status indicators, colored tags, and data visualizations, and communicates that the user has entered an analytical mode distinct from routine admin work.

**Branding:** No Easy Company or Arthur Shafer branding visible in the demo UI. The demo should look like it belongs to the target organization. Our branding goes in the documentation package, not in the product.

---

## 7. Demo Type Patterns

Some solicitation types recur often enough that they have standardized demo patterns. Apply these when the solicitation matches the type.

### Chatbot / Conversational AI

When the solicitation calls for a chatbot, virtual assistant, conversational agent, or any NLP-powered interactive system, the demo must show the chatbot embedded in its deployment context, not as a standalone interface.

**The mock website pattern:** Build a static mock of the target client's website (the site named in the SOW). Include realistic navigation bars, branding, content sections, and footer. The chatbot appears as a floating widget in the bottom-right corner of this mock site. After a 2-3 second delay, the widget auto-opens to reveal the chat panel and any intelligence/transparency displays. The widget must be minimizable so the viewer can see the mock website underneath.

This matters because the first question a prime contractor CTO asks about a chatbot demo is "how would this actually work on our site?" A standalone chat page answers "it works as a separate application." A widget embedded on a realistic mock of their website answers "it works exactly like this, on your existing site, today." The mock doesn't need to be pixel-perfect. It needs to be recognizable: the right colors, the right navigation structure, the right general feel of the agency's web presence.

**Widget structure:** The expanded widget should contain the chat conversation panel (60% width) and the intelligence/transparency panel (40% width). The intelligence panel is where AI theatrics live: source verification animations, retrieval displays, topic classification. Keep the chat side clean and user-facing. Keep the intelligence side technical and evaluator-facing. This split communicates that the product has both a polished user experience and deep technical instrumentation.

**What to include in the mock site:** Agency branding bar (logo, agency name, ".gov" indicator), navigation links (these don't need to work), a filing season or service alert banner if seasonally appropriate, a quick-action grid or content section relevant to the agency's domain, and a footer with the agency's contact information. Use the agency's real color palette. The mock should look like a slightly modernized version of their actual website.

**What NOT to do:** Don't build the chatbot as a full-page dedicated interface. Don't use an iframe or popup window. Don't require the viewer to navigate to a separate URL to see the chat. The moment the viewer lands on the chat page, they should see the mock website with the widget already visible (or opening within seconds).
