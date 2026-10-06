# DocsScale SEO Operating System V1 — Claude Code + MCP

**Status:** Build now, after v1.0 / v1.1 of the website are live.
**Owner:** Abdul Samad (approver). **Operator:** Claude Code.
**Location in repo:** `docs/seo/SEO-OS-V1.md`

---

## 1. Purpose

Run DocsScale's SEO as a repeatable weekly operating loop, using Claude Code as the interface and plain files in the repo as the memory. No custom dashboard, database, crawler, or scoring engine in V1.

```
OBSERVE → ANALYZE → RECOMMEND → HUMAN APPROVAL → EXECUTE → VERIFY → LEARN
```

V1 succeeds when, every week, we reliably know what changed, what to do next, why, and whether last month's actions worked.

**North star:** the system exists to grow DocsScale's organic visibility, qualified traffic, leads, and eventually revenue. It is only successful if the website improves. Do not spend effort optimizing the system itself when that effort could improve the site.

### Baseline first

The first objective is:

```
MEASURE → ESTABLISH BASELINE → FIND OBVIOUS ISSUES → MAKE A FEW HIGH-CONFIDENCE CHANGES → MEASURE AGAIN
```

Not "measure, then automate everything." Early weekly reports mainly document what DocsScale currently looks like and fix clear problems.

---

## 2. Non-negotiable rules

1. **Never fabricate data.** No invented volumes, rankings, traffic, leads, citations, or competitor facts.
2. **Say "Unknown" or "Insufficient data"** whenever data is missing, too small, or too recent (see §6).
3. **Every recommendation cites its evidence:** data source, date range, actual numbers, affected URL and/or query, reasoning, and uncertainty/caveats.
4. **Never change the production website automatically.**
5. **AI proposes; Abdul approves.** Approval is explicit, per recommendation. Claude Code may research, analyze, write files in `docs/seo/`, create branches, make *approved* code changes, run tests, and prepare deployments. Nothing reaches production without Abdul's explicit approval.
6. **All changes go through Git:** one branch per change or small batch, clear commit messages.
7. **Test before deploy:** lint, type check, unit/interaction tests, visual comparison, build, then staging.
8. **Every change is reversible** using the existing rollback process in `docs/RELEASE.md`.
9. **Verify after deploy** that the intended change is actually live (fetch the page, check tags/content/redirects/sitemap).
10. **Record every recommendation and its outcome** in `docs/seo/`.
11. **No scoring systems** until there's enough real outcome data to calibrate them. Use simple labels (High/Medium/Low) with a written reason.
11a. **Never force a recommendation.** "Insufficient data — no recommendation" is always preferred over a weak recommendation.
11b. **No paid APIs by default.** If a task can't be done reliably with existing data, state exactly what data is missing and what a paid API would provide (with estimated cost) before recommending one.
11c. **Business outcomes, honestly measured.** Track organic leads and conversions where data is reliable. Revenue attribution is future scope; report revenue impact as "Not measurable yet".
12. **No custom database or dashboard** unless we can show a concrete requirement the files-and-Claude-Code workflow can't handle.
13. **"Do nothing" and "don't build this" are valid recommendations** and must be considered every week.
14. **Brand rule:** nothing public may suggest the site or content is AI-generated. All published content is reviewed and approved by a named DocsScale team member.
15. **No infrastructure in V1:** no custom dashboard, database, crawler service, scoring engine, background workers, or scheduler. Abdul runs `/seo-weekly` manually each Monday.

---

## 3. Data sources

| Source | How V1 accesses it | Needed for | Status |
|---|---|---|---|
| Google Search Console | MCP (seo-stack-mcp if its review passes, else mcp-gsc), read-only service account | Queries, clicks, impressions, CTR, positions, indexing | Connect after v1.0 launch |
| Google Analytics 4 | Same MCP, or Google's official analytics-mcp; Viewer access | Organic sessions, landing pages, lead events | GA4 live in v1.1 |
| Bing Webmaster Tools | Same MCP, API key | Bing queries, crawl issues; feeds ChatGPT search | Create account after launch |
| Microsoft Clarity | Same MCP, Data Export token | Rage/dead clicks, scroll depth, UX friction | Create account |
| GitHub | `gh` CLI (already set up) | Branches, PRs, CI status, change history | Done |
| DocsScale codebase | Direct file access | Page inventory, metadata, schema, internal links | Done |
| Hostinger | Hostinger MCP (already connected) + existing deploy script | Deploys, headers, redirects, SSL | Done |
| Playwright (existing) | Local scripts | Crawl-style checks, verification after deploy | Done |
| DataForSEO | **Not in V1.** Add only when a specific recommendation is blocked by missing competitor/SERP/volume data, with cost estimate and approval first | Competitor SERPs, keyword volumes | Deferred |
| n8n | **Not in V1.** Add only if a manual step is repeated weekly and wastes real time | Scheduling, notifications | Deferred |
| Google Keyword Planner | Abdul exports CSVs manually when needed → `docs/seo/keywords/` | Search volume ranges | As needed |

