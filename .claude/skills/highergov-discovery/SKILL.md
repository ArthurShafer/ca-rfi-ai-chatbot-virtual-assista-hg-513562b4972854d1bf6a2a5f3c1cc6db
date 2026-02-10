---
name: highergov-discovery
description: Browse HigherGov.com portal to discover missed opportunities, analyze competitors, find teaming partners, and tune API search parameters. Uses browser automation to explore the paid platform and feed intelligence back into the scraper pipeline.
allowed-tools: mcp__chrome__use_browser, Bash, Read, Write, Edit, Grep, Glob, WebFetch
---

# HigherGov Portal Discovery

## Overview

Systematically explore HigherGov.com's paid portal ($500/yr Starter plan) to:
1. Find opportunities the API scraper misses
2. Analyze competitors winning IT contracts in New England
3. Identify teaming partners
4. Discover pre-RFP/forecast opportunities for early positioning
5. Tune saved searches and API parameters based on what you find

**Announce:** "I'm using the HigherGov discovery skill to explore the portal."

## Account Details

- **Plan**: Starter ($500/yr) - 1 user, 10K API records/month, 1K export/search
- **Login**: HigherGov.com (credentials in browser profile or user-provided)
- **API Key**: `HIGHERGOV_API_KEY` env var
- **Saved Search**: `wajMLYMpD00E96u1IDXy_` (IT/software/AI keywords)

## What the $500/yr Starter Plan Includes

Everything below is available on the current plan:

| Feature | Description | Value for Us |
|---------|-------------|--------------|
| SLED Opportunities | 1M+ state/local/education solicitations | PRIMARY - our bread and butter |
| Pre-RFP Forecasts | 20K+ upcoming opportunities before formal solicitation | CRITICAL - 3-6 month advance notice |
| Federal Opportunities | 4M+ federal contracts | MODERATE - federal IT in NE region |
| Award History | 61M+ prime contracts, 800K+ subcontracts | COMPETITOR INTEL - who's winning |
| Awardee Profiles | 1.5M+ vendor profiles with revenue, contracts, relationships | TEAMING - find partners |
| People Database | 130K+ government contacts | RELATIONSHIP - find contracting officers |
| Document Access | 3M+ RFP/RFI documents with 60-min download URLs | ANALYSIS - read actual solicitations |
| Labor Pricing | 450K+ prices for 25K+ job titles | PRICING - competitive rate analysis |
| AI Insights | Auto-estimated values, NAICS classification, competitor matching | INTELLIGENCE |
| Real-Time Alerts | Instant email on new opportunity matches | FREE MONITORING - no API cost |
| Pursuit Pipeline | Built-in CRM with p(win), competitors, tasks | TRACKING |
| Export | 1,000 records per search | BULK ANALYSIS |

## Discovery Workflow

### Phase 1: Login & Orient

```
1. Navigate to https://www.highergov.com/login/
2. Enter credentials (or use existing session from browser profile)
3. Navigate to saved searches to review current configuration
4. Navigate to dashboard for account overview
```

**Browser actions:**
```json
{"action": "navigate", "payload": "https://www.highergov.com/login/"}
{"action": "await_element", "selector": "input[name=email], input[type=email], #email"}
{"action": "type", "selector": "input[name=email]", "payload": "<email>"}
{"action": "type", "selector": "input[name=password], input[type=password]", "payload": "<password>\n"}
{"action": "await_text", "payload": "Dashboard", "timeout": 10000}
```

### Phase 2: SLED Opportunity Discovery (Primary Mission)

Search for IT opportunities in New England that the API might miss.

**Strategy**: Run multiple targeted searches beyond what the saved search covers.

#### 2a. Browse Current Saved Search Results
```json
{"action": "navigate", "payload": "https://www.highergov.com/contract-opportunity/?searchID=wajMLYMpD00E96u1IDXy_"}
{"action": "await_element", "selector": ".search-results, table, .opportunity-list"}
{"action": "extract", "payload": "markdown"}
```

Compare visible results against what's in our database. Note any gaps.

#### 2b. State-Specific Searches
Run targeted searches for each New England state:

**URL patterns:**
- `https://www.highergov.com/contract-opportunity/?state=MA`
- `https://www.highergov.com/contract-opportunity/?state=CT`
- `https://www.highergov.com/contract-opportunity/?state=RI`
- `https://www.highergov.com/contract-opportunity/?state=VT`
- `https://www.highergov.com/contract-opportunity/?state=NH`
- `https://www.highergov.com/contract-opportunity/?state=ME`

For each state, add IT-related keyword filters and note opportunities our scraper missed.

#### 2c. Agency-Specific Deep Dives
Target agencies known to issue IT contracts:
- Massachusetts: EOTSS, MassIT, MassTech, COMMBUYS
- Connecticut: DAS/BEST, CT OPM, CT DoIT
- Rhode Island: DoIT, Division of Purchases
- Vermont: ADS (Agency of Digital Services)
- New Hampshire: DoIT
- Maine: OIT (Office of Information Technology)

