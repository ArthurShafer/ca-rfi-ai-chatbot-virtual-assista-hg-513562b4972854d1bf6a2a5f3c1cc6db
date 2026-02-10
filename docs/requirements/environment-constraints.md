# Environment Constraints: Tulare County AI Chatbot & Virtual Assistant

## Target Organization
- **Agency**: County of Tulare, California
- **Population**: ~475,000 (Central Valley)
- **Demographics**: 66% Hispanic, 50%+ bilingual (Spanish-English), 22% foreign-born
- **IT Department**: Tulare County Information & Communications Technology (TCiCT), 150+ staff, 7 units including dedicated Information Security
- **Contact**: S. Portugal (sportugal@tularecounty.ca.gov)

---

## Hosting Environment

| Constraint | Detail | Confidence |
|------------|--------|------------|
| Cloud-friendly | County migrated to CGI Advantage 4 Cloud for financial systems (2022), actively moving off legacy on-prem | Confirmed |
| ERP: CGI Advantage 4 Cloud | Financial management, accounting, inventory, asset management, vendor self-service. 35+ year CGI partnership | Confirmed |
| Possible Oracle Cloud ERP | AppsRunTheWorld lists Oracle Cloud ERP selection (2022) for financial. May be separate department | Confirmed |
| GIS: Esri ArcGIS | County runs ArcGIS Portal at iportal.tularecounty.ca.gov | Confirmed |
| Managed cloud model | CGI runs their own infrastructure, not a raw AWS/Azure tenancy. County likely comfortable with vendor-hosted cloud | Likely |
| Data residency: continental US | CDT SIMM 5325 requires cloud data within CONUS. County procurement typically mirrors this | Confirmed (state policy) |

**Demo implication**: Cloud-hosted SaaS delivery is fine. No need for on-prem deployment option. US-based hosting required.

---

## Security & Compliance

### California State Standards (CDT)

| Standard | Requirement | Confidence |
|----------|-------------|------------|
| SIMM 5325 | Cloud providers need SOC 2 Type II, FedRAMP, or GovRAMP attestation | Confirmed |
| SIMM 5305-A | Information security program management | Confirmed |
| SAM 5350.1 | Encrypt all confidential/sensitive/personal data | Confirmed |
| MFA | Required for all personnel with system access (CCPA cybersecurity regs, effective Jan 2026) | Confirmed |

### California AI Regulations

| Law/Policy | Requirement | Effective | Confidence |
|------------|-------------|-----------|------------|
| **SB 313** | **GenAI communicating with public must "clearly and conspicuously identify" the interaction is AI.** Establishes Office of AI within CDT | 2024 | **Confirmed - HIGH IMPACT** |
| SB 896 | GenAI Accountability Act: transparency, risk assessments, clear communication for AI in gov services | Jan 2025 | Confirmed |
| SAM 4986.6/.11/.12/.13 | GenAI POC in CDT sandbox; mandatory bidder disclosure language; Acceptable Use Policy; workforce training. Vendors must submit STD 1000 GenAI Factsheet | Feb 2025 (TL 25-01) | Confirmed |
| SIMM 5305-F | GenAI Risk Assessment per NIST AI RMF. Classifies as Low/Moderate/High risk. Moderate+ requires CDT consultation | Jul 2024 | Confirmed |
| CCPA ADMT | Automated decision-making opt-out and pre-use notices for "significant decisions" | Jan 2027 | Confirmed |
| AB 302 | CDT must inventory high-risk automated decision systems. Chatbot may qualify if it supports consequential decisions (eligibility, routing) | Jan 2025 | Confirmed |
| AB 2013 | GenAI training data transparency disclosure | Jan 2026 | Confirmed |
| SB 53 | Frontier AI transparency (>10^26 ops). Applies to model vendors (OpenAI, Anthropic, Google), not county | Jan 2026 | Confirmed |
| EO N-12-23 | State agencies must do AI risk analysis, develop procurement guidelines, establish sandbox environments | Sept 2023 | Confirmed |