All credentials live in `~/DocsScale-Secure/`, never in the repo. All data access is read-only.

---

## 4. Knowledge base (the system's memory)

```
docs/seo/
  SEO-OS-V1.md                 ← this plan
  BASELINE.md                  ← snapshot at launch (pages, metrics, known issues)
  weekly/
    2026-10-05.md              ← one report per week
  recommendations/
    INDEX.md                   ← table of all recommendations + current status
    REC-0001-houston-page.md   ← one file per recommendation
  outcomes/
    2026-Q4.md                 ← measured results, grouped by quarter
  experiments/
    EXP-0001-hero-cta.md       ← only when we deliberately test something
  content/
    briefs/                    ← approved content briefs
    calendar.md                ← planned posts with status
  competitors/
    registry.md                ← named competitors + notes (observed facts only)
  keywords/
    keyword-map.md             ← one primary keyword per page, no overlaps
    exports/                   ← raw Keyword Planner / GSC exports
  learnings.md                 ← what worked, what didn't, what not to repeat
```

### Recommendation lifecycle

Each `REC-xxxx` file has a status field that moves through:

```
DETECTED → ANALYZED → RECOMMENDED → APPROVED | REJECTED | DEFERRED
        → IMPLEMENTED → VERIFIED → OUTCOME MEASURED
```

`INDEX.md` lists every recommendation with its current status, so the weekly review can pick up anything waiting on approval, implementation, verification, or measurement.

### Recommendation file template

```markdown
---
id: REC-0001
title: Create a Houston local page
type: new-page | improve-page | technical | internal-links | content | cro | do-nothing
status: RECOMMENDED
detected: 2026-10-05
approved: 
implemented: 
verified: 
outcome_check_due:           # implemented date + 28 days (GSC needs time)
---

## Evidence
- Data source(s):
- Date range:
- Actual numbers:
- Affected URL(s) / query(ies):
- Reasoning:
- Uncertainty / caveats:
- Link to the weekly report:

## Recommendation
What to do, on which page(s), in one paragraph.

## Expected impact
What should move (impressions, clicks, leads) and a realistic range, or "Unknown".

## Effort
Small (<2h) | Medium (half day) | Large (1+ day), with reason.

## Risk
What could go wrong and how we'd reverse it.

## Alternatives considered
Including "do nothing".

## Implementation
Branch, commit(s), PR, deploy date.

## Verification
What was checked after deploy, and the result.

## Outcome
Before vs after numbers (same-length periods), conclusion: worked / no effect / hurt / too early.
```

---

## 5. Claude Code commands

Implement as project-level Claude Code commands or skills in `.claude/`, checked into the repo so any team member's Claude Code can run them. Each command reads this plan's rules first.

### Core commands (build in V1)

| Command | What it does | Output |
|---|---|---|
| `/seo-weekly` | The main weekly review (§7). Pulls last 7 and last 28 days vs previous periods from GSC, GA4, Bing, Clarity; runs `/seo-audit` checks; reviews open recommendations; proposes the top 3–5 actions. | `docs/seo/weekly/YYYY-MM-DD.md` + new `REC` files + updated `INDEX.md` |
| `/seo-audit` | Technical check of the live site: status codes, redirects, titles/meta, canonicals, noindex conflicts, sitemap vs live pages, schema validity, broken internal/external links, orphan pages, headers, Core Web Vitals via Lighthouse. Covers what was listed as `/seo-technical`. | Findings section (in weekly report, or standalone file) |
| `/seo-opportunities` | Finds pages to build, pages to improve or refresh, and internal-link opportunities from GSC queries (positions 3–20, high impressions/low CTR, queries with no dedicated page), the keyword map, and the site's content. Covers what was listed as `/seo-refresh`. | `REC` files for anything worth doing, and explicit "not worth it" notes |
| `/seo-content <topic or REC id>` | Produces a content brief (intent, audience, primary/secondary keywords, outline, internal links, CTA, sources, FAQ), then, only after brief approval, a draft for human editing. Never publishes. | `docs/seo/content/briefs/...` and a draft on a branch |
| `/seo-review` | Outcome check: for every recommendation past its `outcome_check_due` date, compares before/after data and records the outcome. Updates `learnings.md`. | `docs/seo/outcomes/...`, updated `REC` files |

### Later commands (add when data justifies them)

