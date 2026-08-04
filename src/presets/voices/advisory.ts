import type { VoiceDefinition } from '../../core/registries/types.js';

export const advisoryVoice: VoiceDefinition = {
  modeId: 'advisory',
  name: 'Executive Advisory Voice',

  instructions: `
You are writing executive advisory content in {author}'s voice as a {persona}. Key principles:

1. **Lead with business outcomes**, not technical details
2. **Confident recommendations**: "I recommend..." not "You might consider..."
3. **Pattern recognition**: "I've seen this across retail, manufacturing..."
4. **Ground in client context**: Reference actual conversations
5. **Structured clarity**: Scannable headers, tables, bullets
6. **Consultant perspective**: External advisor, not internal team
7. **Sentence targets** (provisional — not corpus-derived; see note below): median 12–15 words, no paragraph over three sentences. An executive reads under interruption; sentence length is the first tax they pay.
8. **Business lexicon, technical vocabulary translated**: keep a domain term when it names something the reader owns and is accountable for (margin, churn, headcount, contract term). Translate engineering vocabulary rather than importing it — this is the one mode where lowering the vocabulary bar costs nothing, because the reader's domain is the business, not the stack.

Voice markers to include:
- Clear recommendations with "I recommend"
- Pattern recognition statements
- Use "you" / "your organization" naturally
- Executive summary, recommendations, next steps sections

Avoid:
- Technical deep dives (save for appendix)
- Provisional or uncertain language
- Exploratory questions


Provenance: the sentence targets above are reasoned defaults, NOT measured against a corpus of {author}'s writing in this mode. Only the thought-leadership mode's targets are corpus-derived (adversarial audit vs the 8 most recent posts, 2026-08-03). Treat these as a starting point to be replaced the first time this mode has enough published output to measure. Do not cite them as evidence.
`,

  checkRules: {
    openingPatterns: {
      required: [/recommend|assessment|strategic/i, /you(r)?( organization)?/i],
      forbidden: [/I used to think/i, /what if/i],
    },
    voiceMarkers: {
      positive: [
        /I recommend/i,
        /based on (our|my) (assessment|analysis|experience)/i,
        /I've seen this (pattern|across)/i,
        /your (organization|team|company)/i,
      ],
      negative: [/for now|provisional/i, /I wonder/i],
    },
    structuralPatterns: {
      required: [/^#+\s*(Executive Summary|Recommendations?|Next Steps)/im],
    },
    jargonToAvoid: ['synergize', 'paradigm shift'],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    const recommendCount = (content.match(/I recommend|recommend that you/gi) || []).length;
    if (recommendCount >= 2) {
      strengths.push('Uses confident recommendations');
    } else if (recommendCount === 0) {
      issues.push('Missing clear recommendations');
      scoreAdjustment -= 1;
    }

    return { issues, strengths, scoreAdjustment };
  },
};
