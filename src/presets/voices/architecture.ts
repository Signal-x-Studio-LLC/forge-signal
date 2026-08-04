import type { VoiceDefinition } from '../../core/registries/types.js';

export const architectureVoice: VoiceDefinition = {
  modeId: 'architecture',
  name: 'Solution Architecture Voice',

  instructions: `
You are writing technical architecture documentation. Key principles:

1. **Lead with conclusions**, not questions
2. **Be definitive**: "The system uses X" not "I think we should use X"
3. **Complete sentences**, no fragments
4. **Diagrams over prose** - reference visual elements
5. **Reference-grade precision** - implementable from documentation
6. **No provisional language**
7. **Sentence targets** (provisional — not corpus-derived; see note below): median 15–18 words, one clause deep. Longer than the narrative modes because qualified statements carry contract detail — but never clause-stacked, because reference prose is read under interruption and re-entered mid-page.
8. **Never translate a domain term for accessibility.** This is the mode where the exact word IS the contract: "idempotent", "lockfile", "eventual consistency", "p99". A plainer synonym is a defect, not a kindness — it makes the document unimplementable. Define an unfamiliar term inline on first use and then keep using it.

Voice markers to include:
- Definitive system statements
- Specific measurements (MB, ms, requests/second)
- Architecture section headers (System Context, Container, etc.)
- Tables for component details
- Code blocks for configurations

Avoid:
- Questions or exploratory language
- Provisional phrases ("for now," "here's where I've landed")
- Personal opinions without technical justification


Provenance: the sentence targets above are reasoned defaults, NOT measured against a corpus of {author}'s writing in this mode. Only the thought-leadership mode's targets are corpus-derived (adversarial audit vs the 8 most recent posts, 2026-08-03). Treat these as a starting point to be replaced the first time this mode has enough published output to measure. Do not cite them as evidence.
`,

  checkRules: {
    openingPatterns: {
      required: [/^(The|This) (system|solution|architecture)/im, /provides|enables|uses/i],
      forbidden: [/[?]/, /I think|I believe|perhaps/i],
    },
    voiceMarkers: {
      positive: [
        /```(mermaid|d2|yaml|json|typescript)/i,
        /\|\s*\w+\s*\|/i,
        /\d+ (MB|GB|ms|seconds|minutes)/i,
      ],
      negative: [/for now|here's where I've landed/i, /I wonder|what if/i],
    },
    structuralPatterns: {
      required: [/^#+\s*(System|Container|Component|Deployment|Architecture)/im],
    },
    jargonToAvoid: [],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    if (/\d+\s*(MB|GB|ms|seconds|minutes|KB|TB)/i.test(content)) {
      strengths.push('Includes specific measurements');
    }

    if (/Figure \d+|diagram|see (above|below)/i.test(content)) {
      strengths.push('References diagrams');
    }

    return { issues, strengths, scoreAdjustment };
  },
};
