# Signal Forge User Guide - Input Context

## Document Purpose
Create a comprehensive HTML-based end user guide for Signal Forge - a strategic content generation system that helps professionals create high-quality business content using AI.

## Target Audience
- Consultants and strategists who need to create decks, briefs, and POVs
- Technical architects documenting solutions
- Thought leaders creating blog posts and articles
- Anyone producing professional content who wants AI assistance with voice consistency

---

## What is Signal Forge?

Signal Forge is a CLI-based content generation system that transforms raw inputs (meeting notes, research, observations) into polished professional content. Unlike generic AI writing tools, Signal Forge understands three distinct content modes and applies the appropriate voice, structure, and workflow for each.

### Key Differentiators
1. **Voice-aware generation**: Applies mode-specific voice principles automatically
2. **Quality gates**: Built-in voice checker ensures content meets quality standards
3. **Agentic workflow**: Optional research and iterative refinement loops
4. **Multi-format output**: Exports to PPTX, DOCX, PDF, HTML, and Google Slides

---

## The Three Content Modes

### Mode 1: Thought Leadership
**Purpose**: Blog posts, articles, POVs exploring ideas
**Voice**: Composed, evidence-aware, reader-first, provisional where warranted
**Output types**: `pov`, `paper`, `post`

**Voice principles**:
- Give the reader a concrete reason to care and state the controlling point within 150 words
- Separate observed evidence, reported experience, and hypothesis
- Show primary evidence when the claim depends on it
- Preserve scope in both directions
- Use self-interrogation only for a genuine evidentiary turn
- Complete the answer before leaving uncertainty open
- Use intentional fragments for rhythm
- Ground claims in actual evidence or label them as hypotheses

**Example use cases**:
- Writing a blog post about emerging technology trends
- Creating a conference presentation exploring new ideas
- Developing a POV on industry shifts

### Mode 2: Solution Architecture
**Purpose**: Technical documentation, system designs, specifications
**Voice**: Precise, definitive, reference-grade, diagram-heavy
**Output types**: `architecture`, `adr`, `tech-deck`, `spec`

**Voice principles**:
- Lead with conclusions, not questions
- Be definitive: "The system uses X" not "Here's where I've landed"
- Complete sentences, no fragments
- Diagrams over prose
- Reference-grade precision (implementable from documentation)
- No provisional language

**Example use cases**:
- Documenting a microservices architecture
- Writing Architecture Decision Records (ADRs)
- Creating technical specifications for development teams

### Mode 3: Executive Advisory
**Purpose**: Strategy decks, executive briefs, recommendations
**Voice**: Confident consultant, outcome-focused, pattern-recognizing
**Output types**: `deck`, `brief`, `roadmap`

**Voice principles**:
- Lead with business outcomes, not technical details
- Confident recommendations: "I recommend..." not "You might consider..."
- Pattern recognition: "I've seen this across retail, manufacturing..."
- Ground in client context: Reference actual conversations
- Structured clarity: Scannable headers, tables, bullets
- Consultant perspective: External advisor, not internal team

**Example use cases**:
- Creating a strategy deck for client presentation
- Writing an executive brief on transformation opportunities
- Developing a digital roadmap recommendation

---

## CLI Commands

### Basic Command
```bash
forge generate <type> [options]
```

### Standard Options
- `-i, --input <file>` - Input file (meeting notes, recap, etc.)
- `-o, --output <file>` - Output file path
- `-p, --provider <provider>` - AI provider: openai, anthropic, google, perplexity
- `-f, --format <formats>` - Output formats (comma-separated)
- `-m, --mode <mode>` - Content mode: thought-leadership, architecture, advisory
- `--audience <audience>` - Target audience
- `--no-edit` - Skip editor review

### Agentic Commands (New)
```bash
forge agent generate <type> [options]
```

