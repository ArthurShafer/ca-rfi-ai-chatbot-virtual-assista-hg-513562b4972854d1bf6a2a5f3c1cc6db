# AI Regulatory Compliance

**Category**: Governance & Compliance
**Maturity**: Emerging
**Relevance**: High
**Last Updated**: 2026-02-09

## What It Is

The landscape of laws, regulations, and standards governing AI development and deployment. This includes the EU AI Act (effective August 2026), the NIST AI Risk Management Framework, state-level AI legislation (Connecticut, Colorado, and others have passed AI laws), sector-specific regulations (healthcare HIPAA, financial SOC 2), and procurement-specific requirements (FedRAMP for cloud, Section 508 for accessibility). Understanding regulatory compliance is essential for building AI systems that government agencies can legally deploy.

## Why It Matters

Regulatory compliance is shifting from voluntary to mandatory. The EU AI Act (August 2026) is the first comprehensive AI regulation and will influence US state legislation. Connecticut and Colorado have already passed AI laws. Massachusetts, Vermont, and other New England states are considering similar legislation. For a government AI contractor, compliance is not optional: non-compliant systems cannot be deployed. Understanding the regulatory landscape lets you build compliance into proposals from day one, avoiding costly retrofits.

## Key Tools & Platforms

| Tool | Type | Cost | Notes |
|------|------|------|-------|
| NIST AI RMF | Framework | Free | US standard. Four functions: Govern, Map, Measure, Manage. Required for government alignment. |
| EU AI Act | Regulation | Free (public law) | Risk-based classification: Unacceptable, High-risk, Limited, Minimal. Government AI is often "high-risk." |
| NIST SP 800-53 Rev 5 | Security controls | Free | Information security controls. AI systems must comply. Relevant for government deployments. |
| FedRAMP | Cloud authorization | Cost of assessment ($200K-500K for CSPs) | Cloud services for government must be FedRAMP authorized. AWS GovCloud, Azure Gov, etc. |
| SOC 2 | Compliance standard | $20K-50K for audit | Security, availability, processing integrity. Increasingly required for government SaaS. |
| OneTrust | Privacy + AI compliance | Custom enterprise pricing | Privacy management, AI governance, consent management. Comprehensive compliance platform. |
| TrustArc | Privacy compliance | Custom pricing | Privacy impact assessments, AI risk assessments. Strong in regulated industries. |
| Anthropic Usage Policy | Acceptable use | Free (built into Claude) | Claude's built-in restrictions and safety features. Important to understand for government use cases. |

## How It Fits Your Workflow

- **Proposals**: Reference specific regulations in technical approaches. "Our system is designed for compliance with NIST AI RMF, Section 508 accessibility standards, and applicable state AI legislation." This language signals maturity to evaluators.
- **Kanban 1 (Demo Dev)**: Build compliance features into every demo. Audit logging, explainability, human-in-the-loop decision points, accessibility, and data privacy controls. These are not extras; they are requirements.
- **Phase 1 (Dashboard)**: Track regulatory developments that create procurement opportunities. New regulations = new RFPs for compliance tools. Your dashboard should flag solicitations related to AI governance and compliance.
- **Environment Constraints**: The environment-constraints skill should include regulatory requirements for each target agency. What data privacy laws apply? What security standards are required? What accessibility mandates exist?

## Current State of the Art

The EU AI Act classifies AI systems into four risk categories. Government AI systems often fall into "High Risk" (AI in critical infrastructure, employment, education, access to essential services). High-risk requirements include: risk management system, data governance, technical documentation, transparency, human oversight, accuracy/robustness/cybersecurity. Although the EU AI Act is European, US state agencies are using it as a model for their own requirements.

State AI legislation is accelerating. Connecticut's AI Bill (signed 2024) requires disclosure when AI is used in consequential decisions and bias assessments for high-risk AI. Colorado's AI Act (2024) addresses algorithmic discrimination. Massachusetts has proposed similar legislation. These laws create both compliance burdens and opportunities.

For government cloud deployments, FedRAMP authorization is the key gating factor. AWS, Azure, and GCP all have FedRAMP-authorized environments. Anthropic's Claude is available through AWS Bedrock in GovCloud regions, making it accessible for government use. Not all AI tools are available in FedRAMP environments, which limits technology choices for government deployments.

HIPAA compliance is required for any AI system touching health data. The combination of HIPAA + AI creates specific requirements: data cannot be sent to external APIs without a Business Associate Agreement (BAA), models must not memorize patient data, and access to AI-processed health data must be audited.

The practical compliance stack for government AI: NIST AI RMF (governance), NIST 800-53 (security), Section 508 (accessibility), state AI laws (transparency and fairness), and sector-specific regulations (HIPAA, FERPA, CJIS). Understanding this stack is a competitive advantage.

## Learning Path

1. **Map regulatory requirements to your target states** - For each New England state, identify: existing AI legislation, pending AI bills, data privacy laws, and sector-specific regulations. This informs your proposals and environment-constraints research.
2. **Study the EU AI Act high-risk requirements** - Even though it is EU law, the requirements are becoming the template for US state legislation. Understanding them positions you ahead of the regulatory curve.
3. **Create a compliance checklist** for government AI deployments. Include: NIST AI RMF alignment, accessibility (Section 508), data privacy, security controls (NIST 800-53), and state-specific AI laws. Reuse across proposals.

## Notes

