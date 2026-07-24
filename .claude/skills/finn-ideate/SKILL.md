---
name: finn-ideate
description: Research one Linear project per pass and file up to 3 cited candidate ideas as `idea`-labeled issues. Use when asked to run Finn-loop's ideation loop or research what can be added to the business. Designed for /loop; unattended-safe; one pass covers one project.
---

# Finn-loop ideator

One pass = one project researched, with at most 3 new candidate ideas filed.
Under `/loop`, each iteration runs this skill once. Ideation sits *before* the
spec stage: **ideate → human triage → /finn-spec → agent-ready → build →
review**. An idea issue is raw input for triage, never a spec.

## 1. Pick a project (stateless round-robin)

Using the Linear connector, list all projects across both teams (`ENG` and
`Business`), excluding projects whose status type is `completed` or
`canceled`. For each remaining project, find the created date of its newest
issue labeled `idea`. Pick the project with **no** prior idea issues, or
failing that, the one whose newest idea issue is oldest. No state file: the
issues themselves record the rotation.

Skip a picked project and move to the next candidate when:

- it already has **8 or more open `idea` issues** (queue full — the human has
  not triaged; adding more only buries them), or
- its description marks the relevant work as out of scope for Linear (e.g.
  per-lead outreach approvals live in ClickUp; pre-win pipeline lives in the
  SharePoint/ClickUp CRM). Respect those boundaries — never ideate work into a
  project whose description sends it elsewhere.

If every project is skipped, say so and end the pass. Do not force ideas.

**Workspace cap guard:** the Linear free plan allows 250 active issues. If the
workspace has more than 200 active issues, file nothing, report the count, and
end the pass so a human can triage or archive first.

## 2. Research

Ground every idea in evidence from both directions:

- **Internal:** the project's full description (`get_project`), its open and
  recently completed issues, related memory files under
  `~/.claude/projects/-Users-nouser-equacore-website/memory/`, and — for
  Engineering projects — the relevant repo.
- **External:** targeted web research on the project's theme: market and
  competitor moves, the Nigerian/West-African ITSM, compliance, and talent
  landscape, pricing signals, and tooling trends. Keep the source URLs; every
  idea must cite at least one piece of evidence.

Look for gaps between what the project is trying to achieve and what the
outside world shows is possible or expected — not for generic best practices.

## 3. Dedupe before filing

For each candidate idea, search the project's existing issues (open and
recently closed) by topic. Drop any candidate that duplicates an existing
issue, restates something the project description already plans or has
explicitly rejected, or merely rephrases another candidate from this pass.

If nothing survives, that is a clean no-op: report "no new ideas for
PROJECT" and end the pass. Never invent filler to have something to file.

## 4. File

Create at most **3** issues in the picked project, on that project's own team.
Each issue:

- Backlog state, unassigned, no priority, label `idea` and nothing else.
- Title starts with `Idea:` followed by a specific claim, not a theme.
- Body uses exactly these sections (this is deliberately NOT the finn-spec
  template — no `AC-N`/`NG-N` ids, so it can never be mistaken for a spec):

```md
## Opportunity

What could be added or improved, and for whom. Two or three sentences.

## Evidence

- Internal: what in the project/memory/repo points at this gap
- External: source links backing the market claim

## Why now

What makes this timely — a deadline, a competitor move, a dependency
that just cleared, a cost that compounds.

## Suggested next step

The single smallest action to validate or start this (often: run
/finn-spec on it, or a one-line experiment).

## Rough effort

S / M / L guess with one sentence of reasoning.
```

## 5. Report

End the pass with: project covered, ideas filed (identifiers + titles), ideas
dropped as duplicates, and any project skipped with the reason.

## Hard rules

- **Never apply `agent-ready`** — that label is the human-only gate into the
  build queue, and idea issues must stay invisible to `/finn-build`. Also
  never apply `blocked`, `loop-approved`, `loop-changes-requested`, or
  `needs-human-review`.
- Create-only: never edit, close, relabel, reassign, or reprioritize existing
  issues.
- The only external action is creating Linear issues. Web access is read-only
  research. Never message anyone, never touch the repo, never change n8n,
  ClickUp, or SharePoint.
- Never propose ServiceNow "partner/authorised/certified" positioning in idea
  copy (the trademark rule binds ideas too); Halo partner language is allowed.
- No secrets in Linear: nothing from `INFRASTRUCTURE.md` or credential files
  ever appears in an issue body.
