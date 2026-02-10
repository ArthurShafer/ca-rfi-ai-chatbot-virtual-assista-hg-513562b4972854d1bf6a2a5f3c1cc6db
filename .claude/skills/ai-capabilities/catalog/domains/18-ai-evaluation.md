# AI Evaluation Frameworks

**Category**: Infrastructure & Operations
**Maturity**: Emerging
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

Systematic frameworks and tools for measuring the quality, accuracy, and reliability of AI system outputs. Evaluation goes beyond simple unit testing to assess nuanced qualities like faithfulness to source material, answer relevancy, context precision, hallucination rates, and task completion accuracy. These tools enable data-driven decisions about model selection, prompt optimization, and system readiness for production.

## Why It Matters

Government agencies need evidence that AI systems work correctly. "It seems to work well" is not acceptable for systems that process citizen data or make consequential decisions. Evaluation frameworks provide quantitative metrics: "This system achieves 94% faithfulness to source documents and 91% answer relevancy on our test dataset." These numbers go into proposals, acceptance criteria, and ongoing monitoring reports.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| DeepEval | Evaluation framework | Free (open source) | 14+ metrics including faithfulness, relevancy, hallucination. Integrates with pytest. |
| RAGAS | RAG evaluation | Free (open source) | Specialized for RAG systems. Measures faithfulness, answer relevancy, context precision/recall. |
| OpenAI Evals | Evaluation framework | Free (open source) + API costs | Model-graded evaluations. Good for comparing model performance on custom benchmarks. |
| Braintrust | Eval platform | Free tier, custom pricing | Online and offline evaluation. Prompt playground for rapid iteration. Scoring and comparison. |
| Promptfoo | Prompt testing | Free (open source) | CLI tool for testing prompts against multiple models. Red-teaming built in. |
| LangSmith Evaluators | Evaluation suite | $39/mo+ | Integrated with LangChain. Custom evaluators, dataset management, comparison views. |
| Inspect AI | Evaluation framework | Free (open source, UK AISI) | Task-based evaluation. Built by UK AI Safety Institute. Strong at evaluating agent capabilities. |

## How It Fits Your Workflow

- **Kanban 1 (Demo Dev)**: Every demo needs acceptance criteria. Define evaluation metrics during scoping, measure during development, report in the Technical Response Package. "Our document Q&A system achieves faithfulness >0.95 on the provided test dataset."
- **Phase 1 (Dashboard)**: Evaluate the TechClassifier. Build a labeled test set of opportunities (relevant/not relevant) and measure precision/recall. This is how you tune the classifier.
- **Proposals**: Include evaluation methodology in technical approaches. Government evaluators are increasingly sophisticated about AI evaluation. Cite specific metrics, tools, and thresholds.
- **Phase 4 (Execution)**: Ongoing evaluation in production. Automated evaluation pipelines that measure output quality weekly and alert on degradation.

## Current State of the Art

RAGAS has become the standard evaluation framework for RAG systems. Its four core metrics (faithfulness, answer relevancy, context precision, context recall) provide a comprehensive view of RAG quality. Production targets: faithfulness >0.95, answer relevancy >0.90, context precision >0.85.

LLM-as-a-judge evaluation (using one model to evaluate another's output) has proven effective when properly calibrated. Agreement with human judgment is typically 80-90%, sufficient for continuous monitoring though not for final acceptance testing.

Red-teaming (adversarial testing to find failure modes) is becoming standard for government AI systems. Tools like Promptfoo and Garak automate common adversarial patterns: prompt injection, jailbreaking, harmful content generation, and PII leakage.

The evaluation pipeline pattern has standardized: (1) define test datasets with golden answers, (2) run system against test data, (3) score with automated metrics, (4) review edge cases with humans, (5) iterate and retest. This pipeline runs in CI/CD for continuous quality assurance.

A significant gap remains: evaluating long-running agent tasks. Current frameworks evaluate single input-output pairs well but struggle with multi-step agent workflows. Inspect AI from the UK AI Safety Institute is the most promising tool for agent evaluation.

## Learning Path

1. **Set up RAGAS** on your RAG demo. Create a test dataset of 50 questions with ground truth answers. Measure faithfulness and answer relevancy. Use the results to tune chunking and retrieval.
2. **Add Promptfoo** to your development workflow. Test critical prompts against multiple models and configurations. Especially useful before switching models or updating system prompts.
3. **Build a TechClassifier evaluation pipeline** - Label 200 opportunities as relevant/irrelevant, measure precision and recall, use results to tune scoring thresholds.

## Notes

