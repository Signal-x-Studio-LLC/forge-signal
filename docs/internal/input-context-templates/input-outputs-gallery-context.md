# Signal Forge Expected Outputs Gallery - Input Context

## Document Purpose
Create a visual guide showing what users can expect from each content type and mode in Signal Forge. Include sample outputs, format previews, and quality indicators.

## Target Audience
Users evaluating Signal Forge or trying to understand what outputs they'll receive.

---

## Output Format Overview

Signal Forge generates professional content in multiple formats. This guide shows what you can expect from each combination of content type and output format.

---

## Executive Advisory Outputs

### Strategic Deck (deck)

**Purpose**: Client-ready presentations for strategy discussions, recommendations, and roadmaps.

**Typical Structure**:
1. Cover slide with title and date
2. Executive summary (1 slide)
3. Current state / situation (1-2 slides)
4. Challenges / complications (1-2 slides)
5. Recommended approach (2-3 slides)
6. Implementation roadmap (1-2 slides)
7. Investment / resources (1 slide)
8. Risks and mitigations (1 slide)
9. Next steps (1 slide)
10. Appendix (as needed)

**Voice Characteristics**:
- Confident, declarative statements
- Pattern recognition ("We've seen this across industries...")
- Business outcome focus
- Clear recommendations
- Scannable bullets, not paragraphs

**Sample Section** (Recommendation slide):
```
RECOMMENDATION: PHASED MODERNIZATION

I recommend a three-phase approach based on
successful patterns from similar transformations:

Phase 1: Foundation (Q1-Q2)
• Establish cloud infrastructure
• Migrate non-critical workloads
• Build team capabilities

Phase 2: Core Systems (Q3-Q4)
• Commerce platform modernization
• API-first architecture
• Real-time data integration

Phase 3: Optimization (Q1 Year 2)
• AI/ML capabilities
• Advanced analytics
• Continuous improvement

This approach minimizes risk while delivering
early wins to build momentum.
```

**Format Options**:
- PPTX: Professional PowerPoint with consistent styling
- HTML: Interactive web-based deck with navigation
- PDF: Print-ready static version

---

### Executive Brief (brief)

**Purpose**: 1-3 page summary for busy executives who need the key points quickly.

**Typical Structure**:
1. Headline summary (2-3 sentences)
2. Situation overview
3. Key findings or insights
4. Recommendations
5. Investment / Timeline
6. Decision request

**Voice Characteristics**:
- Lead with the conclusion
- Dense, information-rich
- No fluff or preamble
- Action-oriented
- Clear "ask" at the end

**Sample Opening**:
```
DIGITAL TRANSFORMATION INITIATIVE
EXECUTIVE BRIEF | Q4 2024

SUMMARY
The proposed $12M digital transformation will reduce
operational costs by 40% and enable 3x faster product
launches. I recommend proceeding with Phase 1 funding
of $4M in Q1, with Phase 2 approval contingent on
milestone achievement.

SITUATION
TechCorp's core commerce platform, now 7 years old,
cannot support the company's growth trajectory.
Customer complaints about performance have increased
300% year-over-year, and the engineering team spends
60% of capacity on maintenance rather than innovation.
```

**Format Options**:
- DOCX: Editable Word document
- PDF: Final distribution format
- HTML: Web-viewable version

---

### Strategic Roadmap (roadmap)

**Purpose**: Visual timeline of initiatives, dependencies, and milestones.

**Typical Structure**:
1. Executive summary
2. Strategic objectives
3. Phased approach overview
4. Detailed phase breakdowns
5. Dependencies and critical path
6. Resource requirements
7. Success metrics
8. Governance model

**Voice Characteristics**:
- Definitive timelines
- Clear ownership
- Measurable milestones
- Risk-aware planning
- Stakeholder alignment focus

---

## Solution Architecture Outputs

### Architecture Document (architecture)

**Purpose**: Comprehensive technical documentation for development teams.

