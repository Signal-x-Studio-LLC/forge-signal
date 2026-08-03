/**
 * Voice Module
 *
 * Voice checking and validation for content.
 */

export { checkVoice, type VoiceCheckResult } from './voice-checker.js';

export {
  checkVoiceEnhanced,
  getRevisionSummary,
  getHighPrioritySuggestions,
} from './voice-checker-v2.js';

export {
  VOICE_RULES,
  RETIRED_PROVISIONAL_TELLS,
  getVoiceInstructions,
} from './voice-guide.js';
