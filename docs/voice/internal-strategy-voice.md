# Internal Strategy Voice Guide

## Purpose

This guide defines voice, structure, and quality standards for **Internal Strategy** content — documents written by and for people inside the same organization. Use this for solution plans, strategy proposals, CX plans, technical proposals, sequencing arguments, and any document that needs to drive internal decisions.

**Position in Taxonomy**: Internal Strategy sits adjacent to Executive Advisory but differs in perspective. Executive Advisory writes *to* a client. Internal Strategy writes *as* the team, *for* leadership and cross-functional stakeholders. There is no consultant framing.

---

## Core Principles

### 1. Scannable First, Readable Second

A VP should find the risks in 5 seconds, the ask in 10, and the key numbers in the first table. Structure carries meaning — don't make readers parse prose to find facts.

```markdown
❌ "The billing team tracked 2,305 cases from January 2025 through February 2026,
   of which 91% were deflectable, with 59% being invoice inquiries, and the median
   resolution time was approximately 98 hours compared to under one hour for
   non-billing cases."

✅ **Source:** [Support Lead], Jan 2025 – Feb 2026, 2,305 cases.
   - **91%** of email cases deflectable
   - **59%** are invoice inquiries — single largest category
   - **98x resolution gap:** billing ~4 days vs. non-billing <1 hour
```

### 2. Short Context, Then Structure

Use 1-3 sentence paragraphs to explain *why* something matters, then bullets or tables for *what* the facts are. Never bury a list of items in a prose paragraph.

```markdown
❌ "The Pricing and Packaging initiative introduces plan rebranding where Standard
   becomes Core and Plus becomes Growth and Pro becomes Scale along with a new
   Performance tier, as well as GMV cap reductions where Core drops from fifty
   thousand to thirty thousand and Growth drops from one hundred eighty thousand
   to one hundred thousand..."

✅ Six simultaneous changes, all leadership-approved (2/17-18/2026):
   - **Plan rebranding:** Standard → Core, Plus → Growth, Pro → Scale, new Performance
   - **GMV cap reductions:** Core $50k → $30k (-40%), Growth $180k → $100k (-44%)
   - **Third-party transaction fees:** 2.0% / 1.0% / 0.6% / 0.2% by tier
```

### 3. We, Not You

This is internal. Use "we," "our," "the team." Reference people and systems by name. No consultant distance.

```markdown
❌ "Your organization should consider implementing a self-service invoice portal."
❌ "I recommend the client prioritize billing triage."

✅ "The invoice portal must ship by June 1. [Product Lead] owns the scope decision."
✅ "The support team needs to instrument case categorization before launch."
```

### 4. Options with Rationale and Rejection

When presenting choices, name each option, state the benefit, the trade-off, and the risk. If an option was rejected, say why in one sentence.

```markdown
### Option A: Surcharges first, self-service follows (Q3-Q4)
- **The risk:** 400-1,000+ monthly cases at 4-day resolution
- **The impact:** Billing team overwhelmed for 3-6 months

### Option B: Self-service first, surcharges follow 30-60 days later
- **The benefit:** Merchants see invoices before new charges appear
- **The trade-off:** Delays surcharge revenue by 30-60 days

### Option C: Simultaneous launch (June 1) — Recommended
- **The benefit:** Merchants get charges AND tools on the same day
- **The risk:** Any self-service delay cascades into Option A
```

### 5. Tables for Structured Data

Risks, open questions, next steps, staffing, comparisons, metrics — all tables. Every table earns its place. No table should duplicate what's already in prose.

```markdown
| # | Question | Blocks | Owner | Deadline |
|---|----------|--------|-------|----------|
| 1 | C.UI repo access | All CX prototyping | [Engineering Lead] | **Immediate** |
| 2 | Invoice portal scope for June 1 | Phase 1 CX | [Product Lead] | Mar 25 |
```

---

## Voice Calibration

### What Internal Strategy IS

| Characteristic | Example |
|----------------|---------|
| **Direct** | "This must ship by June 1." |
| **Factual** | "2,305 cases tracked. 91% deflectable." |
| **Named accountability** | "[VP Operations] owns the staffing decision." |
| **Trade-off explicit** | "The trade-off: delays revenue by 30-60 days." |
| **Assertive on blockers** | "Blocker: C.UI repo access. Every day compresses the window." |

### What Internal Strategy IS NOT

