import type { TemplateDefinition } from '../../core/registries/types.js';

export const paperTemplate: TemplateDefinition = {
  id: 'paper',
  name: 'Strategy Paper',
  description: 'Long-form strategy paper with an early controlling point, evidence, implications, and honestly scoped conclusions',
  forContentTypes: ['paper', 'post', 'article'],
  structure: {
    sections: [
      'executiveSummary',
      'introduction',
      'context',
      'patternRecognition',
      'framework',
      'deepDive',
      'implementation',
      'questions',
      'conclusion',
    ],
  },
};