| Command | Add when |
|---|---|
| `/seo-competitors` | We've named 3–5 real competitors and have a specific question the free data can't answer. Uses public pages only unless DataForSEO is approved. |
| `/seo-performance` | Weekly reports get long enough that a quick "just the numbers" command saves time. |

### Approval and execution flow (all commands)

1. Command writes recommendations with status `RECOMMENDED`.
2. Abdul replies with approvals, e.g. "Approve REC-0003 and REC-0005, reject REC-0004 (reason)."
3. Claude Code implements each approved item on a branch, runs all checks, deploys to staging, sends before/after for anything visible.
4. Abdul approves the staging result.
5. Claude Code deploys via the existing gated release process, verifies on production, updates the `REC` file to `VERIFIED`, and sets `outcome_check_due`.

---

## 6. Data sufficiency rules

Simple thresholds, not a scoring model. These are **safeguards and starting defaults, not permanent SEO laws.** If a rule isn't met, the report says "Insufficient data" instead of drawing a conclusion, and explicitly names which threshold blocked the conclusion (e.g. "Query X had 42 impressions; below the 100-impression trend threshold").

- **GSC data lag:** ignore the most recent 3 days; they're incomplete.
- **Compare equal periods:** last 28 days vs previous 28 days for trends. Weekly (7-day) numbers are shown but flagged as noisy.
- **Minimum volume for a trend claim:** at least 100 impressions for a query or page in both periods. Below that, report numbers without calling it a trend.
- **Minimum wait for outcomes:** 28 days after deploy before measuring a recommendation's effect (60+ days for new pages).
- **Rankings:** GSC "position" is an average across searches; always describe it that way, never as a fixed rank.
- **Search volume:** only from Keyword Planner exports, Bing data, or approved paid tools. Otherwise "Unknown".
- **Correlation, not proof:** outcome notes say "after the change" not "because of the change" unless other factors are ruled out.

These thresholds are starting points. Adjust them in this file once real DocsScale data shows they're too strict or too loose, and record each change and its reason in `learnings.md`.

### "Unknown / Not measurable yet" is a first-class state

Missing data is reported plainly, never treated as an error or filled in. Standard labels:

| Label | Meaning | Example |
|---|---|---|
| Unknown | Data exists somewhere but we don't have access | Search volume: Unknown |
| Not measured | We haven't set up measurement for this | AI citation visibility: Not measured |
| Not measurable yet | Measurement is set up but there isn't enough data or time | Revenue impact: Not measurable yet |
| Not assessed | Deliberately out of scope this week | Competitor ranking comparison: Not assessed |
| Insufficient data | Data exists but is below a §6 threshold | Trend for /about/: Insufficient data (38 impressions) |

---

## 7. Weekly review (`/seo-weekly`) report structure

```markdown
# SEO weekly review — YYYY-MM-DD
Data window: [dates] · Sources available: GSC ✓ GA4 ✓ Bing ✗ Clarity ✓

## 1. Summary (5 lines max)
## 2. What changed vs last week and last 28 days
   Organic sessions, GSC clicks / impressions / CTR / average position,
   leads and booked calls from organic (GA4 events), with source + numbers.
## 3. Low-hanging fruit (queries in positions 3–20)
## 4. Declining pages and queries (with likely causes, or "cause unknown")
## 5. Technical issues (from /seo-audit), new vs already known
## 6. Content opportunities
   Pages to build · pages to improve · internal-link opportunities
## 7. Competitor / content gaps (only where data supports it, else "Not assessed")
## 8. Recommended actions (top 3–5)
   Each: REC id, evidence, expected impact, effort, risk
## 9. Things we should NOT do this week (and why)
## 10. Status of previous recommendations
   Awaiting approval · in progress · verified · outcomes measured
## 11. Unknown / Not measurable yet
   Every metric we can't report, with its label and what would unlock it.
## 12. Data gaps and caveats
```

Rules for the recommendation list: a maximum of 5 items, ranked by (business impact × confidence) ÷ effort, explained in words. "Do nothing this week" and "Insufficient data — no recommendation" are acceptable lists. During the baseline period, favour a few high-confidence fixes over broad optimization.

---

## 8. What needs what: A / B / C / D

| Category | Items |
|---|---|
| **A. Claude Code + MCP, immediately** | Weekly review, technical audit (with existing Playwright/Lighthouse tooling), GSC/GA4/Bing/Clarity analysis, opportunity finding, keyword map, content briefs and drafts, internal-link suggestions, schema/meta fixes, recommendation tracking in files, outcome reviews, post-deploy verification |
| **B. Small custom script** | A site-wide link and metadata checker if Playwright output gets unwieldy; a script that snapshots key metrics to `docs/seo/metrics/` each week so history survives if an API's retention is limited; a helper that regenerates `recommendations/INDEX.md` from the REC files |
| **C. Paid API (only on a specific, approved need)** | Competitor SERP positions, precise keyword volumes at scale, backlink data, AI-answer citation tracking at scale (DataForSEO or similar). Each use needs a cost estimate and approval |
| **D. Future platform only** | Custom dashboard, custom crawler service, database, opportunity scoring engine, knowledge graph, automated daily command center, automated internal linking, auto-execution of any action type, multi-site/client management, revenue attribution modelling |

