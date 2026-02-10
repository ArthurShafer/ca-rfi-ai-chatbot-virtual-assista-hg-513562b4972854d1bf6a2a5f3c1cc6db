---
name: partner-discovery
description: Discover teaming partners by browsing HigherGov portal, extracting company data, and producing JSONL files for import. Use when the user asks to "find partners", "discover teaming companies", "expand the partner directory", "run a discovery session", "find teaming partners for [opportunity]", or mentions partner/teaming research.
allowed-tools: mcp__chrome__use_browser, Bash, Read, Write, Edit, Grep, Glob
---

# Partner Discovery

## Overview

Systematically discover and evaluate teaming partners through HigherGov portal browsing, LinkedIn enrichment, and structured JSONL output for database import.

**Announce:** "I'm using the partner-discovery skill to find teaming partners."

**SLED-only pursuit.** Federal contract data is used for partner intelligence only (who has past performance, certs, relationships) -- we are not pursuing federal contracts ourselves.

## Ideal Partner Profile

- Small to mid-sized (< 500 employees, sweet spot 20-200)
- Any certification is a strong positive (SDVOSB, 8(a), HUBZone, WOSB, SDB, Veteran, Minority)
- Cloud/IT capability (AWS, Azure, managed services, cybersecurity) but NOT an AI company
- Currently holds government contracts (SLED or federal)
- Nationwide scope, no region restrictions
- **Value prop**: They bring certs + contract vehicles + past performance, we bring AI/ML

## Red Flags (Skip These)

- **Enterprise** (> 1000 employees): Booz Allen, Deloitte tier
- **Already has strong AI/ML capability** -- they don't need us
- **No government contract history** -- no past performance to leverage
- **Dormant** (no contracts in 3+ years)

## Reference Skills

- `highergov-discovery` -- Portal navigation tips, URL patterns, search syntax
- `browsing` -- Chrome DevTools Protocol usage, action reference, auto-capture

---

## Phase 1: Session Setup

Begin every discovery session by establishing scope.

### Ask the User

1. **Proactive discovery** or **campaign-targeted**?
   - **Campaign-targeted**: Load opportunity details (state, NAICS, agency, description) from the database or user input. Tailor partner search to the specific opportunity requirements.
   - **Proactive**: Ask which states/sectors to focus on. Default to all New England (MA, CT, RI, VT, NH, ME) with IT/software/AI sector.

2. Confirm HigherGov portal is accessible (user must be logged in or credentials available).

3. Check for existing JSONL files to append to:
   ```bash
   ls -la scrapers/data/partner_discovery.jsonl scrapers/data/partner_contacts.jsonl 2>/dev/null
   ```
   JSONL files should be **appended to** (not overwritten) across sessions. The importer handles dedup.

4. Load current partner directory state if available:
   ```bash
   wc -l scrapers/data/partner_discovery.jsonl 2>/dev/null
   ```

---

## Phase 2: Contract Awards Mining

Mine HigherGov contract awards to find companies winning IT work.

### Step-by-Step Portal Browsing

1. **Navigate to contract awards search:**
   ```json
   {"action": "navigate", "payload": "https://www.highergov.com/contract/"}
   {"action": "await_element", "selector": ".search-results, table, input"}
   ```

2. **Apply filters:**
   - **NAICS codes** (IT): 541511, 541512, 541519, 541611, 541618, 541690, 518210, 511210, 541513, 541614, 541715
   - **Set-aside types**: 8(a), SDVOSB, HUBZone, WOSB, SDB
   - **Award size**: $500K - $10M
   - **Target state(s)**: As determined in Phase 1
   - **Date range**: Last 2 years

3. **Extract company names and award details from results:**
   ```json
   {"action": "extract", "payload": "markdown"}
   ```

4. **Click into company profiles** for each promising result.

5. **For each company, extract these data points:**
   - `name` -- Company name (prefer legal name from HigherGov for consistency)
   - `legal_name` -- Official legal name if different
   - `state` -- Two-letter state code
   - `city` -- City
   - `employee_count` -- Number of employees
   - `website` -- Company URL
   - `certifications` -- Array of cert codes (e.g., `["SDVOSB", "8(a)"]`)
   - `naics_codes` -- Array of NAICS codes
   - `capability_keywords` -- Array of capability terms (flag cloud/IT terms, flag AI)
   - `ai_capability` -- Boolean: true if they have AI/ML capability (red flag)
   - `contract_history` -- Array of contract objects (see schema below)
   - `highergov_url` -- Direct link to their HigherGov profile

6. **Write each company to JSONL:**
   ```bash
   echo '{"name": "...", ...}' >> scrapers/data/partner_discovery.jsonl
   ```

---

## Phase 3: Awardee Profile Browse

Browse the HigherGov awardee directory for additional partners.

1. **Search awardee directory:**
   ```json
   {"action": "navigate", "payload": "https://www.highergov.com/awardee/"}
   {"action": "await_element", "selector": ".search-results, table, input"}
   ```

2. **Apply IT NAICS filters** (same codes as Phase 2).

3. **Filter for certified companies** -- any certification is a strong positive.

4. **Check capability descriptions** for cloud/IT keywords without AI capability.
   - Good: AWS, Azure, managed services, cybersecurity, cloud migration, infrastructure
   - Skip: machine learning, artificial intelligence, NLP, computer vision, deep learning

5. **Extract same data points as Phase 2**, append to `scrapers/data/partner_discovery.jsonl`.

---

## Phase 4: Network Expansion

Leverage known good partners to discover connected companies.

