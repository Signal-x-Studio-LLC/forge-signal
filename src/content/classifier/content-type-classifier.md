# Content Type Classifier

## Purpose

This document defines the classification logic for automatically detecting which content mode (Thought Leadership, Solution Architecture, or Executive Advisory) should be applied to incoming content requests.

---

## Classification Algorithm

### Step 1: Explicit Override Check

If the user specifies `--mode` flag, use that mode without classification:
- `--mode thought-leadership` → Thought Leadership
- `--mode architecture` → Solution Architecture
- `--mode advisory` → Executive Advisory

### Step 2: Output Type Mapping

Map explicit output type requests to default modes:

| Output Type | Default Mode | Override Allowed |
|-------------|--------------|------------------|
| `post`, `article`, `blog` | Thought Leadership | Yes |
| `pov` | Thought Leadership | Yes |
| `paper` (opinion) | Thought Leadership | Yes |
| `architecture`, `design-doc` | Solution Architecture | Yes |
| `adr` | Solution Architecture | No |
| `spec`, `technical-spec` | Solution Architecture | Yes |
| `tech-deck` | Solution Architecture | Yes |
| `deck`, `presentation` | Executive Advisory | Yes |
| `brief`, `executive-brief` | Executive Advisory | Yes |
| `roadmap` | Executive Advisory | Yes |
| `whitepaper` | Classify by content | Yes |

### Step 3: Content Signal Analysis

If no explicit mode or output type, analyze input content for signals:

```
CLASSIFICATION_SCORE = {
  thought_leadership: 0,
  solution_architecture: 0,
  executive_advisory: 0
}
```

#### Thought Leadership Signals (+1 each)

**Keyword patterns**:
- "explore", "reflect", "thinking about", "wondering"
- "I used to think", "now I think"
- "tension between", "question I keep"
- "here's where I've landed"
- "what if", "I'm not sure"

**Structural patterns**:
- Personal observations or reflections
- Questions without immediate answers
- Evolution of thinking narrative
- Meta-commentary on process

**Audience markers**:
- "readers", "community", "you might find"
- Blog-style framing

#### Solution Architecture Signals (+1 each)

**Keyword patterns**:
- "system", "component", "service", "container"
- "data flow", "API", "endpoint", "schema"
- "deployment", "infrastructure", "AWS", "Azure", "GCP"
- "Lambda", "S3", "OpenSearch", "Bedrock"
- "vector", "embedding", "RAG", "LLM"
- "integration", "interface", "protocol"

**Structural patterns**:
- Technical specifications
- Architecture discussions
- System requirements
- Implementation details
- Diagram references

**Audience markers**:
- "engineers", "developers", "architects"
- "implementation team", "ops team"
- Technical decision context

#### Executive Advisory Signals (+1 each)

**Keyword patterns**:
- "recommend", "recommendation", "advise"
- "strategy", "strategic", "roadmap"
- "investment", "ROI", "business case"
- "stakeholder", "leadership", "executive"
- "phase", "timeline", "milestone"
- "risk", "mitigation", "dependency"

**Structural patterns**:
- Meeting notes with stakeholder names
- Client context and concerns
- Decision requests
- Budget/timeline discussions
- Next steps and action items

**Audience markers**:
- "leadership", "executives", "C-suite"
- "board", "steering committee"
- Client organization references

### Step 4: Score Resolution

```
IF max(scores) == 0:
  # No clear signals - default to Executive Advisory
  # (safest for client-facing content)
  RETURN "executive_advisory"

IF max(scores) is unique:
  RETURN mode_with_max_score

IF tie between modes:
  # Apply priority: Advisory > Architecture > Thought Leadership
  # Rationale: Client deliverables should default to structured output
  RETURN highest_priority_tied_mode
```

### Step 5: Confidence Threshold

Report confidence level with classification:

| Confidence | Condition | Action |
|------------|-----------|--------|
| **High** | max_score >= 5 AND gap to second >= 2 | Proceed automatically |
| **Medium** | max_score >= 3 OR gap to second >= 1 | Proceed with notification |
| **Low** | max_score < 3 AND gap < 1 | Prompt user to confirm |

---

## Classifier Prompt Template

For LLM-based classification, use this prompt:

```
You are a content type classifier for Signal Forge. Analyze the following input and determine which content mode should be used.

## Content Modes

1. **Thought Leadership**: Public argument or explanation grounded in evidence and experience. Blog posts, opinion pieces, reflections. Voice is composed, concrete, and provisional only where the evidence remains open.

2. **Solution Architecture**: Technical documentation with precise specifications. Architecture docs, ADRs, technical specs. Voice is definitive, diagram-heavy, implementation-focused.

3. **Executive Advisory**: Strategic recommendations for client stakeholders. Decks, briefs, roadmaps. Voice is confident consultant, outcome-focused, pattern-recognizing.

## Input to Classify

{input_content}

## Classification Task

1. Identify the primary audience (technical team, executives, general readers)
2. Identify the purpose (explore ideas, document system, recommend action)
3. Identify the expected output format (prose, diagrams, slides)
4. Count signals for each mode
5. Determine the most appropriate mode

## Response Format

```json
{
  "mode": "thought_leadership" | "solution_architecture" | "executive_advisory",
  "confidence": "high" | "medium" | "low",
  "signals": {
    "thought_leadership": ["signal1", "signal2"],
    "solution_architecture": ["signal1", "signal2"],
    "executive_advisory": ["signal1", "signal2"]
  },
  "rationale": "One sentence explaining the classification"
}
```
```

---

## Hybrid Content Handling

Some inputs require multiple modes. Detect hybrid content when:

1. **Architecture + Advisory**: Technical architecture for executive audience
   - Signal: Architecture keywords + "recommend" + stakeholder references
   - Output: Solution Architecture structure with Executive Advisory voice in summary

2. **Thought Leadership + Advisory**: Strategic thinking for clients
   - Signal: Exploratory language + client context + recommendations
   - Output: Executive Advisory structure with some provisional elements allowed

3. **Architecture + Thought Leadership**: Technical deep-dive blog post
   - Signal: Architecture keywords + reflection + blog format request
   - Output: Thought Leadership structure with accurate technical content

### Hybrid Mode Output

```json
{
  "mode": "hybrid",
  "primary": "solution_architecture",
  "secondary": "executive_advisory",
  "guidance": "Use arc42 structure. Apply definitive voice for technical sections. Use consultant voice for executive summary and recommendations."
}
```

---

## Edge Cases

### Case 1: Whitepaper Classification

Whitepapers can be any mode:
- **Thought Leadership Whitepaper**: Exploring ideas, no specific recommendations
- **Solution Architecture Whitepaper**: Technical deep-dive, implementation guidance
- **Executive Advisory Whitepaper**: Strategic recommendations, business case

**Resolution**: Classify by content signals, not by "whitepaper" label.

### Case 2: Meeting Notes

Raw meeting notes require additional context:
- Technical architecture meeting → Solution Architecture
- Strategy session with executives → Executive Advisory
- Brainstorming/reflection → Thought Leadership

**Resolution**: Look for attendee roles and discussion topics.

### Case 3: Ambiguous "Deck" Request

"Create a deck" could be:
- Technical architecture deck → Solution Architecture
- Strategy recommendation deck → Executive Advisory

**Resolution**: Default to Executive Advisory; prompt if architecture signals present.

---

## Implementation Notes

### Rule-Based Classifier

For deterministic classification without LLM:

```typescript
interface ClassificationResult {
  mode: 'thought_leadership' | 'solution_architecture' | 'executive_advisory';
  confidence: 'high' | 'medium' | 'low';
  signals: Record<string, string[]>;
}

function classifyContent(input: string, outputType?: string): ClassificationResult {
  // Step 1: Output type mapping
  if (outputType) {
    const typeMapping = {
      'post': 'thought_leadership',
      'architecture': 'solution_architecture',
      'deck': 'executive_advisory',
      // ... etc
    };
    if (typeMapping[outputType]) {
      return {
        mode: typeMapping[outputType],
        confidence: 'high',
        signals: { [typeMapping[outputType]]: ['explicit_output_type'] }
      };
    }
  }

  // Step 2: Signal counting
  const scores = {
    thought_leadership: countThoughtLeadershipSignals(input),
    solution_architecture: countArchitectureSignals(input),
    executive_advisory: countAdvisorySignals(input)
  };

  // Step 3: Resolution
  return resolveClassification(scores);
}
```

### LLM-Based Classifier

For nuanced classification:

```typescript
async function classifyWithLLM(input: string): Promise<ClassificationResult> {
  const prompt = buildClassifierPrompt(input);
  const response = await llm.complete(prompt);
  return parseClassificationResponse(response);
}
```

### Recommended Approach

Use **rule-based first, LLM fallback**:
1. Check explicit mode/output type → deterministic
2. Count keyword signals → if high confidence, use rule-based result
3. If low confidence, invoke LLM classifier for nuanced analysis

---

## Testing the Classifier

### Test Cases

| Input | Expected Mode | Confidence |
|-------|---------------|------------|
| "Write a blog post about my experience with RAG systems" | Thought Leadership | High |
| "Document the architecture for the AEO system" | Solution Architecture | High |
| "Create a deck recommending the AEO investment to leadership" | Executive Advisory | High |
| Meeting notes with Lambda, S3, "I recommend" | Hybrid (Arch + Advisory) | Medium |
| "What do you think about this approach?" | Thought Leadership | Medium |
| Random text with no signals | Executive Advisory | Low |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-25 | Initial classifier logic |