---

## 9. Implementation order

0. **Repository audit first:** inspect the existing repo and the live v1.0/v1.1 implementation, and report exactly what already exists (tracking, tests, Lighthouse/Playwright tooling, sitemap, schema, docs) before implementing anything. Do not duplicate existing functionality.
1. **Finish the website:** v1.0 live, v1.1 (GA4, consent banner, contrast, Click-to-Chair rename, placeholder cleanup) live.
2. **Make tracking reliable:** verify in GA4 real-time that page views and lead events fire after consent; confirm the lead event matches GoHighLevel entries for one test lead.
3. **Connect data sources:** Search Console (verify property, submit sitemap), Bing (import from Search Console, submit sitemap), Clarity, then the MCP server after its code review (see HANDOVER.md).
4. **Create the knowledge base** folders and `BASELINE.md`: current pages, metadata, schema, Lighthouse scores, known issues, and whatever GSC/GA4 data exists.
5. **Preview, then build the 5 core commands.** For each command, first show Abdul: files it will create/change, data sources it will access, what it will do, what it will NOT do, and an example output. Implement only after approval, then test each once. `/seo-weekly` early runs will mostly say "Insufficient data"; that's expected and correct.
6. **Start the weekly routine:** Abdul runs `/seo-weekly` every Monday, reviews, approves or rejects.
7. **Accumulate data and outcomes:** from ~week 6 onward, `/seo-review` starts measuring outcomes.
8. **Monthly retrospective** (first Monday of the month): update `learnings.md`, adjust §6 thresholds, prune commands nobody uses.
9. **Quarterly graduation check** (§10): decide whether any part of the future platform is justified yet.

Build effort for steps 3–5: roughly 2–4 working days of Claude Code time, plus Abdul's account setup.

---

## 10. Graduation criteria (V1 → future platform)

Review quarterly. Consider building a specific platform component only when it's tied to at least one criterion below being met. Numbers are starting points, not rules.

| Trigger | Starting threshold |
|---|---|
| Enough search history | 6+ months of GSC data |
| Meaningful organic traffic | 1,000+ organic clicks per month |
| Enough content to manage | 50+ indexable pages or 30+ blog posts |
| Enough outcomes to learn from | 50+ recommendations with measured outcomes |
| Multiple sites | 3+ client websites we manage SEO for |
| Manual workflow is the bottleneck | The weekly routine takes 4+ hours of human time, or the same manual step repeats every week |
| Proven ROI | Organic leads are measurable and automation would clearly pay for itself |
| Multi-site need | Clients want reporting or management we can't deliver with files and commands |

Graduation is incremental: build the single component that removes the bottleneck, not the whole platform.

---

## Long-Term Vision — DocsScale Autonomous Search Growth OS

> **FUTURE / NOT FOR CURRENT DEVELOPMENT.** Nothing in this section is to be built until the graduation criteria in §10 justify a specific component.

The long-term vision is a Search Growth Operating System: a continuous loop that observes websites and the search ecosystem, turns evidence into prioritized opportunities, executes approved changes safely, verifies them, and learns from outcomes, with a visual command center on top.

Potential components, as described in the original Developer POA v3:

- Custom admin dashboard and daily command center
- First-party crawler and deterministic technical-issue engine
- Opportunity engine and page opportunity engine
- Content intelligence: lifecycle, decay detection, cannibalization detection
- AI Search / AEO monitoring and citation tracking
- Knowledge/topic graph
- Competitor intelligence and change tracking
- CRO intelligence and experiment management
- Revenue attribution (search → lead → customer)
- Automated internal linking
- Typed fix queue with GitHub/Next.js execution and deployment verification
- Learning engine that calibrates prioritization from outcomes
- Multi-site / client management
- Per-action auto-execution controls with rollback

The strongest long-term case for this platform is as a **service for DocsScale's clinic clients**, managing SEO across many sites, rather than as an internal tool for one site.

Principles carried over from V1 unchanged: never fabricate numbers, evidence for every recommendation, human approval for production changes, reversible changes, verification after execution, the ability to recommend "do nothing" or "don't build this", and learning from real outcomes.

The original Developer POA v3 is kept as the reference specification for this vision.
