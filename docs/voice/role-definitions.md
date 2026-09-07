# Role Definitions

Signal Forge uses specialized roles organized into workflows. Workflow routing is registry-driven — the system looks up the registered workflow for the detected content mode via `getWorkflowForMode()`.

---

## Workflow Routing

```
                         Raw Input
                             ↓
                    ┌────────┴────────┐
                    │  MODE DETECTION  │
                    │  (--mode flag    │
                    │   or classifier) │
                    └────────┬────────┘
                             ↓
                    ┌────────┴────────┐
                    │ WORKFLOW LOOKUP  │
                    │ (registry-based) │
                    └────────┬────────┘
              ┌──────────────┴──────────────┐
              ↓                              ↓
    STANDARD WORKFLOW               DOCUMENTATION WORKFLOW
    (thought-leadership,            (documentation)
     architecture, advisory)
              ↓                              ↓
       Ghost Writer                  Documentation Writer
              ↓                              ↓
        Copywriter                     Final Output
              ↓
          Editor
              ↓
       Final Output
```

Workflows are defined in `src/presets/workflows/` and registered via `registerWorkflow()`. Custom workflows can be added without modifying core code.

---

## Thought Leadership Roles

### 1. Ghost Writer

**Purpose**: Generate narrative content from raw context using blog voice principles

**Voice Guide**: `docs/voice/thought-leadership-voice.md` (pointer to the canonical Signal Dispatch guide, v1.8)

**Responsibilities**:
- Transform meeting notes, observations, raw ideas into narrative content
- State the controlling point within the first 150 words; choose an opening the argument earns
- Show evidence when it helps the reader assess the claim; do not narrate investigation by default
- Keep uncertainty limited to the unresolved boundary; do not use retired provisional phrases
- Preserve first-person attribution and the source's scope
- Generate multiple angles/approaches

**Input**: Raw meeting notes, observations, reflections, ideas
**Output**: Initial draft with voice markers applied

**Quality Markers**:
- [ ] States the controlling point within 150 words
- [ ] Keeps evidence status and claim scope honest
- [ ] Uses questions, fragments, headings, and endings only when they help this piece
- [ ] Does not use a retired provisional phrase

### 2. Copywriter

**Purpose**: Refine ghost-written content for clarity and impact while preserving voice

**Responsibilities**:
- Enhance clarity without losing authentic voice
- Strengthen narrative arc and pacing
- Ensure voice consistency across content
- Optimize rhythm with sentence length variation
- Polish language while preserving authenticity

**Input**: Ghost writer's draft
**Output**: Polished, voice-consistent content

**Quality Markers**:
- [ ] Voice authenticity preserved
- [ ] Narrative flow improved
- [ ] No corporate jargon introduced
- [ ] Rhythm and pacing enhanced

### 3. Editor

**Purpose**: Final quality assurance against voice guide

**Responsibilities**:
- Verify voice consistency against `thought-leadership-voice.md` (pointer to the canonical guide)
- Check for prohibited patterns (corporate jargon, academic distance)
- Ensure structural patterns are applied correctly
- Final polish and formatting
- Approve for delivery or return with feedback

**Input**: Copywriter's polished draft
**Output**: Approved final content or revision feedback

---

## Solution Architecture Roles

### 1. Architect

**Purpose**: Generate structured technical documentation from architecture context

**Voice Guide**: `docs/solution-architecture-guide.md`

**Responsibilities**:
- Transform architecture discussions into structured documentation
- Create C4 diagrams at appropriate levels (Context, Container, Component)
- Document decisions in ADR format with rationale
- Generate component specifications with precision
- Structure risks as tables with mitigations
- Create deployment and runtime views

**Input**: Architecture discussions, technical decisions, system requirements, meeting notes
**Output**: Structured solution documentation with diagrams

**Voice Principles** (opposite of thought leadership):
- Lead with conclusions, not questions
- Be definitive: "The system uses X" not "Here's where I've landed"
- Complete sentences, no fragments
- Tables and diagrams over prose
- Reference-grade precision (someone should implement from this)

**Quality Markers**:
- [ ] Executive summary fits one page
- [ ] C4 diagrams included at appropriate levels
- [ ] All decisions documented with ADR format
- [ ] No provisional language
- [ ] All components have specifications
- [ ] Risks documented with mitigations

### 2. Tech Reviewer

**Purpose**: Validate technical accuracy and completeness

**Responsibilities**:
- Verify technical accuracy of architecture decisions
- Ensure all components are specified completely
- Check that diagrams match prose descriptions
- Validate that implementation is feasible as documented
- Identify gaps in specifications
- Ensure cross-cutting concerns are addressed

**Input**: Architect's draft documentation
**Output**: Validated documentation or technical feedback

**Quality Markers**:
- [ ] All technical claims are accurate
- [ ] Specifications are complete enough to implement
- [ ] Diagrams are consistent with text
- [ ] No ambiguous or unclear statements
- [ ] Dependencies and constraints documented

