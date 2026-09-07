# Signal Forge Use Cases Guide - Input Context

## Document Purpose
Create a practical, example-driven guide showing real-world use cases for Signal Forge. Each use case should include the scenario, input examples, commands used, and expected outcomes.

## Target Audience
Professionals looking for practical examples of how to use Signal Forge for their specific content needs.

---

## Use Case Categories

### Category 1: Executive Presentations

#### Use Case 1.1: Client Strategy Deck from Meeting Recap

**Scenario**: You just finished a 2-hour strategy session with a client. You have rough notes and need to create a polished deck for the follow-up meeting.

**Sample Input** (meeting-recap.md):
```markdown
# Client Strategy Session - TechCorp
Date: November 25, 2024
Attendees: Sarah (CEO), Mike (CTO), Jennifer (Product)

## Key Discussion Points
- Current platform is aging, 7 years old
- Migration to cloud discussed but concerns about cost
- Customer complaints about slow performance increasing
- Competition launching new features quarterly
- Budget approved for Q1 modernization

## Decisions Made
- Phased migration approach preferred
- Start with customer-facing systems
- Need ROI analysis before full commitment

## Open Questions
- Build vs buy for new commerce engine?
- Timeline expectations from board?
- Staffing for parallel operations?
```

**Command**:
```bash
forge generate deck --input meeting-recap.md --format pptx,html
```

**Expected Output**: 10-15 slide strategic deck including:
- Executive summary with key recommendations
- Current state assessment
- Proposed migration approach
- Phased timeline
- Investment framework
- Risk considerations
- Recommended next steps

---

#### Use Case 1.2: Board-Ready Executive Brief

**Scenario**: The CEO needs a 2-page brief for the board summarizing the digital transformation initiative.

**Sample Input** (transformation-context.md):
```markdown
# Digital Transformation Initiative Summary

## Initiative Overview
18-month program to modernize core systems

## Investment
$12M total - $4M in FY24, $8M in FY25

## Business Case
- 40% reduction in operational costs
- 3x faster time-to-market
- Improved customer satisfaction (NPS +20)

## Key Milestones
- Phase 1 (Q1-Q2): Foundation
- Phase 2 (Q3-Q4): Core systems
- Phase 3 (Q1-Q2 Y2): Integration

## Risks
- Resource constraints
- Change management
- Technical debt

## Current Status
On track - 2 of 6 milestones complete
```

**Command**:
```bash
forge generate brief --input transformation-context.md --format word,pdf
```

**Expected Output**: 2-page executive brief with:
- Outcome-focused summary
- Investment and ROI
- Progress dashboard
- Key risks and mitigations
- Board decision request

---

### Category 2: Technical Documentation

#### Use Case 2.1: Architecture Document from Design Session

**Scenario**: Your team just completed a design session for a new microservices architecture. You need to document it for the development team.

**Sample Input** (design-session-notes.md):
```markdown
# Commerce Platform Redesign - Design Session

## Current Architecture
- Monolithic Java application
- PostgreSQL database
- Basic caching with Redis

## Proposed Architecture
- API Gateway for routing
- Separate services: Catalog, Cart, Checkout, Orders
- Event-driven communication via Kafka
- Each service owns its data

## Key Decisions
- Go with Kubernetes for orchestration
- Use GraphQL for frontend API
- PostgreSQL for transactional, MongoDB for catalog
- Auth via OAuth 2.0 + OIDC

## Non-functional Requirements
- 99.9% availability
- <200ms p95 latency
- Handle 10k concurrent users
- GDPR compliant

## Open Items
- Observability stack selection
- CI/CD pipeline design
- Data migration strategy
```

**Command**:
```bash
forge generate architecture --input design-session-notes.md --mode architecture --format html,pdf
```

**Expected Output**: Comprehensive architecture document with:
- Executive summary
- Context and scope (C4 Level 1)
- Container diagram descriptions (C4 Level 2)
- Component specifications
- Data flow descriptions
- Deployment architecture
- Security considerations
- ADRs for key decisions

---

#### Use Case 2.2: Architecture Decision Record

**Scenario**: You need to document why the team chose Kafka over RabbitMQ for event streaming.

**Sample Input** (kafka-decision.md):
```markdown
# Event Streaming Decision Context

## The Decision
Need to choose event streaming platform for new architecture

## Options Considered
1. Apache Kafka
2. RabbitMQ
3. AWS SQS + SNS

## Evaluation Criteria
- Throughput: Need 100k msgs/sec
- Durability: Events must persist for replay
- Ordering: Strict ordering required per partition
- Team expertise: Some Kafka experience
- Cost: Self-hosted preferred (already have K8s)

## Analysis
Kafka wins on throughput and durability
RabbitMQ easier but lower throughput
AWS SQS simpler but vendor lock-in

## Recommendation
Apache Kafka with Strimzi operator on K8s
```

**Command**:
```bash
forge generate adr --input kafka-decision.md --format markdown,html
```

**Expected Output**: Structured ADR with:
- Title and status
- Context
- Decision
- Consequences (positive and negative)
- Alternatives considered
- References

---

### Category 3: Thought Leadership Content

#### Use Case 3.1: Industry Trend POV

**Scenario**: You've been observing a shift in how enterprises approach AI adoption and want to write a thought piece about it.

