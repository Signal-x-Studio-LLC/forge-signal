# Solution Architecture Guide

## Purpose

This guide defines voice, structure, and quality standards for **Solution Architecture** content in Signal Forge. Use this when generating technical architecture documentation, solution designs, and implementation specifications.

**Critical Distinction**: This guide intentionally inverts many principles from the thought leadership voice guide. Architecture documentation requires precision over prose, confidence over provisionality, and structure over story.

---

## Core Principles

### 1. Lead with Conclusions

**Thought Leadership**: Opens with tension, questions, exploration
**Architecture**: Opens with decisions and facts

```markdown
❌ "There's a question we keep circling back to: how should we handle intent routing?"

✅ "The system routes user intent through AWS Bedrock as an agentic orchestrator. This decision enables handling of ambiguous, multi-step queries that conditional logic cannot address."
```

### 2. Be Definitive

**Thought Leadership**: States the supported conclusion and scopes what remains unproven
**Architecture**: Authoritative ("The system uses...")

```markdown
❌ "I think we should probably use OpenSearch for semantic queries, but we might revisit this."

✅ "OpenSearch Service provides the vector store for semantic search. Vector embeddings are generated at ingestion time using Amazon Titan Embeddings."
```

### 3. Complete Sentences

**Thought Leadership**: Intentional fragments for rhythm
**Architecture**: Every statement implementable and unambiguous

```markdown
❌ "Vectorized. Queryable. Instant."

✅ "Data is vectorized during ingestion, stored in OpenSearch for queryable access, and retrieved with sub-second latency for semantic search operations."
```

### 4. Diagrams Over Prose

**Thought Leadership**: Narrative explanations
**Architecture**: Visual representations with supporting text

```markdown
❌ [Three paragraphs explaining data flow]

✅ [C4 Container Diagram]
   Caption: "Figure 1: Data ingestion flow from Profound API to OpenSearch"
   [Two sentences clarifying key interactions]
```

### 5. Reference-Grade Precision

Someone should be able to implement from this documentation without asking clarifying questions.

```markdown
❌ "The Lambda function processes incoming data and stores it appropriately."

✅ "The `UpdateOpenSearch` Lambda function:
   - Trigger: S3 PUT event on `profound-data-export` bucket
   - Runtime: Python 3.11
   - Memory: 1024 MB
   - Timeout: 5 minutes
   - Output: Writes vectorized documents to `aeo-knowledge-base` OpenSearch index"
```

---

## Document Structure

Based on arc42 template, adapted for consulting deliverables.

### 1. Executive Summary

**Purpose**: Enable executives to understand the solution in 60 seconds

**Content**:
- Problem statement (1-2 sentences)
- Solution overview (1 paragraph)
- Key architecture decisions (3-5 bullets)
- Expected outcomes/benefits

**Length**: 1 page maximum

**Example**:
```markdown
## Executive Summary

**Problem**: LLMs increasingly influence purchase decisions, but brands have no visibility into how they're represented in AI-generated responses—or tools to improve that representation.

**Solution**: An agentic RAG system that ingests brand visibility data from Profound, enables semantic gap analysis, and generates optimized content to address coverage gaps.

**Key Decisions**:
- AWS Bedrock as agentic orchestrator for intent routing
- OpenSearch for semantic vector search
- Pre-calculated reporting for instant measurement queries

**Expected Outcomes**:
- 60% reduction in "I don't know" responses for tracked queries
- Real-time visibility gap identification
- Measurable before/after optimization tracking
```

### 2. Context & Scope

**Purpose**: Define system boundaries and external dependencies

**Content**:
- C4 Context Diagram (Level 1)
- System actors (users, external systems)
- What's in scope / explicitly out of scope
- Key assumptions

**Diagram Requirements**:
- Show the system as a single box
- Show all external actors and systems
- Label all relationships with interaction type

