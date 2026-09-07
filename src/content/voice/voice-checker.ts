import { VOICE_RULES, RETIRED_PROVISIONAL_TELLS } from './voice-guide.js';

export interface VoiceCheckResult {
  score: number; // 0-10
  passed: boolean;
  issues: string[];
  strengths: string[];
}

/**
 * Check if content matches voice guidelines
 */
export function checkVoice(content: string): VoiceCheckResult {
  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 10;

  if (!content.trim()) {
    return {
      score: 0,
      passed: false,
      issues: ['Content is empty'],
      strengths,
    };
  }

  // Check for corporate jargon
  for (const jargon of VOICE_RULES.avoid.corporateJargon) {
    if (content.toLowerCase().includes(jargon.toLowerCase())) {
      issues.push(`Contains corporate jargon: "${jargon}"`);
      score -= 1;
    }
  }

  // Check for academic distance
  for (const phrase of VOICE_RULES.avoid.academicDistance) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`Contains academic distance: "${phrase}"`);
      score -= 1;
    }
  }

  // Check for prescriptive authority
  for (const phrase of VOICE_RULES.avoid.prescriptiveAuthority) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`Contains prescriptive authority: "${phrase}"`);
      score -= 1;
    }
  }

  // Check for retired provisional tells (guide v1.8: these phrases signal
  // templated writing — presence is the defect, not absence)
  for (const tell of RETIRED_PROVISIONAL_TELLS) {
    if (content.toLowerCase().includes(tell.toLowerCase())) {
      issues.push(`Contains retired provisional tell: "${tell}"`);
      score -= 1;
    }
  }

  // Check for templated evolution formula (guide v1.3: explicit "I used to
  // think X, now Y" framing is a tic when templated — evolution should show
  // inside the argument, e.g. a mid-post retraction with evidence)
  const hasEvolutionFormula = /I used to (think|believe)[^.]+\b(now|but)\b|That sounds like progress/i.test(content);
  if (hasEvolutionFormula) {
    issues.push(
      'Uses the explicit evolution formula ("I used to think X, now Y") — show changed thinking inside the argument instead'
    );
    score -= 0.5;
  }

  score = Math.max(0, Math.min(10, score));

  return {
    score,
    passed: score >= 7,
    issues,
    strengths,
  };
}
