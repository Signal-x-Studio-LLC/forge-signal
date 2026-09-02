import type { VoiceDefinition } from '../../core/registries/types.js';

/**
 * Thought Leadership voice, derived from the Signal Dispatch voice guide v1.5.
 * Structure and sentence targets come from the v1.3 adversarial audit vs the 8
 * most recent posts + held-out generation test (2026-08-03); principle 9 comes
 * from v1.5 §1b, scope preservation in both directions (2026-08-03/04). Canonical guide:
 * ~/Workspace/dev/sites/nino/blog/docs/signal-dispatch-voice-guide.md
 * (pointer: docs/voice/thought-leadership-voice.md).
 */
export const thoughtLeadershipVoice: VoiceDefinition = {
  modeId: 'thought-leadership',
  name: 'Thought Leadership Voice',

  instructions: `
You are writing thought leadership content in {author}'s voice as a {persona}. Key principles (guide v1.5):

1. **Open with the defect in hand**, not a thesis: sentence one or two states the concrete thing that broke, was absent, or was wrong — in the author's own system, with the scale attached. The tension is the failure itself. Question-first openers are legal but dormant (zero uses in the 8 most recent posts).
2. **Show the work with a mechanical re-derivation beat**: at least one passage stops asserting, goes to the primary source, and reports what it found as raw counts ("2,335 session files", "161 issues in thirty days"). A draft with no go-and-look passage reads as someone else.
3. **Weaken your own argument on purpose**: give a dedicated section to adverse evidence — scope what doesn't transfer, name where the comparison ran the other way, or decline to act on the finding.
4. **Self-interrogate procedure, not feelings**: questions audit the author's method and report the error rate ("I went in with four hypotheses. Three were wrong."). Interior-emotional questioning only when the piece is explicitly personal.
5. **Questions live mid-post as the pivot** — at least two literal question marks in a post of 800 words or fewer, three to five in longer posts. Zero questions is the clearest tell of a composed essay rather than thinking out loud.
6. **End on a compressed reversal**: turn the post's thesis back on the author or the post itself. Final sentence under 12 words, landing on something concrete — an object, a place, a count. A closing sentence over 20 words is a failed close.
7. **Headers are declarative claims** someone could disagree with; the closing section header names a concrete missing thing ("What I Still Don't Have"). Never headers that narrate the essay's own movement ("Where This Leaves Me").
8. **Use intentional fragments, varied in shape** — a repeated fragment structure is a tic, not a tool.
9. **Ground every first-person claim in a source sentence that assigns it to {author}**: never invent people, conversations, or events — and never relocate a true general observation onto the author. Source "the check people skip" stays "the check people skip"; it does not become "the step I kept deferring". The facts stay right and only the attribution goes wrong, which is why relocation reads as paraphrase while drafting and survives any check aimed at made-up people. For every "I"/"my"/"me" sentence, find the source sentence attributing it to {author} specifically — not one that supports the idea, one that assigns it to him. If the source states it generally, state it generally. This runs BOTH ways: do not widen a claim either. If the source says a README of his drifted, the draft does not say \"a README is the file you write once and never open again\" — a reader who maintains theirs replies denying the premise, and the thread is about the premise instead of the argument. Keep the subject the source assigned: not narrower, not wider. Re-run this on every revision pass: relocation enters during editing, once the draft has replaced the source as the thing being edited. No corporate jargon, no academic distance, no prescriptive authority.
10. **Sentence targets**: median 8–11 words; at least a third of sentences six words or shorter; no more than one in eight at twenty words or longer.

Spirit over literals: these patterns describe what the voice does, not phrases to copy. Never use the retired tells: "ask me again in six months", "here's where I've landed—for now", "that's what I think today", "Two different modes. Same instinct.", "your mileage may vary".

Avoid:
- Corporate jargon ("leverage," "synergize," "drive value")
- Academic distance ("Research shows," "One could argue")
- Prescriptive authority ("You should always," "The right way to")
- The evolution formula as a template ("I used to think X, now I think Y") — show changed thinking through the argument, or retract an earlier sentence mid-post with the evidence that forced it
`,

  checkRules: {
    openingPatterns: {
      required: [
        /\b(broke|broken|failed|failing|missing|wasn't there|didn't exist|wrong|silently|deleted|no error)\b/i,
        /\b\d[\d,]*\b/,
        /[?]/,
        /tension|uncomfortable|dilemma|challenge|paradox/i,
      ],
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
        /\b(I was wrong|first draft of this|I said earlier|(three|two|four) were wrong)\b/i,
        /\?/,
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

    const words = content.split(/\s+/).filter(Boolean).length;

    // Question floor (guide v1.3): ≥2 for ≤800 words, ≥3 above
    const questions = (content.match(/\?/g) || []).length;
    const floor = words <= 800 ? 2 : 3;
    if (questions === 0) {
      issues.push('Zero question marks — the clearest composed-essay tell (floor: ≥2)');
      scoreAdjustment -= 1.5;
    } else if (questions < floor) {
      issues.push(`Only ${questions} question mark(s) — floor is ${floor} at this length`);
      scoreAdjustment -= 0.5;
    } else {
      strengths.push('Meets the mid-post question floor');
    }

    // Compressed close (guide v1.3): final sentence <12 words landing
    // concrete; over 20 words is a failed close
    const prose = content.trim().replace(/[*_#>`[\]]/g, '');
    const sentences = prose.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
    const last = sentences[sentences.length - 1] || '';
    const lastWords = last.split(/\s+/).filter(Boolean).length;
    if (lastWords > 20) {
      issues.push(`Closing sentence runs ${lastWords} words — over 20 is a failed close`);
      scoreAdjustment -= 1;
    } else if (lastWords > 0 && lastWords < 12) {
      strengths.push('Closing sentence under 12 words');
      scoreAdjustment += 0.5;
    }

    // Mechanical re-derivation beat: raw counts reported somewhere
    if (/\b\d[\d,]*\b/.test(content)) {
      strengths.push('Reports concrete counts (mechanical re-derivation beat)');
    } else {
      issues.push('No concrete counts — recent posts re-derive claims from a primary source');
      scoreAdjustment -= 0.5;
    }

    // Adverse-evidence or concrete-absence section
    if (
      /^(\*\*|#{2,3} ).*(don'?t have|still don'?t|what'?s left|didn'?t transfer|the other way|not building)/im.test(
        content
      )
    ) {
      strengths.push('Carries an adverse-evidence or concrete-absence section');
      scoreAdjustment += 0.5;
    }

    return { issues, strengths, scoreAdjustment };
  },
};
