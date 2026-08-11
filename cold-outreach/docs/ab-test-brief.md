# Copy experiment brief — and why the A/B I proposed doesn't work yet

**Written 2026-08-10.** This supersedes the "A/B hand-written vs AI-drafted" proposal in SCP-4.
Two problems with that proposal only became obvious once I worked the numbers.

## The question worth answering

The Maker School doctrine (`My-Coy/.../PLAYBOOK.md` line 19), drawn from ~10k alumni, says:

> NEVER use AI to write outreach copy — AI tells kill reply rates.

Our entire drafting pipeline is Claude + a DeepSeek humanizer. Our one measured campaign
returned **0.8%** (123 prospects, 365 emails, 1 reply, 0 positive) against a ≥2% bar.

If the doctrine is right, most of what was built on the drafting side is the wrong lever, and
the fix is a person writing three emails. That is worth knowing before scaling anything.

## Problem 1 — an AI cannot write the control arm

I offered to draft the "hand-written" sequence. That would have made **both arms AI-written**
and the experiment would have measured nothing except two prompts against each other.

**The control must be written by Emeka.** Not by Claude, not by Codex, not "written by a human
and polished by AI" — polish is where the tells enter. If nobody has 30 minutes to write three
short emails, the experiment cannot run, and that is a legitimate answer.

## Problem 2 — we cannot power an A/B at this volume

This is the one that changes the recommendation.

| | |
|---|---|
| send envelope | 21 emails/day |
| emails per lead | 3 |
| new leads reached | ~7/day |
| baseline reply rate | 0.8% |
| target | ≥2% |

Detecting a difference between ~1% and ~3% at conventional confidence needs on the order of
**several hundred prospects per arm**. At ~7 new prospects/day split across two arms, that is
**months** before the result means anything — and the arms would drift, because we are changing
the pipeline weekly.

Running a split now would produce a number that looks like evidence and isn't. That is worse
than not measuring, because it would be acted on.

## Recommendation instead

**Do not split. Ship one arm and measure it against the absolute bar.**

1. **Emeka writes one sequence by hand.** Three emails, same structural constraints as the
   machine's output so the comparison to the 0.8% baseline stays fair (below).
2. Run it as the **only** sequence for the pilot.
3. Compare its reply rate to the **0.8% baseline we already have**. That baseline is a real
   historical control — 365 emails of AI-drafted copy — so a before/after against it is far
   better powered than a same-period split, and costs nothing to collect.
4. If it clears 2%, the doctrine was right and hand-written copy becomes the standard, with the
   machine reserved for research and personalisation inputs.
5. If it lands at ~1%, copy is not the binding constraint and the problem is upstream — list
   quality, offer, or targeting.

A true A/B only becomes worth running once volume is an order of magnitude higher.

## Constraints the hand-written sequence must respect

These are enforced by `cold-outreach/lint/draft-solidity.js`, so a draft that breaks them will
be blocked whoever wrote it:

- **Email 1** ≤70 words: greeting, one specific opener, **one question**. No pitch, no meeting
  ask, no link.
- **Email 2** ≤90 words: why you asked, one concrete HaloITSM/HaloPSA reason, then the offer —
  *"I'll map your current service desk against HaloITSM and show you the cost difference in 5
  working days. Just send me the tool you're on now and rough monthly ticket volume."*
- **Email 3** ≤35 words: is this yours, or who owns it.
- Every email opens `Hello {{FIRST_NAME}},` — the literal token, never a real name.
- Every email ends with the exact footer (identity, address, website — no unsubscribe line).
- Never write bare "Halo"; always HaloITSM or HaloPSA.
- No refund or money-back promise — EquaCore implements Halo, it does not own it.
- No figures that aren't backed by a real case study.

Personalisation (the opener) can still be machine-generated per lead from research — the
doctrine's objection is to AI writing the *body*, and that is the part worth testing.

## What has to exist before any of this is measurable

Currently missing, both on Phase B:

- a **per-send event log** (`taskId, email, step, sentAt, variant`) — without it nothing can be
  cohorted by date;
- a **`variant` field** on `Cold Outreach Sends`, set at draft time, so a sequence can be
  attributed at all.

`Reporting - Outreach Weekly Retro` already computes reply rate and the ≥2% gate; it just has
no variant or date dimension to slice by.