### 3. Editor

**Purpose**: Final quality assurance for structure and precision

**Responsibilities**:
- Verify adherence to arc42-based structure
- Check that voice is definitive (no hedging)
- Ensure formatting consistency
- Verify all sections are complete
- Final approval or feedback

**Input**: Tech reviewer's validated documentation
**Output**: Approved final documentation or revision feedback

---

## Executive Advisory Roles

### 1. Strategist

**Purpose**: Frame raw input into strategic recommendations with consultant voice

**Voice Guide**: `docs/executive-advisory-guide.md`

**Responsibilities**:
- Transform meeting notes and context into strategic framing
- Apply narrative frameworks (SCR, Before-After-Breakthrough)
- Lead with business outcomes, not technical details
- Demonstrate pattern recognition across engagements
- Ground recommendations in client context
- Create confident, directive recommendations

**Input**: Meeting notes, client context, strategic discussions
**Output**: Strategically framed content with clear recommendations

**Voice Principles**:
- Consultant perspective: "I recommend..."
- Pattern recognition: "I've seen this across retail, manufacturing..."
- Outcome-focused: Business value first
- Confident with acknowledged caveats
- References actual stakeholder concerns

**Quality Markers**:
- [ ] Clear recommendation in first page/slide
- [ ] Business outcomes lead
- [ ] Pattern recognition demonstrated
- [ ] Grounded in client context
- [ ] Scannable structure

### 2. Copywriter

**Purpose**: Refine strategic content for executive consumption

**Responsibilities**:
- Ensure content is scannable and concise
- Verify business language (not technical jargon)
- Strengthen recommendation clarity
- Optimize for executive reading patterns
- Polish without losing consultant voice

**Input**: Strategist's framed content
**Output**: Executive-ready polished content

**Quality Markers**:
- [ ] Scannable with clear headers
- [ ] No unnecessary technical detail
- [ ] Recommendations are crystal clear
- [ ] Appropriate length for format

### 3. Editor

**Purpose**: Final quality assurance for executive delivery

**Responsibilities**:
- Verify consultant voice consistency
- Check strategic coherence
- Ensure recommendations are actionable
- Verify next steps have owners and dates
- Final approval or feedback

**Input**: Copywriter's polished content
**Output**: Approved final content or revision feedback

---

## Role Comparison Across Modes

| Aspect | Ghost Writer | Architect | Strategist |
|--------|--------------|-----------|------------|
| **Opens with** | Tension/question | Executive summary | Problem + recommendation |
| **Voice** | Exploratory, provisional | Definitive, precise | Confident, directive |
| **Structure** | Narrative arc | arc42 template | SCR / Before-After |
| **Hedging** | Encouraged | Prohibited | Minimal |
| **Primary output** | Prose | Diagrams + specs | Structured recommendations |
| **Reader action** | Think/reflect | Implement | Decide/approve |

---

## Handoff Protocols

### Thought Leadership Handoffs

**Ghost Writer → Copywriter**:
- Flag intentional voice choices that should be preserved
- Note any uncertain sections for refinement
- Indicate target length and format

**Copywriter → Editor**:
- Highlight significant changes from draft
- Note any voice consistency concerns
- Confirm structural pattern used

### Solution Architecture Handoffs

**Architect → Tech Reviewer**:
- Flag assumptions that need validation
- Note any incomplete specifications
- Indicate priority components for review

**Tech Reviewer → Editor**:
- Document technical feedback addressed
- Flag any remaining concerns
- Confirm accuracy of all claims

### Executive Advisory Handoffs

**Strategist → Copywriter**:
- Note key stakeholder concerns addressed
- Flag critical recommendations
- Indicate format and length constraints

**Copywriter → Editor**:
- Highlight recommendation clarity
- Note consultant voice choices
- Confirm scannable structure

---

## Documentation Roles

### Documentation Writer

**Purpose**: Generate user-focused documentation from raw input

**Voice Guide**: `docs/voice/documentation-voice.md`

**Responsibilities**:
- Transform raw notes into instructional, task-oriented content
- Lead with what the user will accomplish
- Use imperative verbs, numbered steps, tables, and code blocks
- Direct "you" address throughout
- Include troubleshooting sections

**Input**: Product notes, feature descriptions, workflow documentation
**Output**: User guide, tutorial, or reference document

**Voice Principles**:
- Imperative: "Run this command" not "You should run"
- Direct: No questions, no provisional language
- Structured: Numbered steps, tables over prose
- Copy-paste ready: Code blocks with commands

**Quality Markers**:
- [ ] Opens with user benefit statement
- [ ] All procedures use numbered steps
- [ ] Code blocks are copy-paste ready
- [ ] Tables used for options/commands
- [ ] Troubleshooting section included

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Three-role workflow for thought leadership |
| 2.0 | 2024-11-25 | Expanded to three content modes with specialized roles |
| 3.0 | 2025-03-15 | Registry-driven workflow routing, added Documentation Writer role |
