# Thought Leadership Voice — Canonical Reference

This file is a pointer. The canonical voice guide lives in the blog repo.

**Canonical:** `~/Workspace/dev/sites/nino/blog/docs/signal-dispatch-voice-guide.md`

- **Version:** 1.8 (2026-09-07 — remove form quotas and arbitrary rewrites; keep evidence and attribution protections)
- **Source:** Empirical analysis of 156 blog posts, recent-post audit, held-out generation test, and cross-register audit against Slack and email

## Why this file exists

A prior copy of the voice guide (v2.0, 2025-03-15, 569 lines) lived here. Despite the higher version number, it was older and shorter than the blog-repo guide. Maintaining two copies invited drift — edits to one would not propagate to the other, and downstream tools could not tell which was current.

The blog-repo guide is the source of truth. This file exists so historical references resolve to a clear redirect.

## Resolved references

- `tools/forge-signal/.claude/CLAUDE.md` → references `/docs/voice/thought-leadership-voice.md` (this file)
- `tools/forge-signal/.claude/skills/thought-leadership/references/signal-dispatch-voice.md` → symlinks to this file

Both surfaces redirect to the canonical via this pointer.

## How to use

For thought-leadership generation in forge-signal, read the canonical guide directly. Apply its hierarchy before any voice markers: evidence → reader/job → argument → cognitive load → voice → surface mechanics. Do not re-copy its contents back into this file — that re-introduces the drift this pointer was made to prevent.

If the canonical path moves, update this pointer.