**Example Structure**:
```markdown
## Context & Scope

### System Context Diagram
[C4 Level 1 Diagram]

### Actors
| Actor | Type | Interaction |
|-------|------|-------------|
| Brand Manager | Human | Queries system for visibility insights, requests optimization |
| Profound API | External System | Provides brand visibility audit data |
| Client CMS | External System | Receives optimized content for publication |

### Scope
**In Scope**:
- Data ingestion from Profound API
- Semantic search and gap analysis
- Content optimization recommendations
- Before/after measurement

**Out of Scope**:
- Direct content publication to channels
- Real-time LLM response monitoring
- Multi-brand benchmarking (Phase 2)

### Assumptions
1. Profound API provides daily data exports in JSON format
2. Client has AWS account with Bedrock access enabled
3. Content optimization is advisory; human approval required before publication
```

### 3. Solution Strategy

**Purpose**: Document key architecture decisions and their rationale

**Content**:
- Architecture approach overview
- Technology selection rationale
- Key patterns employed
- Quality attribute priorities

**Format**: Use ADR format for each major decision (see `templates/adr-template.md`)

**Example**:
```markdown
## Solution Strategy

### Architecture Approach
Event-driven, serverless architecture on AWS with agentic orchestration for intent routing.

### Key Decisions

#### ADR-001: Agentic Intent Routing
**Decision**: Route user requests through AWS Bedrock as an agent rather than conditional logic.
**Rationale**: User intent is ambiguous; agents handle multi-step queries gracefully.
**Trade-off**: +Flexibility, -Latency (~200-400ms added)

#### ADR-002: Pre-Calculated Reporting
**Decision**: Run weekly distillation jobs rather than real-time queries.
**Rationale**: Measurement queries need historical comparison; pre-calculation enables instant response.
**Trade-off**: +Performance, -Freshness (up to 7 days stale)

[Full ADRs in Appendix A]

### Quality Attribute Priorities
1. **Correctness** - Responses must be grounded in actual data
2. **Extensibility** - New tools can be added without rewriting routing
3. **Observability** - All decisions logged for debugging
4. **Performance** - Sub-second response for cached queries
```

### 4. Building Blocks View

**Purpose**: Show system decomposition at container and component levels

**Content**:
- C4 Container Diagram (Level 2)
- C4 Component Diagrams (Level 3) for complex containers
- Component specifications table
- Interface definitions

**Diagram Requirements**:
- Containers: Show all deployable units
- Components: Show internal structure of key containers
- Include technology labels on all elements

**Example**:
```markdown
## Building Blocks View

### Container Diagram
[C4 Level 2 Diagram showing all AWS services]

### Container Specifications

| Container | Technology | Purpose | Scaling |
|-----------|------------|---------|---------|
| API Gateway | AWS API Gateway | Public REST endpoint | Auto |
| Request Handler | Lambda (Node.js 18) | Request validation, routing | 1000 concurrent |
| Bedrock Agent | AWS Bedrock (Claude 3) | Intent classification, orchestration | Per-request |
| OpenSearch | OpenSearch Service 2.x | Vector store, semantic search | 3-node cluster |
| Data Ingestion | Lambda (Python 3.11) | ETL, vectorization | Event-driven |
| Report Generator | Lambda (Python 3.11) | Weekly delta calculation | Scheduled |

### Component Detail: Bedrock Agent

#### Tools Available to Agent

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `AEO_Guiding_Tool` | Identify content gaps | Product category, query context | Gap analysis with recommendations |
| `Reporting_Tool` | Retrieve performance metrics | Brand, date range | Pre-calculated trend data |
| `OpenSearch_Query_Tool` | Semantic search | Natural language query | Relevant documents with scores |

#### System Prompt Structure
[Include actual system prompt or reference to prompt file]
```

### 5. Runtime View

**Purpose**: Show how components interact during key scenarios

**Content**:
- Sequence diagrams for primary use cases
- Data flow descriptions
- Error handling paths

**Scenarios to Document**:
1. Happy path for each primary use case
2. Error/fallback scenarios
3. Background/scheduled processes

