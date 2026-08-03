/**
 * Enhanced Voice Checker (v2)
 *
 * Extends the original voice checker with:
 * - Revision suggestions with specific fixes
 * - Problem zones (text locations of issues)
 * - Preservation zones (strengths to keep)
 * - Confidence scoring
 */

import { checkVoice, type VoiceCheckResult } from './voice-checker.js';
import { VOICE_RULES, RETIRED_PROVISIONAL_TELLS } from './voice-guide.js';
import type {
  EnhancedVoiceCheckResult,
  RevisionSuggestion,
  TextRange,
} from '../../core/types/index.js';

// =============================================================================
// Enhanced Checker
// =============================================================================

/**
 * Enhanced voice check with actionable suggestions
 */
export function checkVoiceEnhanced(content: string): EnhancedVoiceCheckResult {
  // Run base check first
  const baseResult = checkVoice(content);

  // Collect suggestions, problem zones, and preservation zones
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];
  const preservationZones: TextRange[] = [];

  // Analyze opening
  const openingAnalysis = analyzeOpening(content);
  if (openingAnalysis.issue) {
    suggestions.push(openingAnalysis.issue);
  }
  if (openingAnalysis.problemZone) {
    problemZones.push(openingAnalysis.problemZone);
  }
  if (openingAnalysis.preservationZone) {
    preservationZones.push(openingAnalysis.preservationZone);
  }

  // Analyze jargon
  const jargonAnalysis = analyzeJargon(content);
  suggestions.push(...jargonAnalysis.suggestions);
  problemZones.push(...jargonAnalysis.problemZones);

  // Analyze academic distance
  const academicAnalysis = analyzeAcademicDistance(content);
  suggestions.push(...academicAnalysis.suggestions);
  problemZones.push(...academicAnalysis.problemZones);

  // Analyze prescriptive authority
  const prescriptiveAnalysis = analyzePrescriptiveAuthority(content);
  suggestions.push(...prescriptiveAnalysis.suggestions);
  problemZones.push(...prescriptiveAnalysis.problemZones);

  // Analyze retired provisional tells (guide v1.3: presence is the defect)
  const retiredTellAnalysis = analyzeRetiredTells(content);
  suggestions.push(...retiredTellAnalysis.suggestions);
  problemZones.push(...retiredTellAnalysis.problemZones);

  // Analyze templated evolution formula (guide v1.3: explicit before/after
  // framing is a tic — evolution shows inside the argument)
  const evolutionAnalysis = analyzeEvolutionPattern(content);
  if (evolutionAnalysis.issue) {
    suggestions.push(evolutionAnalysis.issue);
  }
  if (evolutionAnalysis.problemZone) {
    problemZones.push(evolutionAnalysis.problemZone);
  }

  // Analyze self-interrogation
  const interrogationAnalysis = analyzeSelfInterrogation(content);
  if (interrogationAnalysis.issue) {
    suggestions.push(interrogationAnalysis.issue);
  }
  if (interrogationAnalysis.preservationZone) {
    preservationZones.push(interrogationAnalysis.preservationZone);
  }

  // Calculate confidence based on issue clarity
  const confidence = calculateConfidence(suggestions, baseResult);

  // Sort suggestions by priority
  suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return {
    ...baseResult,
    suggestions,
    preservationZones,
    problemZones,
    confidence,
  };
}

// =============================================================================
// Analysis Functions
// =============================================================================

function analyzeOpening(content: string): {
  issue?: RevisionSuggestion;
  problemZone?: TextRange;
  preservationZone?: TextRange;
} {
  const paragraphs = content.split('\n\n');
  const firstParagraph = paragraphs[0] || '';
  // Guide v1.3: defect-in-hand cold open is the current dominant — a concrete
  // broken/missing/wrong thing, with scale, in sentence one or two.
  const hasDefect =
    /\b(broke|broken|failed|failing|missing|wasn't there|didn't exist|wrong|silently|deleted|no error)\b/i.test(
      firstParagraph
    );
  const hasQuestion = /[?]/.test(firstParagraph);
  const hasTension =
    /tension|uncomfortable|dilemma|challenge|paradox|contradiction/.test(
      firstParagraph.toLowerCase()
    );

  if (hasDefect || hasQuestion || hasTension) {
    return {
      preservationZone: {
        start: 0,
        end: firstParagraph.length,
        text: firstParagraph,
      },
    };
  }

  return {
    issue: {
      issue: 'Opening lacks a defect-in-hand, question, or tension hook',
      location: {
        start: 0,
        end: Math.min(firstParagraph.length, 200),
        text: firstParagraph.substring(0, 200),
      },
      currentText: firstParagraph.substring(0, 100),
      suggestedFix:
        'State the concrete thing that broke, was absent, or was wrong — in your own system, with the scale attached. Example: "I rebuilt a database table and it silently deleted two columns I needed. No error." Question openers are legal but currently dormant.',
      priority: 'high',
    },
    problemZone: {
      start: 0,
      end: Math.min(firstParagraph.length, 200),
      text: firstParagraph.substring(0, 200),
    },
  };
}

