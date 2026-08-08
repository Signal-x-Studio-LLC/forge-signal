---
name: solution-architecture
description: Create technical solution architecture documents following arc42 template. Lead with conclusions, be definitive, include C4 diagrams, ADRs, and component specifications. Use when asked to document system architecture, technical designs, implementation specifications, or create technical documentation for development teams.
---

# Solution Architecture Generator

Generate technical architecture documentation following arc42 template structure with definitive, implementation-ready specifications.

## When to Use This Skill

- Documenting system architecture for development teams
- Creating technical designs for client review
- Writing implementation specifications
- Producing architecture decision records (ADRs)

## Critical Voice Distinction

**This skill INVERTS thought leadership voice principles.**

| Aspect | Thought Leadership | Architecture (THIS SKILL) |
|--------|-------------------|---------------------------|
| Opening | Reader payoff within 150 words | Decisions, facts |
| Tone | Provisional only where evidence remains open | Authoritative |
| Language | "This case shows X; Y remains unproven." | "The system uses..." |
| Sentences | Intentional fragments | Complete, implementable |

**MANDATORY - Read `references/solution-architecture-guide.md` for complete voice and structure guidelines.**

## Core Principles

### 1. Lead with Conclusions

```markdown
❌ "There's a question we keep circling back to: how should we handle intent routing?"

✅ "The system routes user intent through AWS Bedrock as an agentic orchestrator.
   This decision enables handling of ambiguous, multi-step queries."
```

### 2. Be Definitive

```markdown
❌ "I think we should probably use OpenSearch, but we might revisit this."

✅ "OpenSearch Service provides the vector store for semantic search.
   Vector embeddings are generated at ingestion time using Amazon Titan."
```

### 3. Reference-Grade Precision

Someone should be able to implement from this documentation without clarifying questions.

```markdown
❌ "The Lambda function processes incoming data and stores it appropriately."

✅ "The `UpdateOpenSearch` Lambda function:
   - Trigger: S3 PUT event on `data-export` bucket
   - Runtime: Python 3.11
   - Memory: 1024 MB
   - Timeout: 5 minutes
   - Output: Writes to `knowledge-base` OpenSearch index"
```

## Document Structure (arc42)

### 1. Executive Summary (1 page max)

```markdown
## Executive Summary

**Problem**: [1-2 sentences]

**Solution**: [1 paragraph]

**Key Decisions**:
- Decision 1
- Decision 2
- Decision 3

**Expected Outcomes**:
- Outcome 1
- Outcome 2
```

### 2. Context & Scope

- C4 Context Diagram (Level 1)
- System actors table
- In scope / Out of scope
- Key assumptions

### 3. Solution Strategy

- Architecture approach overview
- Technology selection rationale
- Key patterns employed
- Quality attribute priorities

### 4. Building Blocks View

- C4 Container Diagram (Level 2)
- C4 Component Diagrams (Level 3) for complex containers
- Component specifications table
- Interface definitions

### 5. Runtime View

- Sequence diagrams for primary use cases
- Data flow descriptions
- Error handling paths
- Latency budgets

### 6. Deployment View

- Infrastructure diagram
- Environment specifications (dev/staging/prod)
- CI/CD pipeline overview
- Infrastructure as Code references

### 7. Cross-Cutting Concerns

- Security architecture
- Error handling strategy
- Logging and observability
- Data management patterns

### 8. Risks & Mitigations

| ID | Risk | Severity | Likelihood | Mitigation |
|----|------|----------|------------|------------|
| R1 | [Risk] | High/Med/Low | High/Med/Low | [Mitigation] |

### 9. Implementation Roadmap

- Phase breakdown with scope
- Dependencies between phases
- Success criteria per phase

## Architecture Decision Records (ADRs)

### ADR Template

```markdown
## ADR-NNN: [Title]

**Status**: Proposed | Accepted | Deprecated | Superseded

**Context**: [What is the issue?]

**Decision**: [What was decided?]

**Rationale**: [Why this decision?]

**Consequences**:
- Positive: [Benefits]
- Negative: [Trade-offs]
- Neutral: [Side effects]

**Alternatives Considered**:
1. [Alternative 1] - Rejected because [reason]
2. [Alternative 2] - Rejected because [reason]
```

## Component Specification Template

```markdown
## Component: [Name]

**Purpose**: [One sentence]
**Owner**: [Team/individual]
**Repository**: [Link]

### Interface
- **Input**: [Format, source]
- **Output**: [Format, destination]
- **API**: [Endpoint if applicable]

### Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|

### Dependencies
- [Upstream dependency]
- [Downstream dependency]

### Scaling
- **Trigger**: [What causes scaling]
- **Min/Max**: [Instance counts]
- **Bottleneck**: [Known constraints]

### Monitoring
- **Health check**: [Endpoint/method]
- **Key metrics**: [What to watch]
- **Alerts**: [Threshold conditions]
```

## Diagram Requirements

### C4 Diagrams

| Level | Shows | Elements |
|-------|-------|----------|
| Context (L1) | System boundaries | System, actors, external systems |
| Container (L2) | Deployable units | Applications, databases, services |
| Component (L3) | Internal structure | Classes, modules, interfaces |

### Sequence Diagrams

Include for:
- Happy path for each primary use case
- Error/fallback scenarios
- Background/scheduled processes

## Quality Checklist

### Structure
- [ ] Executive summary fits on one page
- [ ] C4 Context diagram included
- [ ] C4 Container diagram included
- [ ] All major decisions documented as ADRs
- [ ] Risks documented with mitigations
- [ ] Implementation phases with success criteria

### Voice
- [ ] No provisional language ("I think", "perhaps", "for now")
- [ ] No rhetorical questions
- [ ] No narrative storytelling
- [ ] All statements definitive and implementable
- [ ] Complete sentences throughout

### Precision
- [ ] All components have specifications
- [ ] All interfaces defined
- [ ] All external dependencies listed
- [ ] All assumptions documented
- [ ] Open questions for client listed

### Diagrams
- [ ] Context diagram shows boundaries
- [ ] Container diagram shows all deployable units
- [ ] Sequence diagrams for key scenarios
- [ ] All diagrams have legends and labels

## Examples

See `projects/bby/decks/agentic-rag-for-aeo/` for architecture documentation examples.