**Sample Input** (ai-observations.md):
```markdown
# Observations on Enterprise AI Adoption

## What I'm Seeing
- Lots of POCs, few production deployments
- Executives excited, middle management skeptical
- Data teams overwhelmed with requests
- Governance lagging behind experimentation
- Vendors overselling, customers disappointed

## Questions I'm Wrestling With
- Is the current AI hype cycle different from previous ones?
- Why do enterprises struggle to move from POC to production?
- What separates successful AI adopters from the rest?

## Patterns I've Noticed
- Companies with strong data foundations do better
- Executive sponsorship necessary but not sufficient
- Starting with internal use cases reduces risk
- Change management often overlooked

## What I Used to Think
AI adoption is primarily a technology problem

## What I'm Starting to Think
It's fundamentally an organizational change problem
```

**Command**:
```bash
forge generate pov --input ai-observations.md --mode thought-leadership --format html,word
```

**Expected Output**: 800-1200 word POV with:
- A controlling point made clear within the first 150 words
- Personal observations only where the supplied source assigns them to the author
- Evidence and uncertainty scoped to what the source supports
- A form that serves the argument without a required question, evolution beat, or closing shape

---

#### Use Case 3.2: Long-Form Strategy Paper

**Scenario**: You want to write a comprehensive paper on the future of retail technology.

**Sample Input** (retail-research.md):
```markdown
# Retail Technology Evolution - Research Notes

## Key Trends
- Unified commerce replacing omnichannel
- AI-powered personalization at scale
- Sustainability as competitive advantage
- Composable architecture adoption
- Real-time inventory visibility

## Interviews and Conversations
- CTO at major retailer: "We're 3 years from AI-first experiences"
- Analyst: "Most retailers can't execute their digital vision"
- Startup founder: "The winners will be platforms, not products"

## Tensions and Contradictions
- Personalization vs privacy
- Speed of innovation vs stability
- Customer experience vs operational efficiency
- Physical retail decline vs experience economy rise

## My Evolving Thesis
The retail technology winners will be those who solve the last-mile data problem—not just getting data, but activating it in real-time at the point of decision.

## Questions to Explore
- Is composable architecture overhyped?
- How will generative AI change the shopping experience?
- What role will physical stores play in 10 years?
```

**Command**:
```bash
forge agent generate paper --input retail-research.md --research --iterate --format pdf,html
```

**Expected Output**: 3000-8000 word strategy paper with:
- An earned opening and a controlling point made clear early
- Multiple sections exploring different angles
- Evidence from research and experience
- Clear claims with uncertainty limited to the evidence boundary
- Specific examples and case references
- Thoughtful conclusion without prescriptive mandates

---

### Category 4: Agentic Workflows

#### Use Case 4.1: Research-Enhanced Content

**Scenario**: You need to write about a topic but want current context from the web first.

**Step 1: Gather Research**
```bash
forge agent research "enterprise AI governance frameworks 2024" --output research.json
```

**Expected Research Output** (research.json):
```json
{
  "webResults": [
    { "title": "NIST AI Risk Framework", "snippet": "...", "url": "..." },
    { "title": "EU AI Act Implementation Guide", "snippet": "...", "url": "..." }
  ],
  "facts": [
    { "claim": "80% of enterprises lack formal AI governance", "source": "..." }
  ]
}
```

**Step 2: Generate with Research Context**
```bash
forge agent generate pov --input observations.md --research --format html
```

---

#### Use Case 4.2: Iterative Refinement

**Scenario**: You have important content that must meet voice quality standards.

**Command**:
```bash
forge agent generate brief --input critical-brief.md --iterate --max-iterations 5 --format word
```

**Expected Behavior**:
1. Initial generation
2. Voice score check (e.g., 5.5/10)
3. Targeted revision based on feedback
4. Re-check (e.g., 6.2/10)
5. Strategic revision
6. Re-check (e.g., 7.3/10)
7. Approved - output generated

**Console Output**:
```
🚀 Starting agentic workflow...
📝 Initial draft complete (voice score: 5.5/10)
🔄 Iteration 1: Targeted fixes
📝 Revision complete (voice score: 6.2/10)
🔄 Iteration 2: Strategic revision
📝 Revision complete (voice score: 7.3/10)
✅ Voice approved!
📤 Exporting to word...
✨ Complete!
```

---

### Category 5: Multi-Format Publishing

#### Use Case 5.1: One Source, Multiple Outputs

**Scenario**: You have a strategy document that needs to go to different audiences in different formats.

**Command**:
```bash
forge agent publish strategy.md --format markdown,html,docx,pdf,pptx
```

**Expected Outputs**:
- `strategy.md` - For version control
- `strategy.html` - For web viewing
- `strategy.docx` - For Word editing
- `strategy.pdf` - For distribution
- `strategy.pptx` - For presentation

---

## Common Patterns

### Pattern 1: Meeting Notes to Deliverable
1. Capture notes during meeting
2. Clean up into structured markdown
3. Run Signal Forge with appropriate type
4. Review and iterate

### Pattern 2: Research to Publication
1. Use `forge agent research` to gather context
2. Combine with your observations
3. Generate with `--research --iterate`
4. Publish to multiple formats

### Pattern 3: Draft to Final
1. Generate initial draft without editing
2. Make manual adjustments
3. Re-run through Signal Forge for polish
4. Export to final formats

---

## Tips for Each Use Case

### For Executive Content
- Include stakeholder context in input
- Specify audience if non-obvious
- Use advisory mode explicitly if auto-detect fails
- Review recommendations for accuracy

### For Technical Content
- Include specific technical decisions made
- Note non-functional requirements
- Provide context on constraints
- Review diagrams for accuracy

### For Thought Leadership
- Include your evolving thinking
- Note questions you're wrestling with
- Share what changed your mind
- Ground in specific experiences

### For Agentic Workflows
- Use `--research` for current context
- Use `--iterate` for important content
- Use `--memory` for ongoing projects
- Check voice scores in output
