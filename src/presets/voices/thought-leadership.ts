import type { VoiceDefinition } from '../../core/registries/types.js';

/**
 * Thought Leadership voice, derived from the Signal Dispatch voice guide v1.7.
 * Corpus patterns are diagnostics, not drafting gates. The canonical guide:
 * ~/Workspace/dev/apps/blog/docs/signal-dispatch-voice-guide.md
 * (pointer: docs/voice/thought-leadership-voice.md).
 */
export const thoughtLeadershipVoice: VoiceDefinition = {
  modeId: 'thought-leadership',
  name: 'Thought Leadership Voice',

  instructions: `
You are writing thought leadership content in {author}'s voice as a {persona}. Key principles (guide v1.7):

1. **Apply the writing stack in order**: evidence and claim status; reader and artifact job; controlling argument; cognitive load; Signal Dispatch voice; surface mechanics. Voice never rescues an unsupported claim or an unclear argument.
2. **Give the reader a reason to care, then state the controlling point within 150 words.** A defect-in-hand, tension, question, or direct answer can open the piece. The hook may not withhold the point.
3. **Show the evidence the claim requires.** If a claim depends on a repository, study, log, or primary artifact, re-derive it and show enough evidence for the reader to assess it. Do not manufacture a search scene or raw count when the claim does not require one.
4. **Keep evidence states distinct.** Separate observed evidence, a person's reported experience, and an open hypothesis. A repository can show that activity occurred or broadened in one case; it cannot by itself prove cause, quality, value, or a population-level prediction.
5. **Use adverse evidence and self-interrogation only when they change the claim's scope or confidence.** Questions are optional. Session steering, revision churn, or a model's objection is not POV movement unless new evidence changed the conclusion.
6. **Complete the answer before the close.** A compressed reversal, concrete image, or open question is legal only after the reader already knows what the piece established. Keep only the genuinely unresolved boundary open.
7. **Headers are declarative claims** someone could disagree with; the closing section header names a concrete missing thing ("What I Still Don't Have"). Never headers that narrate the essay's own movement ("Where This Leaves Me").
8. **Use intentional fragments, varied in shape** — a repeated fragment structure is a tic, not a tool.
9. **Ground every first-person claim in a source sentence that assigns it to {author}**: never invent people, conversations, or events — and never relocate a true general observation onto the author. Source "the check people skip" stays "the check people skip"; it does not become "the step I kept deferring". The facts stay right and only the attribution goes wrong, which is why relocation reads as paraphrase while drafting and survives any check aimed at made-up people. For every "I"/"my"/"me" sentence, find the source sentence attributing it to {author} specifically — not one that supports the idea, one that assigns it to him. If the source states it generally, state it generally. This runs BOTH ways: do not widen a claim either. If the source says a README of his drifted, the draft does not say \"a README is the file you write once and never open again\" — a reader who maintains theirs replies denying the premise, and the thread is about the premise instead of the argument. Keep the subject the source assigned: not narrower, not wider. Re-run this on every revision pass: relocation enters during editing, once the draft has replaced the source as the thing being edited. No corporate jargon, no academic distance, no prescriptive authority.
10. **Use corpus measurements diagnostically**: the recent composed register has a median sentence of 8–11 words, many short sentences, and concise closes. Do not split meaning, add fragments, insert questions, or manufacture process beats to hit those measurements.

Spirit over literals: these patterns describe what the voice does, not phrases to copy. Never use the retired tells: "ask me again in six months", "here's where I've landed—for now", "that's what I think today", "Two different modes. Same instinct.", "your mileage may vary".

Avoid:
- Corporate jargon ("leverage," "synergize," "drive value")
- Academic distance ("Research shows," "One could argue")
- Prescriptive authority ("You should always," "The right way to")
- The evolution formula as a template ("I used to think X, now I think Y") — show changed thinking through the argument, or retract an earlier sentence mid-post with the evidence that forced it
`,

  checkRules: {
    openingPatterns: {
      required: [/\S/],
      forbidden: [
        /^In this (post|article)/im,
        /^This guide shows/im,
        /^Today I want to talk about/im,
        /^I('| a)m excited to/im,
      ],
    },
    voiceMarkers: {
      positive: [
        /\b\d[\d,]*\b/,
        /\bwent (back )?and (read|counted|checked|looked)\b/i,
        /\b(observed|measured|reported|hypothesis|does not (show|prove|establish))\b/i,
      ],
      negative: [
        /you should always/i,
        /the right way to/i,
        /^step \d+:/im,
        /ask me again in six months/i,
        /here'?s where I('| ha)ve landed/i,
        /that'?s what I think today/i,
        /this is what I think, anyway/i,
        /two different modes\. same instinct\./i,
        /for now, I'?m trying to/i,
        /your mileage may vary/i,
        /^\*\*Where This Leaves/im,
        /^\*\*What I'?m Still Turning/im,
      ],
    },
    structuralPatterns: {
      required: [/^\*\*[^*]+\*\*$/m, /^#{2,3} /m],
    },
    jargonToAvoid: ['leverage', 'synergize', 'drive value', 'stakeholders'],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    // Question count is a diagnostic only (guide v1.7). It never changes score.
    const questions = (content.match(/\?/g) || []).length;
    if (questions > 0) {
      strengths.push(`Uses ${questions} question mark(s); confirm each expresses a genuine turn`);
    }

    // Close length is a diagnostic only (guide v1.7).
    const prose = content.trim().replace(/[*_#>`[\]]/g, '');
    const sentences = prose.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
    const last = sentences[sentences.length - 1] || '';
    const lastWords = last.split(/\s+/).filter(Boolean).length;
    if (lastWords > 20) {
      issues.push(`Closing sentence runs ${lastWords} words — review for diffusion, but preserve necessary meaning`);
    } else if (lastWords > 0 && lastWords < 12) {
      strengths.push('Closing sentence is concise');
    }

    // Mechanical re-derivation beat: raw counts reported somewhere
    if (/\b\d[\d,]*\b/.test(content)) {
      strengths.push('Reports concrete counts; verify they support the claim rather than substitute for an outcome');
    }

    // Adverse-evidence or concrete-absence section
    if (
      /^(\*\*|#{2,3} ).*(don'?t have|still don'?t|what'?s left|didn'?t transfer|the other way|not building)/im.test(
        content
      )
    ) {
      strengths.push('Carries an adverse-evidence or concrete-absence section; verify it changes scope or confidence');
    }

    return { issues, strengths, scoreAdjustment };
  },
};
