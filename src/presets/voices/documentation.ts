import type { VoiceDefinition } from '../../core/registries/types.js';

export const documentationVoice: VoiceDefinition = {
  modeId: 'documentation',
  name: 'Documentation Voice',

  instructions: `
You are writing reader-centered documentation. Key principles:

1. **Lead with the answer, outcome, or learning goal**
2. **Match one primary Diátaxis job**: tutorial, how-to, reference, or explanation
3. **Use numbered steps for actual procedures**, not for conceptual prose
4. **Use tables for comparable reference data**, not by reflex
5. **Make executable examples copy-paste ready** when the reader job needs them
6. **Keep precise domain terms and define unfamiliar ones nearby**
7. **Sentence targets** (provisional — not corpus-derived; see note below): median 12–15 words. Split any sentence carrying two instructions into two sentences — a reader mid-procedure has no working memory to spare for parsing.
8. **The vocabulary bar is set by the Diátaxis job, not the document.** A tutorial for newcomers translates; a reference for practitioners does not. Both keep sentences short — sentence shape and vocabulary are separate decisions, and lowering the second is what costs precision.

Voice markers to include:
- A clear answer, outcome, definition, or learning goal near the start
- Imperative verbs and numbered steps in how-to or tutorial content
- Stable names and scannable fields in reference content
- Causal language and a useful mental model in explanation content
- Direct "you" address only when the document speaks to the reader's action

Avoid:
- Questions or tension openings
- Provisional language ("for now," "here's where I've landed")
- Exploratory or thought-leadership patterns
- Mixing tutorial, how-to, reference, and explanation structures by reflex
- Invented commands, examples, output, prerequisites, or behavior
- First-person reflection, self-doubt, or evolution-of-thinking asides. The reader came for the answer, not the author's route to it. The revision pass strips these, so generating them wastes a pass.


Provenance: the sentence targets above are reasoned defaults, NOT measured against a corpus of {author}'s writing in this mode. Only the thought-leadership mode's targets are corpus-derived (adversarial audit vs the 8 most recent posts, 2026-08-03). Treat these as a starting point to be replaced the first time this mode has enough published output to measure. Do not cite them as evidence.
`,

  checkRules: {
    openingPatterns: {
      required: [
        /\S/,
      ],
      forbidden: [/[?]$/, /I've been thinking|tension|uncomfortable/i],
    },
    voiceMarkers: {
      positive: [
        /^(Run|Install|Configure|Create|Add|Open|Click|Type|Enter)[\s:]/im,
        /```bash/i,
        /\d+\.\s+\w/m,
        /\|\s*Option\s*\||\|\s*Command\s*\|/i,
        /\b(means|is the|are the|because|therefore|causes?|allows?|works by)\b/i,
      ],
      negative: [
        /I think|I believe|perhaps/i,
        /for now|here's where I've landed/i,
        /tension|uncomfortable|dilemma/i,
      ],
    },
    structuralPatterns: {
      required: [
        /^#{1,3}\s+\S+/m,
      ],
    },
    jargonToAvoid: [],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    // Code is a strength when the chosen documentation job uses it, never a requirement.
    const codeBlockCount = (content.match(/```/g) || []).length / 2;
    if (codeBlockCount >= 2) {
      strengths.push('Good use of code examples');
      scoreAdjustment += 0.5;
    }

    // Lists are useful structure when the content naturally has repeated items or steps.
    const hasSteps = /^\d+\.\s+/m.test(content) || /^[-*]\s+/m.test(content);
    if (hasSteps) {
      strengths.push('Uses numbered steps or lists');
      scoreAdjustment += 0.5;
    }

    // Direct address is a strength for action-oriented docs, but explanations
    // and references can be correct without it.
    const youCount = (content.match(/\byou(r)?\b/gi) || []).length;
    if (youCount >= 5) {
      strengths.push('Good use of direct "you" address');
    }

    return { issues, strengths, scoreAdjustment };
  },
};
