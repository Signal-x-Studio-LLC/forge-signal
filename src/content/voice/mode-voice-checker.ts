/**
 * Mode-Aware Voice Checker
 *
 * Checks content voice based on the detected or specified content mode.
 * Voice check rules come from the voice registry — no hardcoded mode data here.
 */

import type { ContentMode } from '../../core/types/index.js';
import { getVoice, listVoices } from '../../core/registries/voice-registry.js';

export interface ModeVoiceCheckResult {
  mode: ContentMode;
  /** 0-10 for detected rule violations; not proof of voice or factual quality. */
  score: number;
  passed: boolean;
  issues: string[];
  strengths: string[];
}

// =============================================================================
// Mode-Aware Checker
// =============================================================================

/**
 * Check content voice for a specific mode
 */
export function checkVoiceForMode(content: string, mode: ContentMode): ModeVoiceCheckResult {
  if (!content.trim()) {
    return {
      mode,
      score: 0,
      passed: false,
      issues: ['Content is empty'],
      strengths: [],
    };
  }

  const voice = getVoice(mode);
  if (!voice) {
    return {
      mode,
      score: 5,
      passed: false,
      issues: [`No voice definition registered for mode "${mode}"`],
      strengths: [],
    };
  }

  const rules = voice.checkRules;
  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 10;

  // Empty requirement lists mean the voice allows several earned forms. Other
  // modes keep their existing requirements.
  const firstParagraph = content.split('\n\n')[0] || '';
  const hasRequiredOpening = rules.openingPatterns.required.length > 0 && rules.openingPatterns.required.some((pattern) =>
    pattern.test(firstParagraph)
  );
  const hasForbiddenOpening = rules.openingPatterns.forbidden.some((pattern) =>
    pattern.test(firstParagraph)
  );

  if (rules.openingPatterns.required.length > 0 && !hasRequiredOpening) {
    issues.push(`Opening lacks expected patterns for ${voice.name}`);
    score -= 2;
  } else if (rules.openingPatterns.required.length > 0) {
    strengths.push(`Strong opening for ${voice.name}`);
  }

  if (hasForbiddenOpening) {
    issues.push(`Opening contains patterns inappropriate for ${voice.name}`);
    score -= 1.5;
  }

  // Check positive voice markers
  const positiveMatches = rules.voiceMarkers.positive.filter((pattern) => pattern.test(content));
  if (rules.voiceMarkers.positive.length > 0 && positiveMatches.length === 0) {
    issues.push(`Missing positive voice markers for ${voice.name}`);
    score -= 1.5;
  } else if (rules.voiceMarkers.positive.length > 0 && positiveMatches.length >= 2) {
    strengths.push(`Uses appropriate voice markers for ${voice.name}`);
  }

  // Check negative voice markers
  const negativeMatches = rules.voiceMarkers.negative.filter((pattern) => pattern.test(content));
  if (negativeMatches.length > 0) {
    issues.push(`Contains voice markers inappropriate for ${voice.name}`);
    score -= negativeMatches.length * 0.75;
  }

  // Check structural patterns
  const hasRequiredStructure = rules.structuralPatterns.required.length > 0 && rules.structuralPatterns.required.some((pattern) =>
    pattern.test(content)
  );
  if (rules.structuralPatterns.required.length > 0 && !hasRequiredStructure) {
    issues.push(`Missing expected structural patterns for ${voice.name}`);
    score -= 0.5;
  } else if (rules.structuralPatterns.required.length > 0) {
    strengths.push(`Has expected structural patterns for ${voice.name}`);
  }

  // Check jargon
  for (const jargon of rules.jargonToAvoid) {
    if (content.toLowerCase().includes(jargon.toLowerCase())) {
      issues.push(`Contains jargon: "${jargon}"`);
      score -= 0.5;
    }
  }

  // Run bonus checks from the voice definition
  if (voice.bonusChecks) {
    const bonus = voice.bonusChecks(content);
    issues.push(...bonus.issues);
    strengths.push(...bonus.strengths);
    score += bonus.scoreAdjustment;
  }

  score = Math.max(0, Math.min(10, score));

  return {
    mode,
    score: Math.round(score * 10) / 10,
    passed: score >= 7,
    issues,
    strengths,
  };
}

/**
 * Get voice instructions for a specific mode.
 * Delegates to the voice registry.
 */
export function getVoiceInstructionsForMode(mode: ContentMode): string {
  const voice = getVoice(mode);
  if (!voice) {
    return `You are writing ${mode} content.`;
  }
  return voice.instructions;
}

/**
 * Detect mode mismatches in content
 */
export function detectModeMismatch(
  content: string,
  intendedMode: ContentMode
): { mismatch: boolean; detectedMode?: ContentMode; reason?: string } {
  const intendedResult = checkVoiceForMode(content, intendedMode);

  // Check against all other registered modes
  const allVoices = listVoices();
  const otherModes = allVoices
    .map((v) => v.modeId)
    .filter((m) => m !== intendedMode);

  for (const otherMode of otherModes) {
    const otherResult = checkVoiceForMode(content, otherMode);
    if (otherResult.score > intendedResult.score + 2) {
      return {
        mismatch: true,
        detectedMode: otherMode,
        reason: `Content scores ${otherResult.score} for ${otherMode} but only ${intendedResult.score} for ${intendedMode}`,
      };
    }
  }

  return { mismatch: false };
}
