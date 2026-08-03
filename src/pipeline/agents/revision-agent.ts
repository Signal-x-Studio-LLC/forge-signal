/**
 * Revision Agent
 *
 * Applies targeted content fixes based on voice checker feedback.
 * Preserves identified strengths while addressing specific issues.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import { BaseAgent, type AgentMemory } from './base-agent.js';
import type {
  AgentInput,
  AgentOutput,
  ContentTask,
  RevisionFeedback,
  RevisionStrategy,
  RevisionSuggestion,
  TextRange,
} from '../../core/types/index.js';

// =============================================================================
// Revision Agent Configuration
// =============================================================================

export interface RevisionAgentConfig {
  provider: AIProviderInterface;
  memory?: AgentMemory;
  verbose?: boolean;
  maxTokens?: number;
  temperature?: number;
}

// =============================================================================
// Revision Agent Implementation
// =============================================================================

export class RevisionAgent extends BaseAgent {
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(config: RevisionAgentConfig) {
    super({
      name: 'RevisionAgent',
      type: 'revision',
      provider: config.provider,
      memory: config.memory,
      verbose: config.verbose,
    });

    this.maxTokens = config.maxTokens ?? 8000;
    this.temperature = config.temperature ?? 0.5;
  }

  /**
   * Check if this agent can handle the task
   */
  canHandle(task: ContentTask): boolean {
    // Revision agent handles any content that needs voice fixes
    return true;
  }

  /**
   * Execute revision based on feedback
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    if (!input.feedback) {
      return this.failureOutput('No revision feedback provided');
    }

    try {
      const revisedContent = await this.revise(
        input.previousOutput?.content ?? '',
        input.feedback,
        input.task
      );

      return this.successOutput(revisedContent, {
        duration: Date.now() - startTime,
        strategy: input.feedback.voiceCheck.score < 5 ? 'strategic' : 'targeted',
      });
    } catch (error) {
      return this.failureOutput(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Revise content based on feedback
   */
  async revise(content: string, feedback: RevisionFeedback, task?: ContentTask): Promise<string> {
    const strategy = this.determineStrategy(feedback);
    this.log(`Using revision strategy: ${strategy}`);

    switch (strategy) {
      case 'targeted':
        return this.targetedRevise(content, feedback, task);
      case 'strategic':
        return this.strategicRevise(content, feedback, task);
      case 'rewrite':
        return this.fullRewrite(content, feedback, task);
      default:
        return this.targetedRevise(content, feedback, task);
    }
  }

  /**
   * Targeted revision: Fix specific identified issues
   */
  async targetedRevise(content: string, feedback: RevisionFeedback, task?: ContentTask): Promise<string> {
    const { voiceCheck } = feedback;
    const highPrioritySuggestions = voiceCheck.suggestions.filter(
      (s) => s.priority === 'high'
    );
    const otherSuggestions = voiceCheck.suggestions.filter(
      (s) => s.priority !== 'high'
    );

    const systemInstruction = this.buildTargetedSystemInstruction(feedback, task);
    const prompt = this.buildTargetedPrompt(
      content,
      highPrioritySuggestions,
      otherSuggestions,
      voiceCheck.preservationZones
    );

    return this.generate({
      prompt,
      systemInstruction,
      temperature: this.temperature,
      maxTokens: this.maxTokens,
    });
  }

  /**
   * Strategic revision: Restructure for better voice alignment
   */
  async strategicRevise(content: string, feedback: RevisionFeedback, task?: ContentTask): Promise<string> {
    const systemInstruction = this.buildStrategicSystemInstruction(feedback, task);

    const prompt = `Content to revise (current score: ${feedback.voiceCheck.score}/10):

${content}

---

ISSUES TO FIX:
${feedback.voiceCheck.issues.map((i) => `- ${i}`).join('\n')}

STRENGTHS TO PRESERVE:
${feedback.preserveStrengths.map((s) => `- ${s}`).join('\n')}

---

Rewrite this content to achieve a voice score of ${feedback.targetScore}/10. Maintain the core meaning, reader job, and precision locks while improving the mode-appropriate voice.`;

    return this.generate({
      prompt,
      systemInstruction,
      temperature: 0.6, // Slightly higher for strategic revision
      maxTokens: this.maxTokens,
    });
  }

  /**
   * Full rewrite: Complete content regeneration with voice focus
   */
  async fullRewrite(content: string, feedback: RevisionFeedback, task?: ContentTask): Promise<string> {
    const systemInstruction = this.buildFullRewriteSystemInstruction(feedback, task);

    const prompt = `Original content to rewrite:

${content}

---

Key messages to preserve:
${this.extractKeyMessages(content)}

---

Completely rewrite this content in the declared mode's voice so it would score ${feedback.targetScore}/10 on our voice checker. Preserve the reader job, core meaning, and precision locks.`;

    return this.generate({
      prompt,
      systemInstruction,
      temperature: 0.7, // Higher for creative rewrite
      maxTokens: this.maxTokens,
    });
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private determineStrategy(feedback: RevisionFeedback): RevisionStrategy {
    const { voiceCheck } = feedback;

    // Very low score = full rewrite
    if (voiceCheck.score < 3) {
      return 'rewrite';
    }

    // Low score = strategic restructure
    if (voiceCheck.score < 5) {
      return 'strategic';
    }

    // Otherwise = targeted fixes
    return 'targeted';
  }

  private effectiveMode(task?: ContentTask): string {
    if (task?.mode) return task.mode;
    if (task && ['guide', 'reference', 'tutorial', 'explanation'].includes(task.type)) return 'documentation';
    return 'advisory';
  }

  private formatReaderContract(task?: ContentTask): string {
    const constraints = task?.constraints;
    const reader = constraints?.reader || constraints?.targetAudience || 'not declared';
    const job = constraints?.job || 'not declared';
    const assumed = constraints?.assumedKnowledge?.join(', ') || 'no internal project history';
    const plainness = constraints?.plainness || 'practitioner';
    const locks = constraints?.precisionLocks?.join(', ') || 'facts, commands, field names, numbers, citations, and deliberate voice';
    const keep = constraints?.keepTerms?.join(', ') || 'none declared';
    const avoid = constraints?.avoidTerms && Object.keys(constraints.avoidTerms).length
      ? Object.entries(constraints.avoidTerms).map(([from, to]) => `${from} → ${to}`).join('; ')
      : 'none declared';
    return `Reader contract:
- Reader: ${reader}
- Job: ${job}
- Assumed knowledge: ${assumed}
- Plainness: ${plainness}
- Precision locks: ${locks}
- Keep terms: ${keep}
- Avoid/replace terms: ${avoid}`;
  }

  private buildModeInstruction(task?: ContentTask): string {
    const mode = this.effectiveMode(task);
    if (mode === 'thought-leadership') {
      return `Mode: thought leadership (guide v1.3).
- Open with the defect in hand: the concrete broken/missing/wrong thing, with its scale, in sentence one or two. Questions are legal openers but currently dormant.
- Use first-person experience, a mechanical re-derivation beat (go read the source, report counts), and procedural self-interrogation (questions that audit the method, not feelings).
- Keep at least two literal question marks (three to five past 800 words) — mid-post, at the turn of the argument.
- Close on a compressed reversal: final sentence under 12 words, landing on something concrete. Never stock provisional phrases ("here's where I've landed—for now" is a retired tell).
- Offer guidance without pretending one experience is universal.
- Remove corporate jargon and academic distance.`;
    }
    if (mode === 'documentation') {
      return `Mode: documentation.
- Lead with the answer, outcome, or action the reader came for.
- Use one Diátaxis job appropriate to the requested type; do not force Quick Start, examples, tables, code, or troubleshooting into every document.
- Use direct, ordinary connective language. Keep and define load-bearing technical terms.
- Do not add question-first hooks, first-person reflection, self-doubt, evolution-of-thinking anecdotes, or provisional blog cadence.`;
    }
    if (mode === 'architecture') {
      return `Mode: solution architecture.
- Be precise, definitive, and explicit about contracts, constraints, trade-offs, and evidence.
- Preserve canonical technical terms, field names, commands, diagrams, and citations.
- Do not add narrative hooks, first-person reflection, or manufactured uncertainty.`;
    }
    return `Mode: executive advisory.
- Lead with the decision, business outcome, and consequence.
- Use confident, concrete recommendations with named evidence and risks.
- Do not add blog-style self-interrogation, autobiographical evolution, or question-first hooks by reflex.`;
  }

  private buildStrategicSystemInstruction(feedback: RevisionFeedback, task?: ContentTask): string {
    return `You are restructuring content that scored ${feedback.voiceCheck.score}/10 toward ${feedback.targetScore}/10.

${this.buildModeInstruction(task)}

${this.formatReaderContract(task)}

Preserve what is working. Restructure only what prevents the declared reader from understanding, deciding, or acting. Never import voice markers from another content mode.`;
  }

  private buildFullRewriteSystemInstruction(feedback: RevisionFeedback, task?: ContentTask): string {
    return `The original content repeatedly failed its voice checks. Rewrite it from scratch while preserving its core meaning and every precision lock.

${this.buildModeInstruction(task)}

${this.formatReaderContract(task)}

Target voice score: ${feedback.targetScore}/10. Do not invent facts, examples, output, commands, citations, or product behavior.`;
  }

  private buildTargetedSystemInstruction(feedback: RevisionFeedback, task?: ContentTask): string {
    return `You are a precision content editor. Your task is to apply specific fixes to content while preserving everything else.

Rules:
1. Make ONLY the changes specified in the suggestions
2. Do NOT change anything that is working well
3. Preserve the overall structure and flow
4. Maintain the authentic voice where it exists
5. Apply fixes surgically - minimal changes for maximum impact
6. Follow the content mode and reader contract below; do not import another mode's voice markers

${this.buildModeInstruction(task)}

${this.formatReaderContract(task)}

Target: Improve voice score from ${feedback.voiceCheck.score}/10 to ${feedback.targetScore}/10`;
  }

  private buildTargetedPrompt(
    content: string,
    highPrioritySuggestions: RevisionSuggestion[],
    otherSuggestions: RevisionSuggestion[],
    preservationZones: TextRange[]
  ): string {
    let prompt = `Content to revise:\n\n${content}\n\n---\n\n`;

    if (highPrioritySuggestions.length > 0) {
      prompt += `HIGH PRIORITY FIXES (must address):\n`;
      for (const suggestion of highPrioritySuggestions) {
        prompt += `\n• Issue: ${suggestion.issue}`;
        if (suggestion.currentText) {
          prompt += `\n  Current: "${suggestion.currentText}"`;
        }
        if (suggestion.suggestedFix) {
          prompt += `\n  Fix: ${suggestion.suggestedFix}`;
        }
      }
      prompt += '\n\n';
    }

    if (otherSuggestions.length > 0) {
      prompt += `ADDITIONAL IMPROVEMENTS (address if possible):\n`;
      for (const suggestion of otherSuggestions) {
        prompt += `\n• ${suggestion.issue}`;
        if (suggestion.suggestedFix) {
          prompt += `: ${suggestion.suggestedFix}`;
        }
      }
      prompt += '\n\n';
    }

    if (preservationZones.length > 0) {
      prompt += `PRESERVE THESE SECTIONS (do not modify):\n`;
      for (const zone of preservationZones.slice(0, 3)) {
        const preview = zone.text.substring(0, 100).replace(/\n/g, ' ');
        prompt += `\n• "${preview}..."`;
      }
      prompt += '\n\n';
    }

    prompt += `Apply the fixes and return the complete revised content.`;

    return prompt;
  }

  private extractKeyMessages(content: string): string {
    // Extract headers and key statements
    const headers = content.match(/^#+\s*.+$/gm) || [];
    const recommendations = content.match(/I recommend.+\./gi) || [];
    const conclusions =
      content.match(
        /(In conclusion|To summarize|The key takeaway|The bottom line).+\./gi
      ) || [];

    const messages: string[] = [
      ...headers.map((h) => h.replace(/^#+\s*/, '')),
      ...recommendations,
      ...conclusions,
    ];

    return messages.length > 0
      ? messages.slice(0, 5).join('\n')
      : 'Preserve the core argument and recommendations';
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createRevisionAgent(config: RevisionAgentConfig): RevisionAgent {
  return new RevisionAgent(config);
}
