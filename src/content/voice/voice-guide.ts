/**
 * Voice & Tone Guide for Strategic Content
 *
 * This module now delegates to the voice registry for mode-specific
 * instructions. The legacy VOICE_RULES export is preserved for the v1/v2
 * checkers; RETIRED_PROVISIONAL_TELLS carries the guide-v1.3 retired-tell
 * list those checkers penalize.
 */

import { loadConfig } from '../../core/config.js';
import { getVoiceInstructionsFromRegistry } from '../../core/registries/voice-registry.js';
import type { Perspective } from '../../core/registries/types.js';

export interface VoiceRules {
  openingPatterns: {
    /** Defect-in-hand cold open: a concrete broken/missing/wrong thing, with
     * scale, in sentence one or two. Current dominant (guide v1.3, 2026-08-03). */
    defectFirst: boolean;
    /** Question-first hook. Legal but dormant — zero uses in the 8 most
     * recent posts (guide v1.3 audit). */
    questionFirst: boolean;
    uncomfortableTruth: boolean;
    avoidAcademic: string[];
    avoidCasual: string[];
  };
  structuralPatterns: {
    evolution: boolean;
    compareContrast: boolean;
    provisional: boolean;
    boldHeaders: boolean;
  };
  tonalElements: {
    selfInterrogation: boolean;
    culturalTouchstones: boolean;
    technicalDepth: boolean;
    conversational: boolean;
  };
  avoid: {
    corporateJargon: string[];
    academicDistance: string[];
    humbleBragging: string[];
    prescriptiveAuthority: string[];
  };
}

/** @deprecated Use voice registry instead. Preserved for backward compatibility. */
export const VOICE_RULES: VoiceRules = {
  openingPatterns: {
    defectFirst: true,
    questionFirst: false,
    uncomfortableTruth: true,
    avoidAcademic: [
      "In this post, I'll explore...",
      "This essay examines...",
      "Research shows...",
    ],
    avoidCasual: [
      "Today I want to talk about...",
      "Hey everyone...",
    ],
  },
  structuralPatterns: {
    evolution: true,
    compareContrast: true,
    provisional: true,
    boldHeaders: true,
  },
  tonalElements: {
    selfInterrogation: true,
    culturalTouchstones: true,
    technicalDepth: true,
    conversational: true,
  },
  avoid: {
    corporateJargon: [
      "leverage",
      "synergize",
      "drive value",
      "stakeholders",
      "deliver impactful solutions",
    ],
    academicDistance: [
      "Research shows",
      "One could argue",
      "It is evident that",
    ],
    humbleBragging: [
      "I'm no expert, but",
      "This might be obvious, but",
      "I'm just a",
    ],
    prescriptiveAuthority: [
      "You should always",
      "The right way to",
      "Here are the 7 steps to",
    ],
  },
};

/**
 * Retired provisional tells (guide v1.3, 2026-08-03). These phrases appeared in
 * earlier versions of the voice guide as positive examples; they have been
 * copied so often they now signal templated writing. Checkers PENALIZE their
 * presence — never suggest or reward them.
 */
export const RETIRED_PROVISIONAL_TELLS = [
  "Here's where I've landed—for now",
  "Here's where I've landed",
  "This is what I think today",
  "That's what I think today",
  "This is what I think, anyway",
  "For now, I'm trying to",
  "Ask me again in six months",
  "Two different modes. Same instinct.",
  "Your mileage may vary",
];

/**
 * Get voice instructions for a specific mode with perspective handling.
 *
 * @param mode - Content mode (defaults to 'thought-leadership' for backward compat)
 * @param perspective - Writing perspective (defaults to config-based or 'consultant')
 */
export function getVoiceInstructions(
  mode: string = 'thought-leadership',
  perspective?: Perspective
): string {
  const config = loadConfig();
  const effectivePerspective = perspective ?? (config as any).perspective ?? 'consultant';

  return getVoiceInstructionsFromRegistry(mode, effectivePerspective, {
    author: config.author,
    persona: config.persona,
    company: config.company,
  });
}