**Typical Structure** (arc42-based):
1. Introduction and Goals
2. Constraints
3. Context and Scope (System Context diagram description)
4. Solution Strategy
5. Building Block View (Container and Component diagrams)
6. Runtime View (Sequence flows)
7. Deployment View
8. Crosscutting Concepts (Security, Logging, etc.)
9. Architecture Decisions
10. Quality Requirements
11. Risks and Technical Debt
12. Glossary

**Voice Characteristics**:
- Precise, technical language
- No provisional statements
- Reference-grade detail
- Diagram descriptions for each view
- Implementation-ready specifications

**Sample Section** (Building Block View):
```
## 5. BUILDING BLOCK VIEW

### 5.1 Container View

The system consists of four primary containers:

**API Gateway**
- Technology: Kong or AWS API Gateway
- Responsibilities: Request routing, rate limiting, authentication
- Dependencies: Identity Service for token validation

**Commerce Service**
- Technology: Node.js with TypeScript
- Responsibilities: Product catalog, pricing, inventory
- Database: PostgreSQL for transactional data
- Events: Publishes OrderCreated, InventoryUpdated

**Order Service**
- Technology: Java 17 with Spring Boot
- Responsibilities: Order lifecycle management
- Database: PostgreSQL with read replicas
- Events: Consumes OrderCreated, publishes OrderShipped

**Notification Service**
- Technology: Python with FastAPI
- Responsibilities: Email, SMS, push notifications
- Dependencies: Commerce Service, Order Service events
```

**Format Options**:
- HTML: Interactive with navigation
- PDF: Print-ready with table of contents
- Markdown: Version control friendly

---

### Architecture Decision Record (adr)

**Purpose**: Document a specific technical decision with context and consequences.

**Standard Structure**:
1. Title
2. Status (Proposed, Accepted, Deprecated, Superseded)
3. Context
4. Decision
5. Consequences
6. Alternatives Considered
7. References

**Voice Characteristics**:
- Factual, not persuasive
- Both positive and negative consequences
- Clear rationale
- Links to related decisions

**Sample ADR**:
```
# ADR-003: Event Streaming Platform Selection

## Status
Accepted

## Context
The new microservices architecture requires an event
streaming platform for asynchronous communication
between services. Requirements include:
- Throughput: 100,000 messages/second
- Durability: Events must persist for replay
- Ordering: Strict ordering per partition
- Team expertise: Moderate Kafka experience exists

## Decision
We will use Apache Kafka deployed via Strimzi
operator on our existing Kubernetes cluster.

## Consequences

### Positive
- High throughput meets requirements with margin
- Event replay enables event sourcing patterns
- Strong ecosystem for monitoring (Prometheus, Grafana)
- Team has prior experience

### Negative
- Operational complexity higher than managed services
- Requires dedicated ops capacity
- Learning curve for advanced features

## Alternatives Considered

### RabbitMQ
Rejected: Throughput ceiling too low for growth projections.

### AWS MSK (Managed Kafka)
Rejected: Cost prohibitive at projected volume;
vendor lock-in concerns.

### AWS SQS + SNS
Rejected: No native event replay; ordering
guarantees insufficient.

## References
- Performance benchmarks: [internal doc]
- Cost analysis: [internal doc]
- ADR-001: Cloud Platform Selection
```

---

### Technical Specification (spec)

**Purpose**: Detailed implementation specification for a specific component or feature.

**Voice Characteristics**:
- Extremely precise
- No ambiguity
- Complete enough to implement
- API contracts, data schemas, error codes

---

## Thought Leadership Outputs

### Point of View (pov)

**Purpose**: 800-1200 word opinion piece exploring an idea.

**Typical Structure**:
- An opening the argument earns, with the controlling point clear early
- Personal observation or experience when the source supports it
- Exploration of the idea
- Evidence or complications when they change the claim's scope
- An ending that completes the argument and names any real unresolved boundary

**Voice Characteristics**:
- Earned opening and clear controlling point
- Personal, grounded perspective when source-supported
- Evidence and uncertainty attached to the claims they affect
- Natural rhythm without prescribed question, fragment, or ending patterns

