# Forge Signal - Project Instructions

Strategic content generation system producing high-fidelity text (emails, Word, PDF) and slides (PPTX/Google Slides) using multiple AI providers.

**Tech Stack:** Node.js, TypeScript, CLI tool

## Content Taxonomy (Critical)

Four content modes with distinct voice, structure, and workflows. Selecting the correct mode is essential.

| Mode | Use For | Voice | Guide |
|------|---------|-------|-------|
| Thought Leadership | Blog posts, POVs, reflections | Evidence-aware, reader-first, provisional where warranted | `/docs/voice/thought-leadership-voice.md` |
| Solution Architecture | ADRs, specs, technical decks | Precise, definitive, diagram-heavy | `/docs/voice/solution-architecture-voice.md` |
| Executive Advisory | Strategy decks, briefs, roadmaps | Confident consultant, outcome-focused | `/docs/voice/executive-advisory-voice.md` |
| Documentation | Guides, tutorials, references | Instructional, direct, copy-paste ready | `/docs/voice/documentation-voice.md` |

**Mode selection order:** Explicit `--mode` flag -> output type mapping -> content signal classification -> default (Executive Advisory).

Full taxonomy: `/docs/voice/content-taxonomy.md`

## Voice Rules (Non-Inferable)

**Thought Leadership:** State the controlling point within 150 words. Separate observed evidence, reported experience, and hypothesis. Show primary evidence when the claim depends on it. Preserve scope in both directions. Questions, self-correction, and open endings are optional and must be earned by the evidence. Do not turn session steering into POV movement.

**Solution Architecture:** Lead with conclusions. Be definitive ("The system uses X" not "I think we should"). No fragments. Diagrams over prose. No provisional language.

**Executive Advisory:** Lead with business outcomes. Confident recommendations ("I recommend..." not "You might consider..."). Pattern recognition across industries. Consultant perspective.

**Documentation:** Lead with user benefit. Imperative verbs. Numbered steps. Tables over paragraphs. Copy-paste code blocks. No provisional language.

## Key Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Provisional language in architecture ("I think we should use Lambda") | "The system uses Lambda" |
| Technical depth in executive brief | Move to appendix |
| Point lands only at the end | Move the controlling point into the first 150 words |
| Exploratory language in documentation | "Run this command to..." |

## Content Type -> Mode Mapping

`post`/`article`/`pov`/`paper` -> Thought Leadership. `architecture`/`adr`/`tech-deck`/`spec` -> Solution Architecture. `deck`/`brief`/`roadmap` -> Executive Advisory. `guide`/`reference`/`tutorial` -> Documentation. `whitepaper` -> classify by content.

## Configuration

API keys in `.env`: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`, `DEFAULT_AI_PROVIDER` (default: anthropic).

## Commands

```bash
npm run build      # Build TypeScript
npm run dev        # Development mode
npm run generate   # Generate content (see --help for options)
```

## Key References

- `/docs/voice/` -- voice guides by mode
- `/docs/voice/role-definitions.md` -- pipeline role definitions
- `/templates/` -- markdown templates for generation