**Example**:
```markdown
## Runtime View

### Scenario 1: Optimization Request

```
User → API Gateway → Request Handler → Bedrock Agent
                                            ↓
                                    [Intent: Optimization]
                                            ↓
                              AEO_Guiding_Tool → OpenSearch
                                            ↓
                              [Gap Analysis Retrieved]
                                            ↓
                              Bedrock → Generate Optimized Content
                                            ↓
                              Response → User
```

**Sequence**:
1. User submits: "Optimize our sustainability product descriptions"
2. Request Handler validates and forwards to Bedrock
3. Bedrock classifies intent as "Optimization"
4. Bedrock invokes `AEO_Guiding_Tool` with context
5. Tool queries OpenSearch for sustainability-related gaps
6. OpenSearch returns queries where brand has low visibility
7. Bedrock generates optimized content addressing gaps
8. Response returned with content and gap analysis

**Latency Budget**:
- API Gateway: 10ms
- Request Handler: 50ms
- Bedrock intent classification: 200ms
- OpenSearch query: 100ms
- Bedrock generation: 500ms
- **Total**: ~860ms P95
```

### 6. Deployment View

**Purpose**: Show infrastructure topology and deployment configuration

**Content**:
- Infrastructure diagram
- Environment specifications (dev/staging/prod)
- CI/CD pipeline overview
- Infrastructure as Code references

**Example**:
```markdown
## Deployment View

### Infrastructure Topology
[AWS architecture diagram]

### Environments

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| Development | Feature development | Synthetic | Engineering |
| Staging | Integration testing | Sanitized prod copy | Engineering + QA |
| Production | Live system | Real Profound data | All stakeholders |

### Infrastructure as Code
- **Framework**: AWS CDK (TypeScript)
- **Repository**: `infrastructure/` directory
- **Stacks**: `NetworkStack`, `DataStack`, `ComputeStack`, `APIStack`

### Deployment Pipeline
1. PR merged to `main`
2. GitHub Actions runs tests
3. CDK synth generates CloudFormation
4. Deploy to staging (automatic)
5. Integration tests run
6. Manual approval for production
7. Deploy to production
```

### 7. Cross-Cutting Concerns

**Purpose**: Document patterns that span multiple components

**Content**:
- Security architecture
- Error handling strategy
- Logging and observability
- Data management patterns

**Example**:
```markdown
## Cross-Cutting Concerns

### Security

**Authentication**: API Gateway with API key + IAM authorization
**Authorization**: Role-based access via IAM policies
**Data Encryption**:
- At rest: S3 SSE-S3, OpenSearch encryption enabled
- In transit: TLS 1.3 enforced

**Grounding Enforcement**:
The Bedrock agent system prompt enforces retrieval before generation:
> "You must query the knowledge base before generating any response. Never generate content without retrieved context."

### Error Handling

| Error Type | Handling | User Response |
|------------|----------|---------------|
| OpenSearch timeout | Retry 3x with backoff | "Search is temporarily slow, please retry" |
| Bedrock rate limit | Queue and retry | "Request queued, response in ~30 seconds" |
| Invalid input | Validation rejection | Specific validation error message |
| No relevant data | Graceful empty response | "No data found for [query]. Try broadening your search." |

### Observability

**Logging**: CloudWatch Logs with structured JSON
**Metrics**: CloudWatch Metrics + custom business metrics
**Tracing**: AWS X-Ray for distributed tracing
**Dashboards**: CloudWatch dashboard with key KPIs
```

### 8. Risks & Mitigations

**Purpose**: Document known risks with concrete mitigation strategies

**Format**: Table with severity, likelihood, and mitigation

**Example**:
```markdown
## Risks & Mitigations

| ID | Risk | Severity | Likelihood | Mitigation |
|----|------|----------|------------|------------|
| R1 | Bedrock generates hallucinated insights | High | Medium | Enforce retrieval-before-generation in system prompt; include confidence scores in responses |
| R2 | Profound data coverage is incomplete | Medium | High | Surface coverage metrics; recommend query expansion when coverage < 70% |
| R3 | OpenSearch cluster failure | High | Low | Multi-AZ deployment; automated snapshots every 6 hours |
| R4 | Cost overrun from Bedrock usage | Medium | Medium | Token budgets per request; usage alerts at 80% monthly budget |
| R5 | Stale pre-calculated reports | Low | High | Display "data as of" timestamp; allow manual refresh trigger |

### Open Questions for Client
1. What is acceptable data staleness for reporting queries?
2. Should optimization recommendations require human approval before export?
3. What is the monthly budget ceiling for Bedrock usage?
```

