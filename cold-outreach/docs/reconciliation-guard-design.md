# Design: Standing Reconciliation Guard + Bounce Handling

Date: 2026-07-11
Status: Approved for implementation

## Context

On 2026-07-11 a ClickUp bulk status-change (24 Pipeline-1 cards moved to Approved at once)
silently bypassed the Approve Handler's webhook trigger — ClickUp does not fire per-task
webhooks on bulk moves, only on single-card moves. This was diagnosed and repaired with two
one-off backfill workflows (`xQZuSkFIuOFhbMT5`, `eA0L565CkOMBOd1v`), which drained the backlog
(1 lead recovered via Lusha; 23 not in Lusha's database, left in Approved for manual triage).

The operating rule going forward is **approve cards individually, never via bulk-select** —
that's what makes the webhook fire. This design adds an automated safety net for whenever that
discipline lapses (or any other silent webhook miss), plus closes a related gap in bounce
handling discovered during the same investigation.

Two independent pieces:
1. A new standing workflow that periodically detects and repairs the exact incident type.
2. A fix to an existing dead code path in the Reply/Opt-out Watcher for bounced emails.

## Part 1 — Reconciliation Guard workflow

**New workflow:** "Reconcile - Approved Backlog Guard" (built inactive, activated after a
successful manual test run).

**Trigger:** Schedule Trigger, cron `0 9-17/3 * * 1-5` → fires 09:00, 12:00, 15:00 Lagos-relative,
weekdays only. Matches the Cadence Scanner's existing business-hours cron style
(see [[n8n_credit_audit_2026_07_11]] — schedule triggers cost credit every tick, so this stays
bounded rather than 24/7 or high-frequency).

**Scope (deliberately narrow):** only the exact incident type — a ClickUp card with status
Approved that has no matching `active`/`completed` row in the send-state data table. Does NOT
check for stalled Sent cards, orphaned data-table rows, or duplicate-processing cases. Those are
explicitly out of scope for this iteration.

**Node flow:**
1. Schedule Trigger (cron above)
2. ClickUp: list tasks in "Cold Outreach Review" (list `901219065232`, workspace `90121850569`,
   pass `workspace_id` per the known 2-workspace gotcha) filtered to status = Approved
3. Data Table: get all rows from "Cold Outreach Sends" (`S2B1Sdkckui4zzzO`)
4. Code — build a Set of `taskId`s with status `active`/`completed`; filter Approved cards to
   those NOT in that set → candidates
5. Code — cap candidates to **5 per run**; log count deferred to next run (no alerting — plain
   cap, not the hard-stop-alert variant)
6. For each candidate, same branch used by the Approve Handler:
   - Has email already (e.g. Apify-sourced lead) → skip Lusha entirely
   - No email → Lusha Search → Pick Best Contact → Lusha Enrich → Extract Email
     (empty-result searches are 0 credits — cards Lusha can't resolve cost nothing to retry)
7. Activate the row: email/firstName, status=active, step=1,
   `nextSendAt = now + index*15min` (staggers the batch so Cadence Scanner doesn't send all 5
   in one tick)
8. ClickUp: task update → Sent; task create in "New Leads" pipeline (`901219065860`) — mirrors
   the Approve Handler's existing steps exactly
9. Cards where Lusha finds no match are left Approved, untouched, to be picked up again on a
   later run — self-resolving once you manually reject the card or add an email by hand

**Relationship to existing workflows:** does not modify Approve Handler, Cadence Scanner, or
Reply Agent. The two `(one-off)` reconcile drivers stay as-is (inactive) as manual break-glass
tools for a future large one-time drain that needs different pacing than this job's cap-of-5.

**Test plan:** build inactive, execute manually once against the current board. The 23 real
still-stuck Approved cards serve as a live test: capped at 5, most resolve to 0-credit no-match
(proving cap + skip logic), the other 18 are untouched. Then activate the schedule.

## Part 2 — Bounce handling (fix to existing workflow)

**Problem:** the Reply/Opt-out Watcher (`3LRLzQYNXItQ2Y3A`) already classifies inbound mail into
`unsub` / `auto` / `reply` routes. The `auto` route (which catches mailer-daemon/NDR/bounce
messages) is currently a dead end — "dropped, fallback unwired" — so delivery failures to dead
mailboxes are silently discarded and the cadence keeps trying to send to them.

**Fix:** wire the `auto` branch to, when the auto-reply is a bounce/NDR:
1. Data Table: update the matching send-state row to a terminal `bounced` status (Cadence
   Scanner's due-sends query already excludes non-active rows, so this stops the cadence)
2. ClickUp: update the card to Rejected + comment noting the bounce and the sending address

This reuses the data-table and ClickUp nodes/creds already present in that workflow (same
pattern as the existing `unsub` branch) — no new credentials or external services.

**Test plan:** additive-only change to a branch that currently does nothing, so a bug here can't
regress the reply/unsub handling that already works. Activate and confirm against the next real
bounce (or a deliberately-seeded bad-address test row if one arrives sooner).

## Built + verified (2026-07-11)

- **Workflow ID `FTcVTaHC0MnAoUt7`** ("Reconcile - Approved Backlog Guard"), built via n8n Workflow SDK, credentials wired (ClickUp `u6QskCANdJE2ZfMQ`, Lusha `mpPiRn6tEUECh7PK`). One deviation from the plan: the "capture $now once via a Set node" idea was dropped in favor of just calling `Date.now()` inline inside the single `Cap To 5 And Stagger` Code node (`runOnceForAllItems` executes once per run, so this is safe and matches the existing one-off drivers' own idiom) — simpler, no behavior difference.
- **Manual test execution (execution 2294):** Find Mismatches correctly identified the same 23 known stuck Approved cards. Cap-to-5 + 15-min stagger worked correctly (`10:11, 10:26, 10:41, 10:56, 11:11`). All 5 routed to the no-email/Lusha branch; all 5 Lusha searches returned 0 results at 0 credits charged; the chain correctly stopped there with zero side effects (proves the "no match → leave untouched" safety behavior).
- **Not exercised by live data:** the merge → activate row → flip card → create pipeline lead repair path, since no card in the current backlog has a resolvable Lusha contact. Those nodes are near-verbatim copies of code already proven in production today (Approve Handler `hQaJ9ozahTAQ95qI` and the one-off Lusha Backlog Driver `eA0L565CkOMBOd1v` both successfully ran this exact logic on real leads, e.g. Aspira, Baywood Continental, this morning).
- **Cleanup action (user-directed, 2026-07-11):** rather than let the Reconcile Guard keep re-checking the 23 confirmed-unresolvable cards indefinitely, all 23 were moved to Rejected directly via ClickUp API (individual per-card calls, not a bulk-select — no webhook risk) with a comment noting the Lusha-not-found reason. They fall out of the Reconcile Guard's scope automatically going forward since it only considers cards with status Approved.
- **Activated:** schedule now live, `0 0 9-17/3 * * 1-5` (every 3h, business hours, weekdays).

## Out of scope (explicitly deferred)

- Sent-card stall detection (cards marked Sent whose row isn't actually active/completed)
- Orphaned data-table rows with no matching ClickUp card
- Duplicate-processing detection (Pending Review card that already has an active row)
- Suppression-list write on bounce (only the immediate card/row are updated; discovery dedup
  against bounced addresses is a separate future improvement if it becomes a recurring problem)
