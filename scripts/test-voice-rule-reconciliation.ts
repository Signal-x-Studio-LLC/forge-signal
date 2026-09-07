import assert from 'node:assert/strict';
import { registerBuiltInPresets } from '../src/presets/index.js';
import { checkVoiceForMode } from '../src/content/voice/mode-voice-checker.js';
import { checkVoice } from '../src/content/voice/voice-checker.js';
import { checkVoiceEnhanced } from '../src/content/voice/voice-checker-v2.js';

// This is a synthetic, citation-free stand-in for the short historical source
// shape reviewed during reconciliation. It deliberately does not copy private
// source text into the repository.
registerBuiltInPresets();

const questionlessExcerpt = `The reader needs the claim before the style.

The source assigns that claim to a team, so the draft keeps it there. A clear ending can take the room it needs when the argument is complete.`;

const formOnlyVariant = `Did the reader need the claim before the style?

The source assigns that claim to a team, so the draft keeps it there. A clear ending can take the room it needs when the argument is complete, even when that final sentence carries a specific number such as 12 and remains longer than an old closing target.`;

const historicalModeResult = checkVoiceForMode(questionlessExcerpt, 'thought-leadership');
const variantModeResult = checkVoiceForMode(formOnlyVariant, 'thought-leadership');

assert.equal(
  historicalModeResult.score,
  variantModeResult.score,
  'thought-leadership scoring must ignore question marks, numeric counts, and closing length'
);
assert.deepEqual(historicalModeResult.issues, variantModeResult.issues);
assert.equal(
  historicalModeResult.issues.some((issue) => /opening|positive voice marker|structural pattern/i.test(issue)),
  false,
  'empty thought-leadership requirement lists must not create generic checker failures'
);

const historicalLegacyResult = checkVoice(questionlessExcerpt);
const variantLegacyResult = checkVoice(formOnlyVariant);
assert.equal(
  historicalLegacyResult.score,
  variantLegacyResult.score,
  'the legacy feedback loop must not score a questionless or longer-closing variant lower'
);

for (const [name, result] of [
  ['mode-aware checker', checkVoiceForMode('   \n', 'thought-leadership')],
  ['legacy checker', checkVoice('   \n')],
  ['enhanced checker', checkVoiceEnhanced('   \n')],
] as const) {
  assert.equal(result.passed, false, `${name} must reject empty content`);
  assert.equal(result.score, 0, `${name} must not treat empty content as a passing draft`);
  assert.equal(result.issues.includes('Content is empty'), true);
}

const historicalEnhancedResult = checkVoiceEnhanced(questionlessExcerpt);
assert.equal(
  historicalEnhancedResult.suggestions.some((suggestion) => /opening|question pivot/i.test(suggestion.issue)),
  false,
  'enhanced feedback must not request a hook or question pivot'
);

const stableLabelResult = checkVoice(
  'Atlas keeps the subject visible. Atlas owns the contract. Atlas supplies the evidence. Atlas names the boundary. Atlas makes the consequence clear. Atlas remains the stable topic throughout.'
);
assert.equal(
  stableLabelResult.issues.some((issue) => /repetition|your organization/i.test(issue)),
  false,
  'a repeated meaningful label must not be penalized or rewritten as second-person address'
);

const evolutionResult = checkVoiceEnhanced(
  'I used to think the issue was local, now I know the source showed a broader constraint.'
);
const evolutionSuggestion = evolutionResult.suggestions.find((suggestion) => /evolution formula/i.test(suggestion.issue));
assert.match(evolutionSuggestion?.suggestedFix ?? '', /supplied evidence/i);
assert.doesNotMatch(evolutionSuggestion?.suggestedFix ?? '', /My first draft|went and read/i);

const retiredTellResult = checkVoiceForMode(
  "The claim is supported. Here's where I've landed—for now.",
  'thought-leadership'
);
assert.equal(
  retiredTellResult.issues.some((issue) => /inappropriate/i.test(issue)),
  true,
  'retired-tell protection must remain active'
);

const documentationResult = checkVoiceForMode('Plain prose without a heading.', 'documentation');
assert.equal(
  documentationResult.issues.some((issue) => /positive voice marker|structural pattern/i.test(issue)),
  true,
  'empty thought-leadership requirements must not disable requirements in other modes'
);

console.log('voice rule reconciliation checks passed');
