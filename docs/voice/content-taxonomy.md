# Signal Forge Content Taxonomy

## Purpose

This document defines the three content modes Signal Forge supports, ensuring the right voice, structure, and workflow is applied to each content type. The fundamental insight: **blog voice principles optimized for thought leadership are counterproductive for technical architecture documentation**.

---

## The Three Content Modes

| Mode | Purpose | Voice | Structure | Primary Audience |
|------|---------|-------|-----------|------------------|
| **Thought Leadership** | Establish expertise, share insights, provoke thinking | Narrative, self-interrogating, defect-led (guide v1.3) | Investigation arc: defect → re-derivation → adverse evidence → compressed close | Broad professional audience |
| **Solution Architecture** | Document technical decisions, enable implementation | Precise, confident, reference-grade | arc42/C4, ADRs, diagrams | Technical teams, architects |
| **Executive Advisory** | Recommend strategy, align stakeholders | Consultant voice, pattern-based | SCR, Before-After-Breakthrough | Executives, decision-makers |
| **Internal Strategy** | Drive internal decisions, align teams | Direct, factual, "we/our" | Short prose + tables + bullets | Leadership, cross-functional teams |

---

## Mode 1: Thought Leadership

### When to Use
- Blog posts and articles
- Conference presentations and keynotes
- Opinion pieces and POVs (when exploring ideas)
- Podcast scripts and speaking notes
- Personal brand content

### Voice Characteristics
Reference: `docs/voice/thought-leadership-voice.md` (pointer to the canonical Signal Dispatch guide, v1.3)

| Principle | Application |
|-----------|-------------|
| Open with the defect in hand | The concrete broken/missing/wrong thing, with scale, in sentence one or two (questions legal but dormant) |
| Show the work | A mechanical re-derivation beat: go read the primary source, report the counts |
| Adverse evidence | A dedicated section that weakens your own argument |
| Self-interrogation | Procedural questions mid-post that audit your own method (≥2 question marks per ≤800 words) |
| Compressed-reversal close | Final sentence under 12 words, landing concrete — never stock provisional phrases |
| Intentional fragments | Use rhythm and pacing for emphasis; vary the shape |

### Structure Patterns
- Question-First Hook
- The Evolution Pattern ("I used to think X, now I think Y")
- Compare/Contrast
- The "Here's Where I've Landed" closing

### Anti-Patterns to Avoid
- ❌ Corporate jargon
- ❌ Academic distance
- ❌ Prescriptive authority ("You should always...")
- ❌ Humble bragging

### Output Types
- `pov` - Short-form strategy POV (800-1200 words)
- `paper` - Long-form thought leadership (3000-8000 words)
- `post` - Blog post format

---

## Mode 2: Solution Architecture

### When to Use
- Technical architecture documentation
- Solution design documents
- System integration specifications
- API documentation
- Infrastructure designs
- Technical whitepapers (implementation-focused)

### Voice Characteristics
Reference: `docs/solution-architecture-guide.md`

| Principle | Application |
|-----------|-------------|
| Lead with conclusions | State decisions first, rationale second |
| Be definitive | "The system uses X" not "Here's where I've landed" |
| Complete sentences | No fragments; every statement should be implementable |
| Diagrams over prose | Visual > verbal for architecture |
| Reference-grade precision | Someone should be able to implement from this |

### Structure Patterns
Based on arc42 template, adapted for consulting:

```
1. Executive Summary
2. Context & Scope (C4 Level 1)
3. Solution Strategy
4. Building Blocks View (C4 Level 2-3)
5. Runtime View (Sequences)
6. Deployment View
7. Cross-Cutting Concerns
8. Risks & Mitigations
9. Implementation Roadmap
```

### Anti-Patterns to Avoid
- ❌ Narrative storytelling
- ❌ Provisional language ("I think", "perhaps", "for now")
- ❌ Rhetorical questions
- ❌ Self-interrogation as content
- ❌ Prose where diagrams would be clearer

### Output Types
- `architecture` - Full solution architecture document
- `adr` - Architecture Decision Record
- `tech-deck` - Technical architecture presentation
- `spec` - Technical specification

