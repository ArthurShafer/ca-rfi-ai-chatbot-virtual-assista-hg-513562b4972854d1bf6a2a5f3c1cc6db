# Function Calling / Tool Use

**Category**: Architecture Patterns
**Maturity**: Mature
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

Function calling (also called tool use) is the mechanism by which LLMs interact with external systems in a structured way. Instead of generating free-text responses, the model outputs structured JSON that specifies which function to call and with what parameters. The application executes the function and returns results to the model, which can then reason about the output and decide on next actions. This is the foundational building block for all agentic AI.

## Why It Matters

Function calling is what turns a chatbot into a capable agent. Without it, an AI can only generate text. With it, an AI can query databases, call APIs, send emails, create files, and interact with any system that has a programmatic interface. For government contracting, this is the capability that makes AI practical: a permit processing system that actually processes permits, not just talks about them. Every agent demo you build is built on function calling.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| Anthropic Tool Use API | Native API | Per-token pricing | Claude's tool use. JSON schema tool definitions, parallel tool calls, tool result handling. |
| OpenAI Function Calling | Native API | Per-token pricing | GPT function calling. JSON schema definitions. Supports parallel calls. |
| Google Gemini Function Calling | Native API | Per-token pricing | Gemini's tool use. Similar schema format. Supports grounding with Google Search. |
| Vercel AI SDK | Framework | Free (open source) | Unified tool calling interface across providers. Streaming support. Next.js integration. |
| Instructor | Structured output library | Free (open source) | Python library for guaranteed structured outputs from LLMs. Validation and retry built in. |
| Outlines | Constrained generation | Free (open source) | Guarantees valid JSON/regex output from local models. Good for open-source model tool use. |
| Magentic | Python tool use | Free (open source) | Decorator-based tool calling for Python. Clean, Pythonic API. |

## How It Fits Your Workflow

- **Every Phase**: Function calling underpins all AI-powered features. Your scraper agents use tools to fetch pages and store data. Your development agents use tools to read/write files, run tests, and execute commands. Your analysis agents use tools to query databases and call APIs.
- **Phase 1 (Dashboard)**: LLM-powered analysis of opportunities uses function calling to query the database, fetch RFP documents from S3, and run scoring algorithms.
- **Kanban 1 (Demo Dev)**: Every demo that involves an AI interacting with a system uses function calling. Design your tool schemas carefully: they are the API between the AI and the world.
- **Proposals**: Explain function calling in terms government evaluators understand: "The AI has a defined set of approved actions it can take, each with validated inputs and logged outputs. It cannot take actions outside this approved set."

## Current State of the Art

All major frontier models now support robust function calling with near-perfect JSON schema adherence. Claude, GPT-4, and Gemini achieve >99% valid JSON output when using their native tool use APIs. Parallel tool calling (executing multiple functions simultaneously) is supported by all major providers.

Structured outputs (guaranteed schema compliance) have been separated from free-form tool calling. OpenAI's Structured Outputs and Anthropic's tool use both guarantee that the model's output exactly matches the defined JSON schema, eliminating the need for output parsing or retry logic.

Best practices have standardized: define tools with clear names, detailed descriptions, and comprehensive JSON schemas with field descriptions. Models use the descriptions to understand when and how to use each tool. Better descriptions lead to better tool selection accuracy.

The key architectural decision is granularity: fine-grained tools (one function per action) are more reliable but require more LLM reasoning steps. Coarse-grained tools (one function that does many things with parameters) are faster but more error-prone. The sweet spot is medium granularity: one tool per logical capability with 2-5 parameters.

Tool use costs are primarily driven by the tool definitions in the system prompt. 20 tools with detailed schemas can consume 3,000-5,000 tokens of context. Optimize by only including tools relevant to the current task.

## Learning Path

1. **Master Anthropic's tool use API** - Build a simple agent that uses 3-4 tools (search, calculate, store, retrieve). Focus on writing excellent tool descriptions. Anthropic docs: https://docs.anthropic.com/en/docs/tool-use
2. **Study Instructor** (Python) for guaranteed structured outputs. When you need the model to return data in a specific format (not just call functions), Instructor with Pydantic models is the cleanest approach.
3. **Design a tool schema** for a government use case (e.g., permit processing: check_requirements, validate_submission, flag_issues, draft_response). This exercise builds the skill of translating business processes into tool definitions.

## Notes