| Avoid | Why |
|-------|-----|
| Narrative arcs (Tension → Pattern → Framework) | This is a report, not a blog post |
| "Here's where I've landed — for now" | Provisional hedging wastes leadership's time |
| "I used to think X, now I think Y" | Self-reflection is for thought pieces, not proposals |
| Dense prose with buried facts | Not scannable — readers miss key data |
| Metadata headers (Type: POV / Mode: advisory) | Frontmatter for systems, not for readers |
| Consultant framing ("your organization") | We're internal — use "we" and "our" |
| Rhetorical questions | State the point directly |

---

## Document Structure

### Solution Plan / Strategy Proposal

```markdown
# [Title]

One-line subtitle: what this document does

## Overview
2-3 sentences. What the doc covers, what decision it supports.

## The Problem
1-2 paragraphs + key data table. Establish what's broken and why it matters now.

## What's Changing
Bullet list of changes. Dates, numbers, specifics.

## [Options / Approach / Architecture]
Numbered options with benefit/trade-off/risk, or scope breakdown.

## What Must Ship
Numbered priorities with:
- Scope bullets
- **Blocker:** if applicable
- **Status:** if work is in progress

## System Impact
Table: System | Changes Required

## Risks
Table: ID | Risk | Impact | Mitigation | Owner

## Open Questions
Table: # | Question | Blocks | Owner | Deadline

## Next Steps
Table: Action | Owner | Deadline

## Success Metrics
Table: Metric | Current | Target
```

### Technical Proposal / Solution Plan (Deeper)

Follow this pattern:
- **The Delivery Problem** — narrative context (2-3 paragraphs max)
- **Who Touches the System** — actors and their needs
- **Scope** — in scope, out of scope, permanently out of scope (with reasons)
- **Architecture Decisions** — each as: Context → Decision → Rationale → Trade-off → Alternatives rejected
- **Staffing** — table with Role | Allocation | Responsibilities
- **Timeline and Gates** — phases with deliverables and go/no-go criteria
- **Deliverables** — table with Deliverable | Owner | Delivery date
- **Risks** — table with ID | Risk | Severity | Likelihood | Mitigation
- **Open Questions** — table with # | Question | Blocks | Owner | Deadline

---

## Quality Checklist

### Structure
- [ ] Title + one-line subtitle — purpose obvious in 3 seconds
- [ ] Overview section (2-3 sentences) before any detail
- [ ] Facts in bullets or tables, not buried in prose
- [ ] Every table earns its place (not redundant with text)
- [ ] Open questions have owner + deadline
- [ ] Next steps have owner + deadline

### Voice
- [ ] "We" / "our" / named people — no consultant framing
- [ ] No narrative arc or storytelling structure
- [ ] No provisional hedging ("here's where I've landed")
- [ ] No metadata fluff (Type/Mode/Status headers)
- [ ] Assertive on blockers and decisions

### Content
- [ ] Key numbers in first table or first section
- [ ] Options presented with benefit + trade-off + risk
- [ ] Rejected alternatives include one-sentence rationale
- [ ] Risks have owners assigned
- [ ] Blockers called out with bold labels

### Scannability
- [ ] VP can find risks in 5 seconds
- [ ] VP can find the ask in 10 seconds
- [ ] Bold labels on key callouts (Blocker:, Status:, The risk:)
- [ ] No paragraph longer than 4-5 sentences

---

## Comparison: Internal Strategy vs Other Modes

| Aspect | Thought Leadership | Executive Advisory | Internal Strategy | Solution Architecture |
|--------|-------------------|-------------------|-------------------|----------------------|
| **Perspective** | Author's POV | Consultant → client | Team → leadership | Engineer → engineers |
| **Opening** | Earned opening; controlling point early | Problem + recommendation | Overview + problem | Executive summary |
| **Voice** | Exploratory, provisional | Confident, directive | Direct, factual | Precise, definitive |
| **Pronouns** | "I" | "I recommend" / "you" | "We" / "our" | Passive / system names |
| **Structure** | Narrative arc | Scannable sections | Short prose + tables | Formal templates |
| **Detail** | Conceptual | Strategic | Strategic + operational | Technical |
| **Hedging** | Encouraged | Minimal | None | None |
| **Best for** | Blog posts, POVs, articles | Client decks, briefings | Plans, proposals, reports | ADRs, design docs |

---

## Reference Examples

Reference implementations can be found in local `projects/` directories (gitignored). Internal strategy content typically takes two forms:
- **Deep technical proposals** — solution plans with options analysis, data tables, and risk matrices
- **Lighter strategy proposals** — CX strategies, roadmaps with clear recommendations and next steps

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-13 | Initial guide based on internal deliverable iterations and solution plan patterns |
