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

  // Check opening (guide v1.3: defect-in-hand cold open is the current
  // dominant; question/tension openers remain legal but dormant)
  const firstParagraph = content.split('\n\n')[0] || '';
  const hasDefect =
    /\b(broke|broken|failed|failing|missing|wasn't there|didn't exist|wrong|silently|deleted|no error)\b/i.test(
      firstParagraph
    );
  const hasQuestion = /[?]/.test(firstParagraph);
  const hasTension = /tension|uncomfortable|dilemma|challenge/.test(firstParagraph.toLowerCase());

  if (!hasDefect && !hasQuestion && !hasTension) {
    issues.push(
      'Opening lacks a defect-in-hand (concrete broken/missing thing with scale), question, or tension hook'
    );
    score -= 2;
  } else {
    strengths.push('Strong opening (defect-in-hand, question, or tension)');
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

  // Check for retired provisional tells (guide v1.3: these phrases signal
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

  // Check question floor (guide v1.3: questions live mid-post as the pivot;
  // zero question marks is the clearest composed-essay tell)
  const questionCount = (content.match(/\?/g) || []).length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const questionFloor = wordCount <= 800 ? 2 : 3;
  if (questionCount === 0) {
    issues.push('Zero question marks — the clearest tell of a composed essay rather than thinking out loud');
    score -= 1;
  } else if (questionCount < questionFloor) {
    issues.push(`Only ${questionCount} question mark(s) — floor is ${questionFloor} at this length`);
    score -= 0.5;
  } else {
    strengths.push('Meets the mid-post question floor');
  }

  // Check for bold headers
  const hasBoldHeaders = /^\*\*[^*]+\*\*$/m.test(content);
  if (!hasBoldHeaders) {
    issues.push('Missing bold section headers');
    score -= 0.5;
  } else {
    strengths.push('Uses bold headers for scannability');
  }

  // Check for intentional fragments
  const hasFragments = /^[A-Z][^.!?]*\.$/m.test(content);
  if (!hasFragments) {
    // Not a requirement, but a strength
  } else {
    strengths.push('Uses intentional fragments for rhythm');
  }

  // Check for excessive client name repetition (should use "you" / "your organization")
  // This is a heuristic - if a capitalized word appears more than 10 times in 1000 words, flag it
  const words = content.split(/\s+/);
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    const clean = word.replace(/[^\w]/g, '').trim();
    if (clean.length > 3 && /^[A-Z]/.test(clean)) {
      wordCounts[clean] = (wordCounts[clean] || 0) + 1;
    }
  });
  
  const contentLength = words.length;
  const threshold = Math.max(5, Math.floor(contentLength / 200)); // Roughly 5 per 1000 words
  
  for (const [word, count] of Object.entries(wordCounts)) {
    // Skip common words that start with capitals
    if (['The', 'This', 'That', 'There', 'These', 'Those', 'When', 'Where', 'What', 'Why', 'How'].includes(word)) {
      continue;
    }
    
    if (count > threshold) {
      // Check if it's likely a client name (appears frequently)
      const ratio = count / contentLength;
      if (ratio > 0.02) { // More than 2% of words
        issues.push(`Excessive repetition of "${word}" - consider using "you" / "your organization" instead`);
        score -= 1;
      }
    }
  }

  // Check for natural "you" usage (strength)
  const youCount = (content.match(/\byou\b/gi) || []).length;
  const yourCount = (content.match(/\byour\b/gi) || []).length;
  if (youCount + yourCount > 5) {
    strengths.push('Uses natural "you" / "your" references');
  }

  score = Math.max(0, Math.min(10, score));

  return {
    score,
    passed: score >= 7,
    issues,
    strengths,
  };
}

