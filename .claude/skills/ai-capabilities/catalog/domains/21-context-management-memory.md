# Context Management & Memory

**Category**: Infrastructure & Operations
**Maturity**: Emerging
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

Systems and techniques for managing what an AI knows and remembers across interactions. This includes conversation memory (maintaining state across messages), persistent memory (retaining information across sessions), hierarchical memory (organizing knowledge at different abstraction levels), and context window optimization (fitting the most relevant information into limited context windows). As Nvidia stated, "the bottleneck is shifting from compute to context."

## Why It Matters

AI systems that forget everything between interactions are frustrating and inefficient. Government workflows span weeks or months: a case that starts in January should not need to be re-explained in March. Context management enables continuity. For your workflow, memory is what enables progressive automation: decision logs become memory, allowing the system to learn your patterns over time. Without memory, every interaction starts from zero.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| CLAUDE.md / MEMORY.md | File-based memory | Free | Your current approach. Project instructions and accumulated knowledge in files. Simple and effective. |
| Mem0 | Memory layer | Free (open source), hosted plans | Adds persistent memory to any LLM app. Hierarchical (user, session, agent). API-based. |
| Zep | Memory service | Free (open source), Cloud $20/mo+ | Long-term memory for AI assistants. Auto-summarization, temporal awareness, entity extraction. |
| LangMem (LangChain) | Memory framework | Free (open source) | Memory management for LangChain/LangGraph agents. Short-term, long-term, episodic memory types. |
| Letta (MemGPT) | Memory architecture | Free (open source), hosted plans | Autonomous memory management. AI decides what to remember, forget, and retrieve. Inspired by OS virtual memory. |
| ChromaDB + metadata | Vector memory | Free (open source) | Store conversation embeddings with timestamps and metadata for semantic recall. |
| Redis + LLM summarization | Hybrid memory | Free (open source) | Fast key-value store for recent context, LLM-summarized long-term memory. |

## How It Fits Your Workflow

- **Decision Logging**: Your decision logs ARE a memory system. Every logged decision (category, proposed, changed, reasoning) is retrievable context for future decisions. The schema in `logs/decisions/SCHEMA.md` is a memory format.
- **Progressive Automation**: Memory is the bridge from human-in-the-loop to autonomous operation. The system remembers past decisions, identifies patterns, and gradually requires less human input.
- **Kanban 1 (Demo Dev)**: Build demos with persistent memory. "This assistant remembers every citizen interaction about their case. When they call back, it picks up where they left off." Government agencies love this.
- **CLAUDE.md System**: Your project instructions file is a form of long-term memory. The MEMORY.md file accumulates operational knowledge across sessions. This is manual memory; tools like Mem0 or Zep automate it.

## Current State of the Art

The landscape has consolidated around three memory architectures:

1. **Buffer memory**: Keep the last N messages in context. Simple, but loses information as conversations grow. Used by most chatbot applications.

2. **Summarization memory**: Periodically summarize older messages into compressed representations. Balances context length with information retention. Zep excels here.

3. **Hierarchical memory**: Different memory stores at different abstraction levels (facts, episodes, procedures, preferences). Mem0 and Letta implement this. Most promising for long-running agent systems.

Context window sizes have grown dramatically (1M-2M tokens for Gemini, 200K for Claude), reducing but not eliminating the need for memory management. Even with 2M tokens, you cannot fit a year of case history into context. Memory systems compress and retrieve selectively.

The CLAUDE.md approach (instructions as memory) is actually ahead of many AI applications. Most production AI systems still lack any form of persistent memory. Adding even simple file-based memory differentiates your demos from competitors.

Entity extraction from conversations (identifying people, organizations, dates, and relationships mentioned in interactions) enables structured memory that supports queries like "what did we decide about the Massachusetts DMV opportunity?"

## Learning Path

1. **Formalize your MEMORY.md approach** - Document the pattern of accumulating operational knowledge in MEMORY.md. This is a simple, effective memory system that works without additional infrastructure.
2. **Prototype Mem0** integration - Add Mem0 to a demo agent to see hierarchical memory in action. It takes about an hour to integrate and dramatically improves multi-session interactions.
3. **Study the Letta (MemGPT) architecture** - Understanding autonomous memory management (the AI decides what to remember) informs your progressive automation design.

## Notes