**Sample Opening**:
```
Why do enterprise AI projects keep dying in POC purgatory?

I've watched this pattern repeat across a dozen organizations
now. The demo dazzles. Executives applaud. Budget flows.
And then... nothing. Six months later, the prototype sits
abandoned while the team moves on to the next shiny thing.

I used to think this was a technology problem. Get the
models right. Nail the infrastructure. Build the pipeline.

Now I'm not so sure.
```

**Sample Closing**:
```
Enterprise AI success isn't about the model. It's about the muscle. The
organizational muscle to actually change how work gets done.

That's harder to demo in a boardroom. But it's the only
thing that actually works.

I could be wrong. I often am. But if you're about to
greenlight another AI POC, maybe pause and ask: do we
have the muscle to actually use this?
```

**Format Options**:
- HTML: Blog-ready web page
- DOCX: For editing and feedback
- Markdown: For publishing platforms

---

### Strategy Paper (paper)

**Purpose**: 3000-8000 word comprehensive exploration of a topic.

**Typical Structure**:
- Opening hook and thesis preview
- Multiple sections exploring different angles
- Evidence and examples throughout
- Synthesis and implications
- Leaves an unresolved boundary visible only when the evidence supports one

**Voice Characteristics**:
- Same as POV but more depth
- Multiple lines of inquiry
- More evidence and examples
- More nuance and qualification
- Completes the answer and scopes only the remaining uncertainty

---

## Quality Indicators

### Voice Score Ranges

**7-10: Approved**
- Appropriate opening for the mode
- Consistent voice throughout
- Mode-appropriate language
- Strong structure
- Ready for use

**5-6.9: Needs Review**
- Minor voice inconsistencies
- Some inappropriate language
- Generally usable with edits
- Consider running --iterate

**Below 5: Significant Issues**
- Wrong mode detected
- Major voice problems
- Likely needs re-generation
- Check input context

### Format Quality

**PPTX Quality**:
- Consistent slide layouts
- Readable text sizes
- Proper hierarchy
- Professional color scheme

**HTML Quality**:
- Responsive design
- Clean typography
- Navigation for long documents
- Print-friendly styling

**PDF Quality**:
- Proper pagination
- Table of contents for long docs
- Consistent headers/footers
- Correct margins

---

## Comparison: Same Input, Different Modes

### Input: "Our e-commerce platform is 7 years old and struggling with performance. Customers are complaining. Competition is moving faster. We need to modernize but the team is stretched thin."

**Advisory Mode Output** (deck):
```
RECOMMENDATION: PHASED MODERNIZATION

I recommend a three-phase approach to modernize your
commerce platform while managing team capacity:

• Phase 1: Quick wins and foundation
• Phase 2: Core platform replacement
• Phase 3: Optimization and innovation

Based on similar transformations I've led, this approach
delivers early value while building toward the target state.
```

**Architecture Mode Output** (architecture):
```
## SOLUTION STRATEGY

The modernization program employs a strangler fig pattern
to incrementally replace the legacy monolith with a
microservices architecture.

Key architectural decisions:
- API Gateway for traffic routing between old and new
- Event-driven architecture for loose coupling
- Domain-driven design for service boundaries
- Kubernetes for container orchestration
```

**Thought Leadership Mode Output** (pov):
```
Seven years. That's how long it takes for a "modern"
platform to become technical debt.

I've been watching our commerce platform struggle lately,
and it's got me thinking about how we got here. Not the
technical decisions—those are easy to second-guess.
I mean the organizational dynamics that let seven years
slip by without a meaningful refresh.

Here's what I'm wrestling with...
```

---

## Summary

Signal Forge adapts its output based on:
1. **Content Type**: Deck, brief, architecture, ADR, POV, paper
2. **Mode**: Executive Advisory, Solution Architecture, Thought Leadership
3. **Format**: PPTX, DOCX, PDF, HTML, Markdown

The voice checker ensures outputs match the expected characteristics for each mode. Use `--iterate` for important content that must meet quality standards.