```json
{"action": "navigate", "payload": "https://www.highergov.com/contract-opportunity/"}
{"action": "await_element", "selector": "input[name=keyword], .search-input, #keyword"}
{"action": "type", "selector": "input[name=keyword]", "payload": "Massachusetts EOTSS\n"}
{"action": "await_element", "selector": ".search-results"}
{"action": "extract", "payload": "markdown"}
```

#### 2d. Keyword Gap Analysis
Try keywords our saved search might not cover:

**High-value keywords to test:**
- `"digital transformation" state government`
- `cybersecurity assessment state`
- `data analytics government`
- `cloud migration state`
- `IT modernization`
- `artificial intelligence government`
- `machine learning public sector`
- `software development services`
- `website redesign government`
- `mobile application development`
- `GIS mapping services`
- `ERP system implementation`
- `help desk services government`
- `network infrastructure upgrade`
- `disaster recovery planning`
- `accessibility compliance WCAG`
- `API integration services`
- `database management services`

For each keyword, compare results to our DB. If we're missing things, note the keyword for the saved search.

### Phase 3: Pre-RFP / Forecast Discovery (Early Warning)

This is one of the highest-value features. Find opportunities BEFORE the formal solicitation.

```json
{"action": "navigate", "payload": "https://www.highergov.com/contract-forecast/"}
{"action": "await_element", "selector": ".search-results, table"}
```

**Filter for:**
- NAICS codes: 541511, 541512, 541519, 541611
- States: MA, CT, RI, VT, NH, ME
- Keywords: software, IT, cloud, AI, digital

**What to capture:**
- Opportunity title and description
- Expected solicitation date
- Current incumbent (if listed)
- Estimated value
- Agency and contact info
- Our window for positioning (pre-solicitation engagement timeline)

### Phase 4: Competitor Intelligence

#### 4a. Who's Winning IT Contracts in New England?

```json
{"action": "navigate", "payload": "https://www.highergov.com/awardee/"}
{"action": "await_element", "selector": ".search-input, input"}
```

**Search for awards by:**
- NAICS 541511/541512/541519 + State = MA/CT/RI/VT/NH/ME
- Filter by recent awards (last 2 years)
- Sort by value

**Capture for each competitor:**
- Company name and size
- Total awards in our target area
- Which agencies they serve
- What types of contracts they win
- Whether they could be a teaming partner vs. competitor

#### 4b. Incumbent Analysis for Upcoming Recompetes

```json
{"action": "navigate", "payload": "https://www.highergov.com/contract/"}
```

**Filter for:**
- Expiring IT contracts in New England (next 12 months)
- Potential recompetes
- Look for "vulnerable incumbents" (SBA graduation, contract issues)

### Phase 5: Teaming Partner Discovery

```json
{"action": "navigate", "payload": "https://www.highergov.com/awardee/"}
```

**Search criteria for ideal partners:**
- Small businesses with MA/CT state contract history
- NAICS 541511/541512 (they code, we bring AI)
- OR: Large companies needing AI/ML subcontractors
- Companies with 8(a), HUBZone, SDVOSB status (set-aside access)
- Companies already on state Master Service Agreements

**For each potential partner, capture:**
- Company name, size, certifications
- Contract history (agencies, values, types)
- Existing relationships with NE state agencies
- Complementary vs. overlapping capabilities
- Contact information

### Phase 6: Labor Pricing Intelligence

```json
{"action": "navigate", "payload": "https://www.highergov.com/labor-pricing/"}
```

**Check rates for our key roles:**
- Software Developer / Engineer
- AI/ML Engineer
- Cloud Architect (AWS)
- Solutions Architect
- Project Manager
- DevOps Engineer
- Data Scientist
- Full Stack Developer

Compare against our planned rates for proposals.

### Phase 7: People / Contracting Officer Discovery

```json
{"action": "navigate", "payload": "https://www.highergov.com/people/"}
```

**Search for:**
- IT procurement officers at NE state agencies
- Contracting officers who post IT solicitations
- Set up alerts on key people (free, no API cost)

### Phase 8: Document Analysis

For high-scoring opportunities, download and analyze the actual solicitation documents:

```json
{"action": "navigate", "payload": "https://www.highergov.com/contract-opportunity/<opp-key>/"}
{"action": "await_element", "selector": ".documents, .attachments, a[href*=document]"}
{"action": "extract", "payload": "markdown", "selector": ".documents"}
```

Download URLs expire after 60 minutes. Save documents locally for deeper analysis.

## Output: Intelligence Report

After each discovery session, produce a structured report:

