---
status: proposed-library-role
date: 2026-08-02
---

# Forge Signal's role in the Work Library

## Decision

Use Forge Signal to shape source material into audience-appropriate work
products. Do not make it responsible for deciding which claims are true, which
source is canonical, who approved an output, or who may read it.

Forge Signal is a production tool in the research-to-decision workflow. Work
Library is the governed publication and retrieval surface.

## What Forge Signal contributes

The source repository defines four writing modes with different jobs:

- thought leadership for provisional, narrative work;
- solution architecture for precise technical decisions;
- executive advisory for briefs, decks, and roadmaps; and
- documentation for tutorials, guides, explanations, and reference material.

It also supplies reader contracts, voice checks, research and iteration paths,
multiple export formats, presentation themes, and an extensible registry for
new modes and templates.

## What stays outside it

Forge Signal should not:

- promote a hypothesis into evidence;
- choose a source revision for publication;
- record human authorization on its own output;
- decide whether a draft is current or superseded;
- set Work Library routes or access policy; or
- treat a successful export as proof that the reader's job was completed.

Those are source-account and Work Library responsibilities.

## Practical handoff

```text
Canonical research and decisions
  → Forge Signal mode + reader contract
  → brief, deck, document, site copy, or video
  → source-owned review and lifecycle
  → exact Work Library projection
```

The handoff works only when the generated artifact returns to the owning
repository before publication. A file left in an agent session or hosted draft
has no durable authority merely because it looks finished.

## Evidence boundary

The repository contains the CLI, built-in modes, provider integrations,
exporters, templates, reader-contract support, and reference documentation. Its
presence and buildability do not prove that every generated artifact is clear,
factually correct, or approved. Those qualities remain artifact-specific.
