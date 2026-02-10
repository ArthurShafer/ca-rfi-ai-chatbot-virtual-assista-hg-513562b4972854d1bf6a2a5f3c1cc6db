# Conversational Analytics / Text-to-SQL

**Category**: Enterprise Applications
**Maturity**: Growing
**Relevance**: Medium
**Last Updated**: 2026-02-09

## What It Is

AI systems that translate natural language questions into database queries (SQL, API calls, or data operations) and return answers in human-readable formats. Instead of requiring SQL knowledge or pre-built reports, users ask questions like "How many permits were approved in Q3?" and get answers with charts and explanations. Gartner predicts 40% of analytics queries will use natural language by end of 2026.

## Why It Matters

Government agencies sit on vast databases but lack the technical staff to query them effectively. Analysts write SQL, create reports, and distribute findings -- a bottleneck that delays decisions by days or weeks. Text-to-SQL democratizes data access: any agency employee can ask questions of their data in plain English. For contracting, this is a compelling demo capability that resonates with non-technical decision-makers on evaluation committees.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| ThoughtSpot Sage | Enterprise analytics | Custom pricing (enterprise) | Natural language search over databases. AI-generated answers with visualizations. |
| Julius AI | AI data analyst | Free tier, $20/mo Pro | Upload data or connect databases. Ask questions, get analysis with charts. Accessible. |
| Vanna.ai | Open-source text-to-SQL | Free (open source), $50/mo Cloud | Trains on your schema. Generates accurate SQL. Python-native. Good for custom deployments. |
| Amazon Q in QuickSight | AWS-native analytics | $20/user/mo (included in QuickSight) | Natural language queries over QuickSight dashboards. Generates new visualizations on request. |
| Metabase + LLM | Open-source BI + AI | Free (open source) | Add LLM layer for natural language queries over Metabase's SQL engine. |
| Claude + SQL generation | Custom solution | Standard Claude pricing | Generate SQL from natural language using Claude's structured outputs. Full control. |
| DuckDB + Motherduck | Analytics database | Free (DuckDB), $0/mo+ (Motherduck) | Fast analytical queries. AI-powered SQL generation. Good for local analysis. |

## How It Fits Your Workflow

- **Phase 1 (Dashboard)**: Add natural language query to the opportunity dashboard. "Show me all MA opportunities over $100K that close this month" generates the filtered view. More intuitive than the current filter interface.
- **Kanban 1 (Demo Dev)**: Conversational analytics is a strong demo for agencies with databases they struggle to query. "Connect your case database, and any supervisor can ask 'how many open cases per worker?' without SQL knowledge."
- **Proposals**: Reference the Gartner stat (40% NL analytics by 2026). Position conversational analytics as democratizing data access. Government evaluators who are non-technical themselves find this compelling.
- **Phase 4 (Execution)**: Build reporting capabilities for contract deliverables. "Here's a natural language interface to all project metrics."

## Current State of the Art

Text-to-SQL accuracy has reached 80-90% on well-documented schemas. The key factors are: schema quality (column names, descriptions, and relationships), few-shot examples (showing the model example question/SQL pairs for the specific database), and validation (running the generated SQL and checking for errors before presenting results).

Vanna.ai's approach of training on your specific schema and query patterns has proven effective: after 50-100 example queries, accuracy exceeds 90% on the types of questions users actually ask. The long tail of unusual queries remains challenging.

The biggest risk in text-to-SQL for government: incorrect answers that look plausible. A query that miscounts because of a subtle JOIN error can lead to wrong decisions. Best practice is to always show the generated SQL alongside the answer, enabling technical users to verify.

Visualization generation (not just answers but charts) has improved. AI can now choose the appropriate chart type, labels, and formatting based on the data and question. Quality is good for standard charts (bar, line, pie) but weak for specialized visualizations.

The architecture pattern that works best: LLM generates SQL, execute against a read-only replica (never production), validate results (row count sanity checks), present with the generated SQL visible. Add caching for repeated queries.

## Learning Path

1. **Add text-to-SQL to your dashboard** - Use Claude to generate SQL queries for your opportunity database based on natural language. Start with a simple chat interface that shows both the SQL and results.
2. **Test Vanna.ai** on your contracts.db schema. Train it with 20 example queries. Measure accuracy on 50 test questions. Evaluate whether it is production-ready for your use case.
3. **Build a demo with Amazon Q in QuickSight** for agencies on AWS. This is the lowest-friction path to natural language analytics on government data.

## Notes