---

## Mode 3: Executive Advisory

### When to Use
- Strategy decks for client presentations
- Executive briefings and recommendations
- Business case documents
- Transformation roadmaps
- Stakeholder alignment materials
- Whitepapers (strategy-focused)

### Voice Characteristics
Reference: `docs/executive-advisory-guide.md`

| Principle | Application |
|-----------|-------------|
| Pattern recognition | "I've seen this across retail, manufacturing, and enterprise clients" |
| Confident recommendations | "I recommend..." not "You might consider..." |
| Grounded in context | Reference actual meetings, stakeholder quotes |
| Outcome-focused | Lead with business value, not technical details |
| Structured clarity | Clear sections, scannable format |

### Structure Patterns

**Situation-Complication-Resolution (SCR)**
```
SITUATION: Where you are today
COMPLICATION: The challenge or tension
RESOLUTION: The recommended path forward
```

**Before-After-Breakthrough**
```
BEFORE: Current state and pain points
AFTER: Vision of the solved state
BREAKTHROUGH: How to bridge the gap
```

### Anti-Patterns to Avoid
- ❌ Too much technical detail for executives
- ❌ Too much narrative for action items
- ❌ Uncertainty language where confidence is needed
- ❌ Missing the "so what?" (business impact)

### Output Types
- `deck` - Strategic slide deck
- `brief` - Executive brief (1-3 pages)
- `roadmap` - Strategic roadmap document
- `whitepaper` - Strategy whitepaper

---

## Mode 4: Internal Strategy

### When to Use
- Solution plans and proposals (internal)
- CX / product strategy documents
- Sequencing arguments and priority cases
- Technical proposals with business framing
- Any internal doc that needs to drive decisions across teams

### Voice Characteristics
Reference: `docs/voice/internal-strategy-voice.md`

| Principle | Application |
|-----------|-------------|
| Scannable first | VP finds risks in 5 sec, the ask in 10 |
| Short context, then structure | 1-3 sentence paragraphs, then bullets/tables for facts |
| "We" not "you" | Internal team voice, named people and systems |
| Options with rationale | Benefit / trade-off / risk for each option |
| Tables for structured data | Risks, open questions, next steps — always tables |

### Structure Patterns

```
1. Title + one-line subtitle
2. Overview (2-3 sentences)
3. The Problem (short prose + data table)
4. What's Changing (bullet list)
5. Options / Approach (numbered with rationale)
6. What Must Ship (priorities with scope + blockers)
7. Risks (table: ID | Risk | Impact | Mitigation | Owner)
8. Open Questions (table: # | Question | Blocks | Owner | Deadline)
9. Next Steps (table: Action | Owner | Deadline)
10. Success Metrics (table: Metric | Current | Target)
```

### Anti-Patterns to Avoid
- ❌ Narrative arcs (Tension → Pattern → Framework)
- ❌ Blog voice ("here's where I've landed," "I used to think X")
- ❌ Dense prose with buried facts (wall of text)
- ❌ Metadata fluff (Type: POV / Mode: advisory / Status: Provisional)
- ❌ Consultant framing ("your organization," "I recommend to the client")
- ❌ Rhetorical questions

### Output Types
- `plan` - Solution plan or strategy proposal
- `report` - Internal analysis or assessment
- `proposal` - Technical or business proposal

### Workflow
Internal Strategy documents should **not** run through the ghost-writer/copywriter pipeline, which applies blog voice. Write the markdown directly in the correct format, then convert to HTML + Word.

```
Raw Input → Direct Format (no AI rewrite) → md-to-docs converter → Final
```

---

## Content Type Detection

Signal Forge automatically classifies content based on input signals:

### Classification Signals

