# forge-signal — Domain Glossary

This file is the canonical glossary for forge-signal. Use these terms exactly. Skills, agents, and contributors should reference this file before inventing new vocabulary.

For the deep authoritative voice and pipeline documentation, see [`docs/voice/`](./docs/voice/).
For the agent-facing operational rules, see [`.claude/CLAUDE.md`](./.claude/CLAUDE.md).

---

## Content modes

forge-signal generates content in one of four **modes**. Selecting the correct mode is the most consequential decision — it controls voice, structure, and validation rules.

| Term | Definition | Authoritative source |
|---|---|---|
| **Thought Leadership** | Mode for blog posts, POVs, reflections. Evidence-aware, reader-first, provisional where warranted. | [`docs/voice/thought-leadership-voice.md`](./docs/voice/thought-leadership-voice.md) |
| **Solution Architecture** | Mode for ADRs, specs, technical decks. Definitive, conclusion-first, diagram-heavy. | [`docs/voice/solution-architecture-voice.md`](./docs/voice/solution-architecture-voice.md) |
| **Executive Advisory** | Mode for strategy decks, briefs, roadmaps. Confident consultant voice, outcome-focused. | [`docs/voice/executive-advisory-voice.md`](./docs/voice/executive-advisory-voice.md) |
| **Documentation** | Mode for guides, tutorials, references. Imperative, step-by-step, copy-paste ready. | [`docs/voice/documentation-voice.md`](./docs/voice/documentation-voice.md) |

The full taxonomy with content-type → mode mappings lives in [`docs/voice/content-taxonomy.md`](./docs/voice/content-taxonomy.md).

---

## Pipeline roles

| Term | Definition |
|---|---|
| **Production Agent** | Orchestrates the multi-role pipeline (Ghost Writer → Copywriter → Editor → Revision Agent) |
| **Iteration Controller** | Manages the refinement loop — stops on voice score ≥ 7, max iterations, or stall (2+ no-improvement passes) |
| **Mode Voice Checker** | Scores content (0–10) against the active mode's voice rules; detects mode mismatches by cross-scoring against all registered modes |
| **Content Classifier** | Auto-detects mode from input signals (keywords, audience markers, structure) when `--mode` not specified |
| **Research Agent** | Optional — gathers context (web/docs) before generation when `--research` is set |

Full role definitions: [`docs/voice/role-definitions.md`](./docs/voice/role-definitions.md).

---

## Brand integration

| Term | Definition |
|---|---|
| **Brand Bridge** | A `*.voice.json` file produced by forge-brand's `signal-forge-voice` exporter. Maps a brand kit's voice attributes to forge-signal's `VoiceRules` shape. |
| **Voice Rules** | The runtime contract for voice validation: `openingPatterns`, `structuralPatterns`, `tonalElements`, `avoid`. |
| **Anti-pattern** | A specific phrasing or pattern the brand rejects. Stored per-category (corporateJargon, academicDistance, humbleBragging, prescriptiveAuthority). |

When a project links to a forge-brand kit, the bridge file is loaded by `validate-content` to score brand alignment. See [`.claude/skills/validate-content/SKILL.md`](./.claude/skills/validate-content/SKILL.md) Pass 0.

---

## Avoid (vocabulary drift)

These terms are **not** part of the canon — replace if encountered:

- "doc" → "content" (we generate many things, not just documents)
- "post" / "article" / "guide" used interchangeably → use the specific content type that maps to the mode
- "tone" → "voice" (voice = the authored register; tone = the per-piece variation within voice)
- "brand guidelines" → "brand kit" (the JSON artifact) or "voice rules" (the validation contract)

---

*This glossary is load-bearing for the `validate-content` skill (Pass 0) and any agent reasoning about modes, voice, or brand alignment. Update it when canonical terms change; do not let new terms enter circulation without adding them here.*
