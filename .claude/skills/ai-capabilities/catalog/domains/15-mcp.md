# MCP (Model Context Protocol)

**Category**: Architecture Patterns
**Maturity**: Growing
**Relevance**: Critical
**Last Updated**: 2026-02-09

## What It Is

MCP (Model Context Protocol) is an open standard for connecting AI models to external data sources and tools. Created by Anthropic and now adopted by OpenAI, Microsoft, Google, and the broader ecosystem, MCP provides a universal interface -- often called "the USB-C of AI" -- that lets any AI application connect to any data source or tool through a standardized protocol. Instead of building custom integrations for each AI-tool pairing, both sides implement the MCP spec and interoperate automatically.

## Why It Matters

MCP is transforming how AI systems integrate with enterprise infrastructure. With 97 million monthly SDK downloads and over 10,000 registered servers, it has become the de facto standard for AI integration. For government contracting, MCP matters because: (1) it dramatically reduces integration costs when connecting AI to agency systems, (2) agencies can adopt AI incrementally by adding MCP servers to existing tools, and (3) it positions your solutions as vendor-neutral and future-proof.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| MCP TypeScript SDK | SDK | Free (open source) | Official SDK for building MCP servers and clients in Node.js/TypeScript. |
| MCP Python SDK | SDK | Free (open source) | Official SDK for Python MCP servers. Good for data/ML tools. |
| Claude Code (MCP client) | AI client | Included | Native MCP client. Connect to any MCP server for tool access. |
| Cursor (MCP client) | AI editor | $20/mo | MCP client support for connecting external tools to your editor. |
| Composio | MCP server hub | Free tier, $30/mo Pro | 500+ pre-built MCP integrations (GitHub, Slack, databases, APIs). |
| Smithery | MCP registry | Free | Registry and discovery for MCP servers. Find pre-built integrations. |
| Cloudflare MCP | Hosting platform | Free tier | Host MCP servers on Cloudflare Workers. Low-latency, globally distributed. |
| Zapier MCP | Integration platform | Included with Zapier plans | Expose Zapier automations as MCP tools. Connects to 6,000+ apps. |

## How It Fits Your Workflow

- **Phase 1 (Dashboard)**: MCP servers for data sources. Build MCP servers that expose HigherGov, BidNet, and state portal data to any AI client. Your scrapers become reusable AI-accessible data sources.
- **Kanban 1 (Demo Dev)**: Build demos that include MCP servers for the target agency's data. "This MCP server connects your case management system to any AI tool." The demo is the integration.
- **Kanban 2 (Teaming)**: MCP as a teaming differentiator. "Our solutions use MCP, so they integrate with any AI tool your other vendors use." Partners value interoperability.
- **Skill System**: Your Claude Code skills already leverage MCP. The mcp-integration skill provides guidance for building and connecting MCP servers.

## Current State of the Art

MCP adoption has exploded since Anthropic open-sourced the protocol. The three transport types (stdio for local, SSE for HTTP, and the newer Streamable HTTP) cover all deployment scenarios from development to production.

The MCP ecosystem includes servers for: databases (PostgreSQL, SQLite, MongoDB), file systems, web search (Brave, Google), code repositories (GitHub, GitLab), productivity tools (Slack, Notion, Google Drive), cloud providers (AWS, GCP), and specialized tools (Puppeteer, Playwright).

Key architectural pattern: MCP servers as a "data layer" for AI. Instead of giving AI direct database access, wrap your data in an MCP server that enforces access controls, validates queries, and logs all interactions. This is exactly the kind of controlled access government agencies require.

Enterprise adoption is accelerating. Organizations are building internal MCP servers to expose their APIs, databases, and tools to AI assistants in a controlled, auditable way. This is the government procurement opportunity: help agencies build MCP servers for their systems.

The protocol continues to evolve. Recent additions include authentication support, server-initiated requests, and improved error handling, addressing the gaps that early enterprise adopters identified.

## Learning Path

1. **Build an MCP server** for your opportunity database. Expose search, filter, and analysis capabilities through MCP so any AI client can query your data. Use the mcp-integration skill for guidance.
2. **Connect pre-built MCP servers** to Claude Code. Add the GitHub, PostgreSQL, and Brave Search MCP servers to your workflow for hands-on understanding of the client side.
3. **Study the MCP specification** at https://modelcontextprotocol.io. Understanding the protocol deeply lets you architect MCP-based solutions for government proposals.

## Notes