**Note on SB 313:** [Full text](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240SB313). While technically binding on state agencies, this sets the California standard for AI disclosure. Our demo must include prominent AI identification.

**Note on CDT Poppy:** In December 2025, the state launched "Poppy" — a GenAI tool for state government use with 20+ departments. This signals strong state-level AI adoption momentum. [Source](https://www.gov.ca.gov/2025/12/16/governor-newsom-launches-new-initiatives-to-partner-with-tech-policy-experts-and-accelerate-responsible-ai-in-state-government/)

### Privacy

| Law | Applicability | Detail |
|-----|--------------|--------|
| **CCPA/CPRA** | **Does NOT apply** | Only covers for-profit businesses. Tulare County is exempt as a government agency |
| **CA Information Practices Act** (Civil Code 1798-1798.78) | **YES - Primary privacy law** | Limits collection to what's necessary; requires purpose specification at time of collection; restricts disclosures; provides individual access rights; mandates data security safeguards |

**Chatbot privacy requirements:** Minimize data collection, provide notice before/at collection, establish retention policies (no indefinite storage), restrict PII disclosure, maintain disclosure accounting, anonymize any data used for model retraining. [Source (IPA PDF)](https://www.calhfa.ca.gov/privacy/ipa.pdf)

### Accessibility

| Requirement | Detail | Confidence |
|-------------|--------|------------|
| Section 508 / WCAG | Tulare County explicitly complies, publishes web accessibility policy. CA Gov Code 7405 directs compliance with Section 508 | Confirmed |
| ADA Title II Final Rule (DOJ April 2024) | **WCAG 2.1 Level AA by April 24, 2026** for governments serving 50K+ people. Tulare County (486K) must comply | **Confirmed - CRITICAL** |
| CA AB 434 (Gov Code 11546.7) | Requires WCAG 2.0 Level AA or subsequent version conformance | Confirmed |

**Key WCAG 2.1 AA criteria for chatbots:** Non-text alt text (1.1.1), semantic structure (1.3.1), 4.5:1 contrast (1.4.3), full keyboard nav (2.1.1), logical focus order (2.4.3), input labels (3.3.2), ARIA roles (4.1.2), aria-live for new messages (4.1.3). [Source](https://www.ada.gov/resources/web-rule-first-steps/)

**Demo implication**: Chatbot MUST be keyboard-navigable, screen-reader compatible, meet color contrast requirements. This is non-negotiable.

### Multilingual

| Requirement | Detail | Confidence |
|-------------|--------|------------|
| Spanish support | 66% Hispanic population, 50%+ bilingual. Essential for public-facing tool | Confirmed (demographic) |
| **Dymally-Alatorre Bilingual Services Act** | CA Gov Code 7290-7299.8 requires state/local agencies to provide services in languages spoken by substantial portion of public served | **Confirmed - State law** |
| Additional languages | CAL FIRE chatbot supports 70 languages as a California government benchmark. Consider Hmong, Tagalog based on community | Assumed |

**Demo implication**: Spanish support is a must-have. Multi-language architecture that can scale beyond two languages.

---

## Integration Points

| System | Notes | Confidence |
|--------|-------|------------|
| 211 Tulare County | Resident services referral (housing, food, utilities, health, legal). Chatbot should complement, not duplicate | Confirmed |
| CGI Advantage 4 Cloud | County ERP. Future integration possible for vendor/financial queries | Confirmed |
| Esri ArcGIS | GIS portal. Could power location-based service routing | Confirmed |
| Tyler Technologies EnerGov | Permitting, planning, licensing self-service portal (palmscss.tularecounty.ca.gov). [Contract since 2014](https://www.businesswire.com/news/home/20140304005219/en/) | Confirmed |
| HHSA Portal (tchhsa.org) | Separate Health & Human Services site: CalFresh, Medi-Cal, WIC, Behavioral Health, Public Health | Confirmed |
| County website (tularecounty.ca.gov) | **Relaunched August 21, 2025** with improved accessibility, SEO, and language translation. Multiple department microsites | Confirmed |
| No existing chatbot | Greenfield, no incumbent to replace or integrate with | Confirmed (searched site) |

---

## Authentication & Access

| Constraint | Detail | Confidence |
|------------|--------|------------|
| Active Directory likely | Standard for CA county governments. CDT offers M365 via VHSS program | Assumed |
| MFA required | For admin access per CCPA cybersecurity regulations | Confirmed |
| Public chatbot = no auth | Public-facing chatbot should require no login for basic use | Assumed |
| Admin panel = SSO | Backend management should support SSO/AD integration | Assumed |

---

## Competitive Landscape (CA County Chatbots)

| Entity | Vendor | Notes |
|--------|--------|-------|
| Fairfield, CA | Citibot (Amazon Lex) | $20K setup + annual fee |
| Roseville, CA | Citibot | $375K including backend integration |
| San Jose | SJ311 chatbot | 311 service request intake |
| CA Secretary of State | Microsoft (Eureka) | Won Best of California award |
| CAL FIRE | Citibot | 70-language support |

**Takeaway**: Citibot is the dominant incumbent in CA government chatbots. Our response should differentiate on AI sophistication, multilingual capability, and integration flexibility.

---

## Demo Implications Summary

| Constraint | Demo Approach | Priority |
|------------|---------------|----------|
| SB 896 AI disclosure | Visible "AI-powered" badge + "Talk to a human" button on every screen | Must include |
| WCAG 2.1 AA accessibility | Keyboard nav, ARIA labels, contrast ratios, screen reader testing | Must include |
| Spanish language | Full bilingual UI and chat responses | Must include |
| US data residency | Host on US-based cloud (AWS us-east/us-west) | Must include |
| Human escalation path | Clear handoff flow from bot to live agent or phone/email | Must include |
| SOC 2 / FedRAMP | Document compliance path in response. Demo uses standard cloud hosting | Design for |
| GenAI risk assessment | Include risk assessment framework in documentation | Document only |
| CGI Advantage integration | Clean API layer that could connect to ERP. Don't build the connector | Design for |
| 211 Tulare complement | Reference 211 as a data source/handoff target. Show awareness of existing services | Design for |
| Multi-language (beyond Spanish) | Architecture supports i18n. Demo shows English + Spanish | Design for |
| Admin SSO/AD | Auth abstraction layer. Demo uses simple login | Design for |
| CCPA ADMT compliance | Opt-out mechanism architecture | Document only |
| Training data transparency | Documentation on model provenance | Document only |

---

## Procurement Context

This is an **RFI (Request for Information)** — pre-procurement market research that does not result in a contract award.

**Expected formal procurement path for $2M IT solution:**

| Threshold | Process |
|-----------|---------|
| Up to $10,000 | Purchasing agent authority |
| Over $10,000 | Board of Supervisors approval |
| Over $200,000 | Formal competitive bidding (CUPCCAA) |
| Over $1,000,000 (IT) | DGS-standard IFB/RFP format |

The subsequent RFP will require: sealed proposals, evaluation committee, Board of Supervisors approval, contract negotiation, insurance/bonding, and likely multi-year budget appropriation.

**Procurement contact:** S. Portugal (sportugal@tularecounty.ca.gov) via [BidNet Direct](https://www.bidnetdirect.com/california/countyoftulare)

---

## Key Differentiators to Emphasize in RFI Response

1. **California AI regulation compliance** (SB 896, SAM 4986, CCPA ADMT) -- show you know the regulatory landscape
2. **Bilingual-first design** -- not an afterthought, built for the community
3. **WCAG 2.1 AA from day one** -- ahead of the April 2026 deadline
4. **Integration-ready architecture** -- APIs that can connect to CGI Advantage, ArcGIS, 211
5. **AI sophistication beyond keyword matching** -- differentiate from Citibot's Amazon Lex-based approach