**Additional agentic options**:
- `--research` - Enable research agent before production
- `--iterate` - Enable feedback loop until voice approval
- `--max-iterations <n>` - Maximum revision iterations (default: 5)
- `--memory` - Enable long-term memory persistence

**Research-only command**:
```bash
forge agent research "topic" --output context.json
```

**Publish-only command**:
```bash
forge agent publish content.md --format html,pdf,docx
```

---

## Output Formats

| Format | Extension | Best For |
|--------|-----------|----------|
| PowerPoint | .pptx | Strategy decks, presentations |
| Word | .docx | POVs, briefs, papers |
| PDF | .pdf | Final distribution |
| HTML | .html | Web pages, interactive decks |
| Google Slides | URL | Collaborative presentations |
| Markdown | .md | Version control, documentation |

---

## Workflow Examples

### Example 1: Meeting Recap to Strategy Deck
```bash
# Input: meeting-recap.md containing notes from strategy session
forge generate deck --input meeting-recap.md --format pptx,html

# With research and iteration
forge agent generate deck --input meeting-recap.md --research --iterate --format pptx
```

### Example 2: Technical Notes to Architecture Document
```bash
# Input: tech-notes.md containing system design discussions
forge generate architecture --input tech-notes.md --mode architecture --format html,pdf
```

### Example 3: Observations to Thought Leadership POV
```bash
# Input: observations.md containing reflections on industry trends
forge generate pov --input observations.md --mode thought-leadership --format word,html
```

### Example 4: Research and Generate
```bash
# Step 1: Gather research context
forge agent research "AI governance in enterprise" --output research-context.json

# Step 2: Generate content with research
forge agent generate paper --input observations.md --research --iterate --format pdf
```

---

## Configuration

### Required API Keys (.env)
```env
# At least one required
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
PERPLEXITY_API_KEY=your_key

# Default provider
DEFAULT_AI_PROVIDER=anthropic

# Optional: Google Slides
GOOGLE_SLIDES_CREDENTIALS_PATH=path/to/credentials.json
```

### Provider Recommendations
- **Anthropic (Claude)**: Best for strategic thinking and voice consistency
- **OpenAI (GPT-4)**: Strong general purpose, good for technical content
- **Google (Gemini)**: Good for longer documents
- **Perplexity**: Best for research-heavy content with web context

---

## Quality and Voice

Signal Forge includes a voice checker that scores content on a 0-10 scale. The agentic workflow iterates until the voice score reaches 7 or higher.

### Voice Score Components
- Appropriate opening (tension/question for thought leadership, conclusions for architecture)
- Consistent tone throughout
- Mode-appropriate language (provisional vs. definitive)
- Structure alignment
- Audience appropriateness

### Iteration Strategies
1. **Targeted fixes**: Address specific issues identified by voice checker
2. **Strategic revision**: Larger structural changes when targeted fixes stall
3. **Full rewrite**: Complete regeneration if improvement plateaus

---

## Best Practices

### Input Quality
- Include relevant context (who was in the meeting, what decisions were made)
- Note stakeholder concerns and questions
- Provide any constraints or requirements
- Include reference materials when relevant

### Mode Selection
- Let Signal Forge auto-detect when possible
- Override with `--mode` flag when you know the specific need
- Consider hybrid documents that span modes

### Output Review
- Always review generated content
- The voice checker catches most issues, but human judgment matters
- Iterate with more context if output doesn't match expectations

---

## Troubleshooting

### Common Issues

**No output generated**
- Check API keys are configured in .env
- Verify input file exists and is readable
- Check for sufficient API credits

**Wrong voice/tone**
- Use explicit --mode flag to override auto-detection
- Add more context to input about intended audience
- Try --iterate flag for multiple refinement passes

**Missing diagrams in architecture mode**
- Architecture diagrams are described in text format
- Use Excalidraw or similar tools to create visuals from descriptions

**Voice score too low**
- Review the specific feedback from voice checker
- Add more context to help with appropriate tone
- Consider different provider for different content types