### 9. Implementation Roadmap

**Purpose**: Phase the implementation with clear milestones

**Content**:
- Phase breakdown with scope
- Dependencies between phases
- Success criteria per phase
- Resource requirements

**Example**:
```markdown
## Implementation Roadmap

### Phase 1: Data Foundation (Weeks 1-3)
**Scope**: Ingestion pipeline + OpenSearch setup
**Deliverables**:
- S3 bucket configuration for Profound exports
- Lambda ingestion function with vectorization
- OpenSearch cluster with index configuration
**Success Criteria**:
- Profound data successfully ingested daily
- Semantic queries returning relevant results

### Phase 2: Agent Core (Weeks 4-6)
**Scope**: Bedrock agent with basic tools
**Deliverables**:
- Bedrock agent configuration
- AEO Guiding Tool implementation
- OpenSearch Query Tool implementation
**Success Criteria**:
- Agent correctly routes optimization vs. analysis requests
- Gap analysis returns actionable recommendations

### Phase 3: Measurement (Weeks 7-8)
**Scope**: Reporting and measurement capabilities
**Deliverables**:
- Reporting distillation Lambda
- Compressed reporting storage
- Reporting Tool for agent
**Success Criteria**:
- Before/after comparisons available within 5 seconds
- Weekly trend reports generated automatically

### Phase 4: Production Hardening (Weeks 9-10)
**Scope**: Security, monitoring, documentation
**Deliverables**:
- Security audit and remediation
- Monitoring dashboards
- Runbooks and documentation
**Success Criteria**:
- Passing security review
- 99.5% uptime target met in staging

### Dependencies
- Phase 2 requires Phase 1 completion (needs data to test against)
- Phase 3 can begin in parallel with Phase 2 (separate data path)
- Phase 4 requires Phase 2 + 3 completion
```

---

## Appendix Templates

### A. Architecture Decision Record Template

See `templates/adr-template.md`

### B. Component Specification Template

```markdown
## Component: [Name]

**Purpose**: [One sentence]
**Owner**: [Team/individual]
**Repository**: [Link]

### Interface
**Input**: [Format, source]
**Output**: [Format, destination]
**API**: [Endpoint if applicable]

### Configuration
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| | | | |

### Dependencies
- [Upstream dependency]
- [Downstream dependency]

### Scaling Characteristics
- **Trigger**: [What causes scaling]
- **Min/Max**: [Instance counts]
- **Bottleneck**: [Known constraints]

### Monitoring
- **Health check**: [Endpoint/method]
- **Key metrics**: [What to watch]
- **Alerts**: [Threshold conditions]
```

---

## Quality Checklist

Before finalizing any solution architecture document:

### Structure
- [ ] Executive summary fits on one page
- [ ] C4 Context diagram included
- [ ] C4 Container diagram included
- [ ] All major decisions documented as ADRs
- [ ] Risks documented with mitigations
- [ ] Implementation phases defined with success criteria

### Voice
- [ ] No provisional language ("I think", "perhaps", "for now")
- [ ] No rhetorical questions
- [ ] No narrative storytelling
- [ ] All statements are definitive and implementable
- [ ] Complete sentences throughout

### Precision
- [ ] All components have specifications (technology, purpose, scaling)
- [ ] All interfaces defined (input, output, format)
- [ ] All external dependencies listed
- [ ] All assumptions documented
- [ ] All open questions for client listed

### Diagrams
- [ ] Context diagram shows system boundaries
- [ ] Container diagram shows all deployable units
- [ ] Sequence diagrams for key scenarios
- [ ] Deployment diagram shows infrastructure
- [ ] All diagrams have legends and labels

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-25 | Initial guide based on content taxonomy analysis |
