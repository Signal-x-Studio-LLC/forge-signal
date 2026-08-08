---
name: executive-pov
description: Draft point-of-view documents and strategic briefs in professional consultant voice. External advisor perspective with pattern recognition across clients and industries. Use when asked to write POVs, strategic recommendations, executive summaries, or client-facing strategic documents.
---

# Executive POV Generator

Generate point-of-view documents and strategic briefs from an external consultant perspective.

## When to Use This Skill

- Writing strategic recommendations for client executives
- Creating POV documents on industry trends or challenges
- Drafting executive summaries for proposals
- Developing strategic briefs for client engagement

## Voice: External Consultant Perspective

Write FROM the perspective of a senior consultant providing strategic guidance TO the client organization.

**MANDATORY - Read `references/voice-guide.md` for complete voice specifications.**

### Key Principles

| Principle | Description |
|-----------|-------------|
| Advisor, not insider | You are the external expert, not an internal team member |
| Pattern recognition | Show experience across clients/industries |
| Grounded in context | Reference actual meetings, discussions, client situations |
| Professional but conversational | Not sterile or overly formal |

### Client References

**DO:**
- Use "you" / "your organization" / "your org" naturally
- Mix direct address and third person for natural consultant voice
- Use client name only when necessary for clarity

**DON'T:**
- Repeatedly use client name when "you" is more natural
- Use sterile corporate language
- Sound robotic or distant

### Example Evolution

```markdown
❌ Too Formal/Sterile:
"Acme Corp must implement strict Schema.org standards across Acme Corp's
catalog. This ensures that when an external agent scans Acme Corp's site,
Acme Corp retrieves accurate pricing."

✅ Natural Consultant Voice:
"You must implement strict Schema.org standards across your catalog.
This ensures that when an external agent scans your site, it retrieves
accurate pricing."
```

## Tone Markers

Use these moves to establish consultant voice:

- State the recommendation and name the evidence or decision boundary
- "I recommend..." (consultant guidance)
- "I've seen this tension across..." (pattern recognition)
- "For your organization..." (acknowledging client context)
- "Based on our discussions..." (grounding in meetings)

**Avoid:**
- "[Client] should always..." (too prescriptive)
- "The organization must..." (sterile)
- "We recommend..." (implies internal team)

## Document Structure

### Standard POV Structure

```markdown
# [Topic]: Point of View

## Executive Summary
[2-3 paragraphs summarizing the key insight and recommendation]

## The Challenge
[Context on what the client/industry is facing]

## Pattern Recognition
[What you've observed across similar situations]

## Strategic Recommendation
[Your POV on how to address the challenge]

## Implementation Considerations
[Practical next steps and considerations]

## Risks and Mitigations
[What could go wrong and how to address it]
```

### Strategic Brief Structure

```markdown
# Strategic Brief: [Topic]

**Prepared for**: [Client/Audience]
**Date**: [Date]
**Author**: [Name/Role]

## Situation
[Current state, what prompted this brief]

## Observation
[Key insight or pattern identified]

## Recommendation
[What you recommend and why]

## Expected Outcome
[What success looks like]

## Next Steps
[Immediate actions to take]
```

## Pattern Recognition Examples

Show cross-client experience:

```markdown
"This isn't unique to your organization. I've seen this tension across
retail, manufacturing, and enterprise clients. The pattern is consistent:
organizations that delay structured data investment fall behind in AI
visibility within 12-18 months."
```

Ground insights in meetings:

```markdown
"Your engineering lead put it bluntly in the last review: 'We can't
measure what we can't see.' That observation captures the core
challenge—you need visibility infrastructure before optimization
is possible."
```

## Tone Balance

### What to Include

1. **Confidence without arrogance**
   - "I recommend X" not "You must do X"
   - Show expertise through evidence, not assertion

2. **Specificity over generality**
   - Reference actual numbers, timelines, examples
   - Avoid vague hand-waving

3. **Provisional where appropriate**
   - "Here's what I think today" for evolving situations
   - Definitive for clear recommendations

### What to Avoid

1. **Corporate jargon**
   - ❌ "Leverage synergies to drive value"
   - ✅ "Combine these capabilities to reduce costs"

2. **Hedge-heavy language**
   - ❌ "You might potentially consider perhaps..."
   - ✅ "I recommend..."

3. **Overly casual**
   - ❌ "So basically, the thing is..."
   - ✅ "The core issue is..."

## Quality Checklist

Before finalizing any POV:

- [ ] Written from external consultant perspective
- [ ] Uses "you/your organization" naturally
- [ ] Shows pattern recognition across industries
- [ ] Grounds recommendations in client context
- [ ] Professional but conversational tone
- [ ] Clear recommendations (not just observations)
- [ ] Actionable next steps included
- [ ] Risks acknowledged

## Examples

See `projects/bby/povs/` for POV implementations.
