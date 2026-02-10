---
name: environment-constraints
description: "MUST use before brainstorming for government/enterprise demos. Researches likely technical environment constraints (IT policies, security, hosting, databases) to inform but not over-constrain demo development."
---

# Environment Constraints Research

## Overview

Before brainstorming a demo, research the target organization's likely technical environment. This informs design decisions without over-constraining the demo quality.

**Goal**: Build demos that are impressive AND realistically integratable.

## When to Use

**Always before brainstorming for:**
- Government agency demos (state, federal)
- Enterprise client demos
- Any project that will eventually integrate with existing systems

**Not needed for:**
- Pure greenfield products
- Internal tools with no integration requirements

## Research Process

### Step 1: Identify Target Organization

Extract from the solicitation:
- Agency/department name
- State (for state-specific IT policies)
- Any mentioned systems, databases, or integrations

### Step 2: Public Research

Search for publicly available information:

**IT Policies & Standards**
- `[Agency name] IT security policy`
- `[State] state government IT standards`
- `[State] cybersecurity requirements vendors`
- `[Agency] technology requirements`

**Infrastructure Hints**
- `[State] state government cloud policy` (AWS, Azure, GCP, on-prem?)
- `[State] data center` or `[State] hosting requirements`
- Job postings mentioning tech stack (often reveal what they use)

**Compliance Requirements**
- CJIS (for law enforcement/criminal justice - like RIDOC)
- HIPAA (for health agencies)
- FedRAMP (for federal)
- StateRAMP (emerging state standard)
- PCI-DSS (if payment processing)

**Integration Standards**
- `[Agency] API` or `[Agency] data sharing`
- `[State] enterprise service bus`
- Common government standards: NIEM, HL7, EDI

### Step 3: Make Educated Assumptions

Based on research, document likely constraints:

```markdown
## Likely Environment Constraints: [Agency/Project]

### Confidence Levels
- **Confirmed**: Found in official documentation
- **Likely**: Strong indicators from research
- **Assumed**: Industry standard for this type of agency

### Hosting Environment
- [ ] Cloud (AWS/Azure/GCP) - which?
- [ ] State data center / on-prem
- [ ] Hybrid
- [ ] Unknown - assume: [your assumption]

### Security Requirements
- [ ] Specific compliance (CJIS, HIPAA, etc.)
- [ ] MFA requirements
- [ ] Data residency (must be in-state?)
- [ ] Encryption requirements (at rest, in transit)
- [ ] Background check requirements for access

### Database Environment
- [ ] Specific database (SQL Server, Oracle, PostgreSQL?)
- [ ] Legacy systems to integrate with
- [ ] Data format requirements

### Network Constraints
- [ ] VPN requirements
- [ ] Firewall/whitelist requirements
- [ ] Air-gapped environments
- [ ] On-site only access

### Authentication
- [ ] Existing identity provider (Active Directory, Okta, etc.)
- [ ] SSO requirements
- [ ] Role-based access patterns

### Technology Preferences
- [ ] Preferred languages/frameworks
- [ ] Prohibited technologies
- [ ] Existing systems to integrate with

### Documentation Requirements
- [ ] Specific documentation standards
- [ ] Security documentation (SSP, etc.)
- [ ] Accessibility requirements (508 compliance)
```

### Step 4: Implications for Demo

For each constraint, note the implication:

| Constraint | Demo Implication | Priority |
|------------|------------------|----------|
| CJIS compliance | Need audit logging, encryption, role-based access | Must include |
| SQL Server likely | Use SQLAlchemy with dialect flexibility | Design for, don't block on |
| On-prem possible | Include Docker deployment option | Nice to have |
| SSO expected | Build with auth abstraction, demo with simple auth | Architecture now, implement later |

### Priority Levels

**Must Include**: Build this into the demo
- Example: Audit logging for CJIS

**Design For**: Architect to support, but don't fully implement
- Example: Database abstraction layer for SQL Server compatibility

**Nice to Have**: Include if easy, skip if it affects demo quality
- Example: Full SSO integration

**Document Only**: Note in technical approach, don't build
- Example: "Production deployment would integrate with state LDAP"

## Output

Produce a constraints document saved to:
```
docs/requirements/{project}-environment-constraints.md
```

This document is referenced throughout brainstorming and implementation.

## Integration with Brainstorming

When brainstorming begins, load the environment constraints document and:

1. **Reference constraints during tech stack decisions**
   - "Given likely SQL Server environment, we'll use SQLAlchemy for database abstraction"

2. **Flag when demo diverges from likely production**
   - "Demo uses SQLite for simplicity, but architecture supports SQL Server migration"

3. **Include in Technical Response Package**
   - Shows you understand their environment
   - Differentiates from competitors who ignore integration reality

## Example: RIDOC (Rhode Island DOC)

### Research Findings

**CJIS Compliance** (Confirmed)
- DOC handles criminal justice data
- Must comply with FBI CJIS Security Policy
- Requires: encryption, audit logging, access controls, background checks

**State IT Environment** (Likely)
- RI uses Microsoft-heavy stack (based on job postings)
- SQL Server is standard state database
- Active Directory for authentication
- Some cloud adoption but primarily on-prem

**Integration Points** (Assumed)
- Case management system exists (legacy)
- Data must flow to/from existing systems
- API integration likely required

### Demo Implications

| Constraint | Demo Approach |
|------------|---------------|
| CJIS | Include audit logging, role-based access, encryption indicators |
| SQL Server | Use SQLAlchemy, test against PostgreSQL (compatible), document SQL Server support |
| Active Directory | Build with auth abstraction, demo with simple login, note AD integration |
| Legacy integration | Build clean API layer, document integration patterns |

## Don't Over-Constrain

**Remember**: A polished, working demo wins contracts. Don't sacrifice demo quality for hypothetical constraints.

**Good balance:**
- Architecture that supports likely constraints
- Demo that showcases capability beautifully
- Documentation that shows you understand the real environment

**Avoid:**
- Building half-features because "they might need X"
- Ugly UI because of security theater
- Delayed delivery trying to support every possibility

The constraint research informs your decisions, it doesn't make them for you.