1. **If a known good partner exists**, browse their HigherGov profile:
   ```json
   {"action": "navigate", "payload": "https://www.highergov.com/awardee/<partner-slug>/"}
   {"action": "await_element", "selector": ".profile, .details"}
   ```

2. **Find teaming partners** -- look for prime/sub relationships on their profile.

3. **Find competitors** on similar awards -- companies bidding on the same contracts.

4. **Browse each connected company**, extract data points, and append to JSONL.

This creates a network effect: one good partner leads to 3-5 more candidates.

---

## Phase 5: Contact Enrichment

For each company in the partner JSONL, find key decision-makers.

### Target Titles ONLY

- CEO, President, Owner, Founder
- Managing Partner
- VP Business Development, BD Director
- CTO, VP Engineering
- VP Contracts, Capture Manager

### Process

1. **Search LinkedIn for the company:**
   ```json
   {"action": "navigate", "payload": "https://www.linkedin.com/company/<company-name>/people/"}
   {"action": "await_element", "selector": ".search-results, .org-people"}
   ```

2. **Extract contacts** matching target titles: name, title, LinkedIn URL.

3. **Optionally check company website** About/Team page for additional contacts:
   ```json
   {"action": "navigate", "payload": "https://<company-website>/about"}
   {"action": "extract", "payload": "markdown"}
   ```

4. **Write to contacts JSONL:**
   ```bash
   echo '{"partner_name": "...", ...}' >> scrapers/data/partner_contacts.jsonl
   ```

5. **Rate limiting**: LinkedIn may throttle browsing. Suggest pausing 10-15 seconds between profiles. If rate-limited, stop and resume later.

---

## Phase 6: Import

Run the importer to load discovered partners into the database:

```bash
python scrapers/partner_importer.py --partners scrapers/data/partner_discovery.jsonl --contacts scrapers/data/partner_contacts.jsonl
```

Report results: X partners created, Y updated, Z contacts added.

---

## JSONL Format Reference

### partner_discovery.jsonl

One JSON object per line. Each object represents one company:

```json
{"name": "Acme Federal Solutions", "legal_name": "Acme Federal Solutions LLC", "state": "VA", "city": "Arlington", "employee_count": 85, "website": "https://acmefederal.com", "certifications": ["SDVOSB"], "naics_codes": ["541512", "541519"], "capability_keywords": ["cloud", "AWS", "managed services", "cybersecurity"], "ai_capability": false, "highergov_url": "https://www.highergov.com/awardee/acme-federal-solutions-llc/", "contract_history": [{"agency": "MA EOTSS", "amount": 1200000, "date": "2025-08-15", "description": "Cloud infrastructure modernization"}], "source": "highergov_portal"}
```

**Field notes:**
- `name` -- Prefer the company's legal name from HigherGov for consistency
- `ai_capability` -- Set to `true` if the company has AI/ML as a core offering (this is a red flag for teaming -- they don't need us)
- `contract_history` -- Individual award rows. The importer aggregates these to `agency_wins` format automatically.
- `source` -- Always `"highergov_portal"` for portal-discovered partners

### partner_contacts.jsonl

One JSON object per line. Each object groups contacts for one company:

```json
{"partner_name": "Acme Federal Solutions", "partner_state": "VA", "contacts": [{"name": "Jane Smith", "title": "CEO", "linkedin_url": "https://linkedin.com/in/janesmith", "email": null, "phone": null, "source": "linkedin"}, {"name": "Bob Johnson", "title": "VP Business Development", "linkedin_url": "https://linkedin.com/in/bobjohnson", "email": null, "phone": null, "source": "company_website"}]}
```

**CRITICAL:** `partner_name` must **exactly match** `name` in the partner JSONL. The importer uses `(partner_name, partner_state)` as composite key to link contacts to partners.

---

## Deduplication

The importer handles dedup across import paths:
- Checks both `(name, state)` and `external_id`
- Appending to JSONL across sessions is safe -- duplicates are resolved at import time
- Existing records are updated (not duplicated) when re-imported with new data

---

## Session Summary

At the end of each discovery session, produce this summary:

```
## Partner Discovery Session Summary - [DATE]

### Results
- Companies discovered: N
- By state: MA: X, CT: Y, VA: Z, ...
- By certification: SDVOSB: X, 8(a): Y, HUBZone: Z, ...
- With AI capability (flagged): N

### Top 5 by Estimated Fit
| Rank | Company | State | Certs | Employees | Why |
|------|---------|-------|-------|-----------|-----|
| 1 | ... | ... | ... | ... | ... |

### Contacts Enriched
- Companies with contacts: N
- Total contacts found: N

### Files Written
- `scrapers/data/partner_discovery.jsonl` -- N lines (M new this session)
- `scrapers/data/partner_contacts.jsonl` -- N lines (M new this session)

### Import Command
python scrapers/partner_importer.py --partners scrapers/data/partner_discovery.jsonl --contacts scrapers/data/partner_contacts.jsonl
```

---

## Tips

- **Use headed mode** (`show_browser`) if you need the user to see what you're finding
- **Extract markdown** after each page to capture structured data before navigating away
- **Rate limit yourself** -- don't navigate too fast, HigherGov and LinkedIn may throttle
- **Scroll to load** -- some pages use infinite scroll, use eval to scroll down:
  ```json
  {"action": "eval", "payload": "window.scrollTo(0, document.body.scrollHeight); 'Scrolled'"}
  ```
- **Prefer legal names** from HigherGov for partner_name consistency across files
- **Check auto-capture files** -- every DOM action saves screenshot + markdown + HTML + console output
- **Pause between LinkedIn profiles** -- 10-15 seconds minimum to avoid rate limiting
- **Multiple tabs** -- open company profiles in new tabs to compare without losing search results