| Signal | Thought Leadership | Solution Architecture | Executive Advisory | Internal Strategy |
|--------|-------------------|----------------------|-------------------|-------------------|
| **Keywords** | "explore", "reflect", "I've been thinking" | "system", "component", "data flow", "API" | "recommend", "strategy", "roadmap", "investment" | "plan", "proposal", "must ship", "blocker", "owner" |
| **Artifacts** | Notes, observations, questions | Diagrams, schemas, technical specs | Meeting notes, stakeholder concerns, business context | Research, data analysis, competitive analysis, BRDs |
| **Audience markers** | "readers", "community" | "engineers", "developers", "ops team" | "leadership", "executives", "stakeholders" | "team", "we", cross-functional names |
| **Output request** | "blog post", "article", "POV" | "architecture", "design doc", "spec" | "deck", "brief", "presentation" | "plan", "proposal", "report", "document" |

### Override Mechanism

Users can explicitly specify mode:
```bash
npm run generate --mode architecture --input context.md
npm run generate --mode advisory --input meeting-notes.md
npm run generate --mode thought-leadership --input observations.md
```

---

## Workflow by Mode

### Thought Leadership Workflow
```
Raw Input → Ghost Writer → Copywriter → Editor → Final
           (blog voice)   (polish)     (QA)
```

### Solution Architecture Workflow
```
Raw Input → Architect → Tech Reviewer → Editor → Final
           (structure)  (accuracy)      (QA)
```

### Executive Advisory Workflow
```
Raw Input → Strategist → Copywriter → Editor → Final
           (framing)    (polish)      (QA)
```

---

## Cross-Mode Considerations

### When Modes Overlap

Some deliverables require multiple modes:

| Deliverable | Primary Mode | Secondary Mode | Guidance |
|-------------|--------------|----------------|----------|
| Technical whitepaper | Solution Architecture | Executive Advisory | Lead with business context, follow with architecture |
| Architecture deck for executives | Executive Advisory | Solution Architecture | Visual architecture, minimal technical prose |
| Thought leadership on architecture patterns | Thought Leadership | Solution Architecture | Narrative wrapper, accurate technical content |
| Internal solution plan with architecture | Internal Strategy | Solution Architecture | Business framing + tables, ADRs in appendix |
| Internal CX/product strategy | Internal Strategy | Executive Advisory | "We" voice, not consultant voice; tables for data |

### Hybrid Documents

For documents that span modes, use clear section breaks:

```markdown
## Executive Summary
[Executive Advisory voice - outcome-focused, recommendation-led]

## Technical Architecture
[Solution Architecture voice - precise, diagram-heavy]

## Strategic Implications
[Executive Advisory voice - pattern recognition, recommendations]
```

---

## Quality Gates by Mode

### Thought Leadership Quality Checklist
- [ ] Opens with the defect in hand (concrete + scale), not thesis
- [ ] Shows the work — includes a mechanical re-derivation beat with raw counts
- [ ] Carries an adverse-evidence section
- [ ] Procedural self-interrogation mid-post (zero question marks = composed-essay tell)
- [ ] Closes on a compressed reversal, final sentence under 12 words, no retired provisional phrases
- [ ] Conversational but deliberate tone

### Solution Architecture Quality Checklist
- [ ] Includes C4-style diagrams at appropriate levels
- [ ] All decisions documented with rationale (ADR format)
- [ ] Complete sentences, no fragments
- [ ] Reference-grade precision (implementable)
- [ ] Risks documented with mitigations
- [ ] No provisional or uncertain language

### Executive Advisory Quality Checklist
- [ ] Leads with business value/outcomes
- [ ] Clear recommendations with confidence
- [ ] Pattern recognition from experience
- [ ] Appropriate level of technical detail
- [ ] Actionable next steps
- [ ] Scannable structure with clear headers

---

## Quality Gate

All content, regardless of mode, should pass the Document Quality Audit before sharing. See `docs/voice/document-quality-audit.md` for the four-check framework.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-25 | Initial taxonomy based on RAG-for-AEO learnings |
| 1.1 | 2026-03-13 | Added Internal Strategy as fourth mode. Learned from P&P deliverable iterations — blog voice and dense prose are wrong for internal strategy docs. |
| 1.2 | 2026-03-15 | Added Quality Gate reference and document-quality-audit.md |