```markdown
# HigherGov Discovery Report - [DATE]

## Missed Opportunities
| Title | State | Agency | Why Missed | Action |
|-------|-------|--------|------------|--------|
| ... | ... | ... | Missing NAICS / keyword gap / etc. | Add NAICS code / Update saved search |

## Pre-RFP / Forecast Opportunities
| Title | State | Agency | Expected Date | Incumbent | Our Angle |
|-------|-------|--------|---------------|-----------|-----------|

## Competitor Map
| Company | Size | NE Awards | Key Agencies | Threat Level |
|---------|------|-----------|--------------|--------------|

## Potential Teaming Partners
| Company | Certifications | NE Agencies | Complementary Skills | Next Step |
|---------|---------------|-------------|---------------------|-----------|

## Saved Search Improvements
- Keywords to add: [...]
- Keywords to remove: [...]
- NAICS codes to add: [...]
- New saved searches to create: [...]

## API Optimization Recommendations
- [Specific changes to highergov_scraper.py]
- [New endpoints to integrate]
- [Budget allocation changes]
```

## Feeding Intelligence Back to Scraper

After discovery, update the scraper configuration:

### Add New NAICS Codes
Edit: `phase-1-opportunity-dashboard/scrapers/highergov_scraper.py`
Add discovered NAICS codes to `IT_NAICS_CODES` list.

### Create Additional Saved Searches
On HigherGov portal:
1. Create state-filtered search (NE states only) → get search_id
2. Create pre-RFP search → get search_id
3. Update scraper to query multiple search_ids

### Add Pre-RFP Endpoint to Scraper
The pre-RFP/forecast endpoint (`/api-external/contract-forecast/`) is not currently used.
Adding it would give 3-6 month advance notice of upcoming IT solicitations.

### Set Up Free Email Alerts
On HigherGov portal:
1. Create Real-Time alerts for each saved search
2. This catches opportunities between daily scraper runs at zero API cost

## API Endpoints Available (Not All Currently Used)

| Endpoint | Path | Records | Currently Used |
|----------|------|---------|----------------|
| SLED Opportunities | `/opportunity/` | 1M+ | YES |
| Pre-RFP Forecasts | `/contract-forecast/` | 20K+ | NO - HIGH VALUE |
| Federal Opportunities | `/opportunity/` (source_type=federal) | 4M+ | NO |
| Contract Awards | `/contract/` | 61M+ | NO |
| Subcontract Awards | `/subcontract/` | 800K+ | NO |
| Awardees | `/awardee/` | 1.5M+ | NO |
| Documents | `/document/` | 3M+ | Partially |
| People | `/people/` | 130K+ | NO |
| Agencies | `/agency/` | 3K+ | NO |
| Pursuits | `/pursuit/` | User-specific | NO |

## Advanced Search Syntax

HigherGov supports rich keyword syntax in saved searches:

- **AND**: `software AND development` (both required)
- **OR**: `software OR application` (either matches)
- **NOT**: `software NOT construction` (exclude)
- **Phrases**: `"machine learning"` (exact phrase)
- **Grouping**: `(software OR application) AND (development OR engineering)`
- **Wildcards**: `cyber*` matches cybersecurity, cyberdefense, etc.

Use this to create precise saved searches that reduce noise.

## Quick Filters (Portal UI)

Available toggle filters that refine results:
- **Active Opportunity** - only current/open
- **Exclude No Bid** - remove no-bid opportunities
- **Recompetes** - contracts being re-solicited
- **Vulnerable Incumbents** - incumbents at risk (SBA graduation, etc.)

## Session Workflow Checklist

Before starting a discovery session:
- [ ] Load current DB state (count by state, recent additions)
- [ ] Review filtered_out.jsonl for false negatives
- [ ] Note any specific opportunities user mentioned finding manually

During session:
- [ ] Phase 1: Login & orient
- [ ] Phase 2: SLED opportunity sweep (all 6 NE states)
- [ ] Phase 3: Pre-RFP forecasts
- [ ] Phase 4: Competitor mapping
- [ ] Phase 5: Teaming partner search
- [ ] Phase 6: Labor pricing check
- [ ] Phase 7: Key people identification
- [ ] Phase 8: Document downloads for top opportunities

After session:
- [ ] Generate intelligence report
- [ ] Update scraper configuration (NAICS, keywords, saved searches)
- [ ] Create/update email alerts on portal
- [ ] Insert any manually-found opportunities into DB
- [ ] Update MEMORY.md with findings

## Tips

- **Use headed mode** (`show_browser`) if you need the user to see what you're finding
- **Extract markdown** after each page to capture structured data
- **Screenshot** charts and visualizations for the intelligence report
- **Rate limit yourself** - don't navigate too fast, HigherGov may throttle
- **Check the console** for JavaScript errors that might indicate content loading issues
- **Scroll to load** - some pages use infinite scroll, use eval to scroll down
- **Multiple tabs** - open opportunities in new tabs to compare without losing search results