function analyzeJargon(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  const jargonReplacements: Record<string, string> = {
    leverage: 'use',
    utilize: 'use',
    synergy: 'collaboration',
    synergize: 'work together',
    'move the needle': 'make progress',
    'low-hanging fruit': 'quick wins',
    'circle back': 'return to',
    'deep dive': 'detailed look',
    'drill down': 'examine closely',
    bandwidth: 'capacity',
    'take offline': 'discuss separately',
    'align on': 'agree on',
    'socialize the idea': 'share the idea',
    'boil the ocean': 'try to do too much',
  };

  for (const jargon of VOICE_RULES.avoid.corporateJargon) {
    const regex = new RegExp(`\\b${escapeRegex(jargon)}\\b`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const replacement = jargonReplacements[jargon.toLowerCase()] || '[simpler alternative]';

      suggestions.push({
        issue: `Corporate jargon: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix: `Replace with "${replacement}"`,
        priority: 'medium',
      });

      problemZones.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzeAcademicDistance(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  const academicReplacements: Record<string, string> = {
    'research shows': "I've seen",
    'studies indicate': "In my experience",
    'one could argue': 'I think',
    'it could be said': 'Here\'s my take',
    'the literature suggests': "What I've observed",
    'scholars have noted': 'Others have pointed out',
  };

  for (const phrase of VOICE_RULES.avoid.academicDistance) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const replacement = academicReplacements[phrase.toLowerCase()] || '[more personal alternative]';

      suggestions.push({
        issue: `Academic distance: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix: `Replace with "${replacement}" - use first person and experiential language`,
        priority: 'medium',
      });

      problemZones.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzePrescriptiveAuthority(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  const prescriptiveReplacements: Record<string, string> = {
    'you should always': 'Consider',
    'the right way to': 'One approach that works',
    'best practice is': 'What I\'ve found effective',
    'you must': 'I recommend',
    'never do': 'I\'d avoid',
    'always ensure': 'It helps to',
  };

  for (const phrase of VOICE_RULES.avoid.prescriptiveAuthority) {
    const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const replacement = prescriptiveReplacements[phrase.toLowerCase()] || '[softer recommendation]';

      suggestions.push({
        issue: `Prescriptive authority: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix: `Replace with "${replacement}" - offer guidance without dictating`,
        priority: 'low',
      });

      problemZones.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzeRetiredTells(content: string): {
  suggestions: RevisionSuggestion[];
  problemZones: TextRange[];
} {
  // Guide v1.3: these phrases were positive examples in earlier guide
  // versions; they are now retired tells. Presence is the defect.
  const suggestions: RevisionSuggestion[] = [];
  const problemZones: TextRange[] = [];

  for (const phrase of RETIRED_PROVISIONAL_TELLS) {
    const regex = new RegExp(escapeRegex(phrase), 'gi');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const sentenceStart = findSentenceStart(content, match.index);
      const sentenceEnd = findSentenceEnd(content, match.index + match[0].length);

      suggestions.push({
        issue: `Retired provisional tell: "${match[0]}"`,
        location: {
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        },
        currentText: match[0],
        suggestedFix:
          'Cut or rewrite — this phrase now signals templated writing. Keep the provisional spirit by ending with forward motion, a concrete detail, or a question you are genuinely still holding.',
        priority: 'high',
      });

      problemZones.push({
        start: sentenceStart,
        end: sentenceEnd,
        text: content.substring(sentenceStart, sentenceEnd),
      });
    }
  }

  return { suggestions, problemZones };
}

function analyzeEvolutionPattern(content: string): {
  issue?: RevisionSuggestion;
  problemZone?: TextRange;
} {
  // Guide v1.3: the explicit "I used to think X, now Y" formula is a
  // templated tic. The current form retracts an earlier sentence mid-argument
  // with the evidence that forced the retraction — absence of the formula is
  // not a defect.
  const evolutionFormulas = [
    /I used to think[^.]+now I/gi,
    /I used to believe[^.]+but/gi,
    /My thinking (has )?evolved/gi,
    /That sounds like progress/gi,
  ];

  for (const pattern of evolutionFormulas) {
    const match = pattern.exec(content);
    if (match) {
      const sentenceStart = findSentenceStart(content, match.index);
      const sentenceEnd = findSentenceEnd(content, match.index + match[0].length);

      return {
        issue: {
          issue: `Templated evolution formula: "${match[0].substring(0, 60)}"`,
          location: {
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
          },
          currentText: match[0],
          suggestedFix:
            'Show the evolution inside the argument instead — retract an earlier sentence with the evidence that forced it ("My first draft of this section said X. Then I went and read the predicate. There\'s a third condition."), or let the changed thinking show through the argument itself.',
          priority: 'medium',
        },
        problemZone: {
          start: sentenceStart,
          end: sentenceEnd,
          text: content.substring(sentenceStart, sentenceEnd),
        },
      };
    }
  }

  return {};
}

function analyzeSelfInterrogation(content: string): {
  issue?: RevisionSuggestion;
  preservationZone?: TextRange;
} {
  // Guide v1.3: questions live mid-post as the pivot that marks the turn in
  // the investigation, and they interrogate procedure, not feelings. Zero
  // question marks is the clearest tell of a composed-essay draft.
  const firstParagraphEnd = content.indexOf('\n\n');
  const bodyStart = firstParagraphEnd === -1 ? 0 : firstParagraphEnd;
  const bodyQuestionIndex = content.indexOf('?', bodyStart);

  if (bodyQuestionIndex !== -1) {
    const sentenceStart = findSentenceStart(content, bodyQuestionIndex);
    const sentenceEnd = findSentenceEnd(content, bodyQuestionIndex);

    return {
      preservationZone: {
        start: sentenceStart,
        end: sentenceEnd,
        text: content.substring(sentenceStart, sentenceEnd),
      },
    };
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const floor = wordCount <= 800 ? 2 : 3;

  return {
    issue: {
      issue: 'No mid-post question pivot',
      suggestedFix:
        `Add procedural self-interrogation at the turn of the argument — questions that audit your own method and report the error rate ("Hadn't I already solved this?", "I went in with four hypotheses. Three were wrong."). Floor at this length: ${floor} literal question marks.`,
      priority: 'high',
    },
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSentenceStart(content: string, index: number): number {
  const sentenceEnders = /[.!?]/;
  let i = index - 1;
  while (i > 0 && !sentenceEnders.test(content[i])) {
    i--;
  }
  return i > 0 ? i + 1 : 0;
}

function findSentenceEnd(content: string, index: number): number {
  const sentenceEnders = /[.!?]/;
  let i = index;
  while (i < content.length && !sentenceEnders.test(content[i])) {
    i++;
  }
  return i < content.length ? i + 1 : content.length;
}

function calculateConfidence(
  suggestions: RevisionSuggestion[],
  baseResult: VoiceCheckResult
): number {
  // Higher confidence if:
  // - More specific suggestions (with locations)
  // - Clearer issues identified
  // - Base score is not borderline (clear pass or fail)

  const specificSuggestions = suggestions.filter((s) => s.location !== undefined);
  const specificityRatio =
    suggestions.length > 0 ? specificSuggestions.length / suggestions.length : 1;

  const scoreClearance = Math.abs(baseResult.score - 7) / 3; // Distance from threshold

  return Math.min(1, (specificityRatio + scoreClearance) / 2 + 0.3);
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get a summary of what needs to be fixed
 */
export function getRevisionSummary(result: EnhancedVoiceCheckResult): string {
  const lines: string[] = [];

  if (result.passed) {
    lines.push(`Voice check passed (score: ${result.score}/10)`);
  } else {
    lines.push(`Voice check failed (score: ${result.score}/10)`);
  }

  if (result.suggestions.length > 0) {
    lines.push('\nRevision suggestions:');
    for (const suggestion of result.suggestions) {
      const priority = suggestion.priority.toUpperCase();
      lines.push(`[${priority}] ${suggestion.issue}`);
      if (suggestion.suggestedFix) {
        lines.push(`  → ${suggestion.suggestedFix}`);
      }
    }
  }

  if (result.preservationZones.length > 0) {
    lines.push('\nStrengths to preserve:');
    for (const zone of result.preservationZones) {
      const preview = zone.text.substring(0, 80).replace(/\n/g, ' ');
      lines.push(`  ✓ "${preview}..."`);
    }
  }

  return lines.join('\n');
}

/**
 * Extract only high-priority suggestions
 */
export function getHighPrioritySuggestions(
  result: EnhancedVoiceCheckResult
): RevisionSuggestion[] {
  return result.suggestions.filter((s) => s.priority === 'high');
}
