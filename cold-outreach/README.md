# EquaCore Cold Outreach Automation

Outbound lead-gen engine: discover ICP-fit companies → scrape → qualify → draft
personalized cold emails → review → send a 3-step sequence from `sales@equacoredigital.com`
(Zoho SMTP).

**Status (2026-08-10):** Phase A and Phase B are both **live and sending**. See
`docs/spec.md` for the design and the decisions log.

> **The live n8n instance is the source of truth, not this folder.** Other agents edit
> `voidnox.app.n8n.cloud` directly, and git commit dates do not bound when the automation
> last changed. Check workflow `updatedAt` and version history before trusting anything here.

## Pipeline

1. **Discover** — `Phase A - Discovery` (weekly, Mon 08:00) writes candidate companies and
 creates ClickUp review cards.
2. **Scrape / enrich** — `Phase A2*` Apify + Google Maps scrapers feed the `Apify Lead DB`
 data table. Lusha enrichment runs later, at approval time.
3. **Qualify** — `Phase A3`, daily 07:00: DeepSeek agent hard-drops non-ICP leads.
4. **Research, then draft** — `Shared - Company Research` Firecrawl-scrapes the company site and
 returns evidence-bound pain points; Claude Sonnet writes the 3-step sequence using at most one
 of them, **as a question, never asserted as fact**; a **DeepSeek humanizer pass** then rewrites
 it. Research sits upstream of the humanizer by design, so no enrichment path can bypass it.
 See `prompts/draft-email-prompt.md`, which is generated from the live workflow.
5. **Review queue** — a **ClickUp card** per lead (list `901219065232` Nigeria,
 `901219526986` other markets), status `Pending Review`; the send state lands in the
 `Cold Outreach Sends` n8n data table with `status = pending_review`.
6. **Approval** — moving the card to **Approved** fires `Phase B - Approve Handler`, which
 enriches the contact via Lusha and flips the row to `status = active`.
7. **Send** — `Phase B - Cadence Scanner` (hourly, Tue–Thu 10:00–16:00 Lagos) sends the due
 step over Zoho SMTP, max 35 per run, 3 days between steps.
8. **Replies** — `Phase B - Reply Agent & Opt-out Watcher` (IMAP) classifies replies,
 stops the sequence, handles unsubscribes and bounces, logs to `Outreach Reply Insights`,
 and drafts a response for approval before anything goes back to the prospect.

## Autonomy — current state (2026-08-12): FULLY AUTONOMOUS

**The loop is closed.** On Emeka's explicit instruction (2026-08-12) the pipeline reviews,
verifies, promotes, approves and sends without a human in the loop. The first two fully
autonomous approvals (zero human touches from review to release) ran the same day, and the
fail-closed path proved itself on the very first pass: a third candidate whose lineage did
not survive verification was refused with explicit reasons and left untouched for retry.

### The autonomous chain

`Phase A3`'s review trigger (Tue–Thu 07:00 Lagos) drives the whole loop:

1. Read the 10 oldest `pending_review` rows → deterministic hard-pass gate →
   DeepSeek review agent → **independent Claude verifier**. Both must approve.
2. `Select Promotion Batch` caps promotions at **2 per run** — sized so the full run stays
   under the platform's hard **300-second ceiling on trigger executions** (measured: three
   promotion legs took 255s in manual mode, and trigger mode runs ~18% slower).
3. Each surviving card gets **fresh lineage** via `Phase A4e - Live Single-Task Verification
   Lineage`: A4 contact verification → A4c live LinkedIn employment corroboration →
   A4b research-grounded redraft to the offer contract. Single-task by construction —
   it throws on arrays, so one call can never fan concurrent promotions.
4. `Phase A6` calls the `Phase A5` evaluator against every safety control and, only on
   `eligible`, writes the production verification and approved-sequence rows. A6 is
   idempotent across crash/retry (resume/complete state machine; duplicate writes refused).
5. **Only `promoted: true` flips the card to Approved** — the flip fires the existing
   `Approve Handler` webhook, which re-checks every gate before activating the send row.
   A refused promotion leaves the card in `pending review`; the next scheduled run retries.

Sends then leave via the unchanged `Cadence Scanner` envelope: hourly Tue–Thu 10:00–16:00
Lagos, max 3 deliveries per run, first send of any sequence lands at the next 10:00 slot.

### Identity gates — matching semantics fixed 2026-08-12 (Emeka-approved per action)

Three verification gates were refusing genuinely-verified contacts on string hygiene, which
is why no candidate had ever cleared the chain:

- **Person names** (A4c): exact-match failed on credential suffixes and middle names
  ("Segun Aboderin, MBA" ≠ "Segun Aboderin"). Now token-subset: every token of the card's
  contact name (min 2) must appear in the LinkedIn profile name. A different person still
  fails; company match remains a separate mandatory leg.
- **Company names** (A4b research gate): raw-string aliases failed on legal suffixes
  ("…Ltd" vs "…Plc") and multi-domain companies. Now uses the same legal-token-stripping
  normalizer as A4c, plus a third leg: research's canonical company equals the card company.
- **The offer contract was restored to A4b.** Its lint had lost the offer-in-email-2 rule
  and its drafting prompt capped email 2 at 35 words (the offer needs ~25 — it could never
  fit). Both realigned to the documented contract; the lint now blocks offer-less copy.

None of these weakened a gate: a wrong person or wrong company still fails every leg.

### Self-monitoring

- `Ops - Reply Capture Canary` (every 30 min, Mon–Fri 06:00–17:30 Lagos) sends an
  unsubscribe to our own sales inbox, verifies the Reply Agent classifies and claims it,
  and restamps `reply_capture_verified` with real evidence. The 1-hour freshness gate on
  sending is therefore live-proven, not hand-stamped. The window deliberately starts at
  06:00 so the 07:00 review run always sees fresh proof — before this fix the two schedules
  never overlapped and every autonomous promotion would have been refused.
- `Ops - Pipeline Failure Log` engages the emergency stop only on **persistent** failure:
  transient errors (429/5xx/socket) must recur 3× within 60 minutes for the same workflow;
  non-transient errors still engage immediately. Critical ClickUp calls retry 5×5s.
  (Previously a single transient 429 latched the stop with no way back — that one fault
  silently blocked all sending for two days.)

### The production send gate (unchanged in spirit, now satisfiable)

`Approve Handler` still requires a persisted production verification (`decision=approve`,
`shadowMode=false`, all booleans true, confidence ≥95) plus a bound, active, in-date
approved sequence. The difference is that A6 now writes those rows through the real
pipeline — the gate opens on merit instead of never.

## Data stores

| Store | ID | Purpose |
|---|---|---|
| `Cold Outreach Sends` (n8n data table) | the workflow | Send state — drafts, step, `nextSendAt`, status |
| `Apify Lead DB` (n8n data table) | the workflow | Scraped leads, `pipelineStatus` |
| `Outreach Reply Insights` (n8n data table) | the workflow | Reply intent / escalation log (added 2026-08-08) |
| `Outreach Verification Decisions` (n8n data table) | the workflow | Contact-verification evidence ledger; gates production sends (added 2026-08-10) |
| `Outreach Suppression` (n8n data table) | the workflow | Email/domain suppression, checked pre-send by the Cadence Scanner (added 2026-08-10) |
| `Outreach Reply Messages` (n8n data table) | the workflow | Message-ID/fallback-key claim scaffold before inbound routing. The trigger remains `UNSEEN`; do not switch to `ALL` until the ledger is safely seeded or IMAP watches a bounded dedicated folder. |
| ClickUp lists `901219065232` / `901219526986` | — | Human review queue (Nigeria / other markets) |

`status` values on `Cold Outreach Sends`:

| status | meaning |
|---|---|
| `pending_review` | drafted with real research evidence; awaiting approval |
| `needs_research` | **cannot proceed as-is** — no verifiable contact, or no company research evidence. Card stays at `pending review` in ClickUp; the autonomous pass skips it |
| `active` → `completed` | in the send sequence / finished |
| `paused_pending_verification` | was active, paused until the verification gate opens |
| `approved_pending_verification` | card approved but no verified authorization exists yet |
| `sent_unverified` | card says sent, no send record exists — quarantined for human resolution |
| `rejected` | genuine disqualification (out of ICP, competitor, suppressed) |
| `replied` · `unsubscribed` · `bounced` | terminal outcomes |

`Apify Lead DB.pipelineStatus`: `new` → `queued`, plus `needs_email` (scraped without an
address; queued for AnyMailFinder enrichment) and `rejected`.

## Company research — `Shared - Company Research`

One sub-workflow, called by **both** Phase A3 and the A4b redraft path, so fresh drafts and
re-manufactured backlog cards meet the same standard. Firecrawl scrapes the company site →
signals are extracted → a DeepSeek agent returns evidence-bound pain points.

Returns `painPoints`, `painPointConfidence`, `hasPainPointEvidence`, `evidence`, `siteFetched`,
`sitePlaceholder`, `siteVendors`, `canonicalCompany`, `canonicalDomain`, `companyAliases`.

Three defects found by executing it against real sites, all fixed and re-verified:

- **Truncation hid the signal.** Vendor and careers detection ran on the first 6000 chars, but
 OEM partner lists and careers links live in the footer. Now detected across the whole page.
- **Markdown stripping removed vendor names.** Partner logos carry their name only in image
 **alt text**, which the de-markdown discarded. Alt text is now preserved. Together these two
 turned `vendors=[]` into `vendors=[freshservice, manageengine, motadata]` on a real lead.
- **A parked server was certified as evidence.** An unconfigured host returning
 *"Apache2 Ubuntu Default Page: It works"* produced `hasPainPointEvidence: true` — invented
 research. Placeholder pages (Apache/nginx defaults, `Index of /`, parked, under-construction)
 now set `siteFetched: false`, and `hasPainPointEvidence` is hard-gated on `siteFetched`.

**Canonicalization.** `uridiumtechnologies.com` redirects to `uridiumgroup.com`, so a contact
verified at "Uridium Group" would look like a company mismatch against a card for "Uridium
Technologies". `companyAliases` carries both names and both domain roots, resolving it once
upstream instead of weakening the lint with fuzzy matching.

## Models

- **Qualify:** DeepSeek `deepseek-chat`.
- **Draft:** **Claude Sonnet**, followed by a DeepSeek humanizer pass.
- **Reply agent:** Claude. **Autonomous reviewer / nickname casualizer:** DeepSeek.

### The `{{FIRST_NAME}}` token is never resolved at draft time

Every stored body greets `Hello {{FIRST_NAME}},` — the literal token, braces and all. It is
resolved **once, at send time**, by `Compute Due Sends` in Cadence.

This is load-bearing, not cosmetic. A name baked in at draft time is frozen: if verification
later corrects the contact, the body still greets the previous person, and a wrong-name email
is worse than no email.

Both prompts ask the model to preserve the token and **the humanizer strips it anyway** —
observed on real output (exec 3594 returned `Hello Hafsat,`). So `Parse Humanized Draft`
coerces the greeting back to the token deterministically, using the same normalisation
`Parse Draft` applies upstream. Verified live: all 9 drafts in exec 3630 carried the token.

Never make this invariant depend on an LLM following an instruction — it does not.

## Rate reconciliation — draft rate is bound to send rate

Production must not exceed consumption, or every run just inflates a queue that is already
599 deep while burning 1 Firecrawl credit + 1 Claude call + 2 DeepSeek calls per lead.

**The live knob is `pilot_sends_per_run.limit`, not `send_pilot.limit`.** `Build Send Controls`
reads `send_pilot` for its `.state` only and takes the number from `pilot_sends_per_run`;
nothing anywhere reads `send_pilot.limit`. Both currently say 3, so the envelope is correct —
but tuning the wrong one changes nothing, silently.

| | |
|---|---|
| send envelope | 21 emails/day (`pilot_sends_per_run.limit` 3 × 7 runs) |
| emails per lead | 3 (opener + 2 follow-ups) |
| **steady-state new leads** | **~7/day** |
| `Prep Leads` batch | **10/day** — headroom for qualifier drops and `needs_research` attrition |

It was **50/day**, which is ~7× send capacity, and made a single Phase A3 execution ~8.5
minutes (measured: ~24s marginal per lead). At 10 it is ~4 minutes.

**If the send envelope changes, this must change with it.** The two numbers are coupled through
`emails per lead`, and nothing enforces the relationship automatically.

A long run is survivable but not free: if Phase A3 dies partway, leads already processed are
`queued` and the rest stay `new`, so the next day's run picks up the remainder. Failures are
logged to `Ops Failures`.

## Send envelope — the coupling you must not break

`Phase B - Cadence Scanner` sends at most `pilot_sends_per_run.limit` emails **per run**, and runs on
`0 0 10-16 * * 2-4` — **7 runs per send day**.

| | |
|---|---|
| `pilot_sends_per_run.limit` (in `Automation Controls`, the workflow) | **3** |
| runs per day | 7 |
| **daily maximum** | **21** — inside the 20–30/day deliverability ceiling |

**The delivery limit is per run, not per day.** Its value is only correct given the current trigger. It was
`25`, which meant **175/day** — roughly 6× the ceiling — because the number read like a daily
cap and wasn't one. If the trigger is ever retimed, this number must move with it or the
envelope silently breaks. The reason is recorded on the control row itself so it travels with
the data. Both production readers reject values above **4**, enforcing a maximum of 28
deliveries across the current seven daily runs.

Sends are additionally gated by six unique, versioned, fail-closed control rows. The state
rows must be `global_mode = production`, `autonomous_approval = enabled`,
`send_pilot = enabled`, and `emergency_stop = disengaged`; the two integer limits are
`pilot_active_campaign_cap` (approval population) and `pilot_sends_per_run` (delivery
selection). A persisted verification authorization and exact approved-sequence lineage are
also required. Current state is `shadow` / `disabled` / `disabled` / `engaged` — **nothing
can send.**

Cadence is schedule-only (`availableInMCP = false`) and has a five-minute execution timeout,
well below its one-hour trigger interval. Do not run it manually alongside a scheduled run:
the n8n Data Table receipt ledger has no unique constraint on `deliveryKey`, so it is an
idempotency barrier but not a distributed lock. Move receipts to a store with a real unique
key before supporting concurrent or externally triggered Cadence executions.

## Failure visibility

Every active workflow has `settings.errorWorkflow` pointing at `Ops - Pipeline Failure Log`, which writes to `Ops Failures`. Before 2026-08-10
**none** did — including the three website form handlers, so a failed contact-form or
demo-booking submission was silently lost.

Unacknowledged failures surface in the weekly retro as `pipelineFailures` with a per-workflow
breakdown in `notes`.

**Emergency-stop threshold (changed 2026-08-12):** the failure log engages the outreach
emergency stop only when a *transient* error (rate limit, 5xx, socket) recurs **3× within
60 minutes** for the same critical workflow; a non-transient error still engages it on the
first occurrence. Nothing disengages the stop automatically — that stays a human decision —
but a single rate-limit blip no longer halts sending permanently, which is exactly what
happened on 2026-08-11 (one ClickUp 429 silently blocked all sends for two days).

**A freshness check is only valid on a value something is committed to refreshing.** That
rule is now load-bearing: three separate 2026-08-12 outages traced to TTLs or "changed
recently" checks on rows nothing ever rewrote. If you add a freshness gate, add its writer
in the same change, and give liveness its own heartbeat column — never overload an
operator's `changedAt`.

**Testing note:** n8n fires `errorWorkflow` only for **trigger/production** executions. A manual
run that throws produces nothing, which looks exactly like a broken handler. Test error paths
with a real trigger.

## Measured performance — read this before changing anything

The campaign has already run once. Measured from live data on 2026-08-10 by
`Reporting - Outreach Weekly Retro` (weekly Mon 08:30, writes to
`Outreach Weekly Metrics` / the workflow):

| | |
|---|---|
| prospects contacted | **123** |
| emails sent | **365** |
| replies | **1** |
| positive replies | **0** |
| **reply rate** | **0.8%** |
| clears the ≥2% scale gate | **no** |

**365 emails produced one reply and zero positive replies.** The engineering around this
pipeline is sound; the *message* is unproven and its single real trial failed. Treat any
work that does not plausibly move reply rate as lower priority than work that does.

Two caveats built into the metric itself, not hidden:

- `Outreach Reply Insights` was created 2026-08-08 and is empty, so replies are counted from
 send-row `status` alone. **1 is a floor, not a true count.**
- There is no per-send event log and no sequence `variant` field, so nothing can be cohorted
 by week and A/B tests cannot be attributed. Both are open asks on Phase B.

### The offer (added 2026-08-10)

Doctrine from the MY-COY Maker School synthesis calls a real offer roughly a **10× reply
lever**, and the sequence previously had none. `email2` is now the offer email:

> "I'll map your current service desk against HaloITSM and show you the cost difference in
> 5 working days. Just send me the tool you're on now and rough monthly ticket volume."

`[thing]` = cost comparison · `[time]` = 5 working days · `[input]` = current tool + volume.

**It is free, deliberately.** The doctrine's formula ends "or your money back", but EquaCore
*implements* Halo and does not own it — a refund promise on the product is not EquaCore's to
make. A free deliverable needs no refund, and EquaCore can still guarantee its own labour.
`draft-solidity` **blocks** `money-back`, `refund`, `or you don't pay` in any body, because a
prompt instruction is not a guarantee.

Sequence shape is now **question → offer → routing**. Caps are `email1` **70**, `email2`
**95**, `email3` **35**, enforced by `lint/draft-solidity.js` and by `Lint Redraft` in A4b —
those two must stay byte-aligned, because when they drifted (A4b still holding email2 at 35,
the shape from before the offer moved) it rejected **97.1%** of the 592 queued drafts.

The 95 is measured, not chosen: across every draft the current contract has produced (n=12)
email2 runs 73–100, median 80. 55 was the original guess and 90 still rejected a third of
legitimate copy. The prompts ask for **75 with 90 as the cliff** — deliberately tighter than
the lint, because models cannot count words reliably and the gap absorbs the overshoot.
Widening the cap to match whatever the model produced would leave it meaning nothing.

**Generalisations may describe a class, never the reader.** "Most conglomerates running separate
tools per unit end up with slower escalations" is fine — it explains why we asked without
claiming to know anything about them. "Most banks **your size** run card requests, chat and
branch tickets through separate channels" is blocked: it asserts their actual setup as fact.

The rule is deliberately narrow (`your size`, `like yours`, `in your position/shoes`). The
independent verifier flagged the whole most/many/usually family; measurement across 31 real
offer-era drafts said otherwise — a broad ban rejects **94%** including honest framing, the
narrow form rejects **13%**, and every one of those four claimed specific knowledge of the
recipient. Enforced in `lint/draft-solidity.js`, `Lint Redraft` (A4b) and `Lint Redrafted Copy`
(backfill), and stated in the drafting prompt so it is not generated in the first place.

### Proof points

Prior work may be cited **only if supplied to the drafter**, never invented, and must be
attributed to the **person**, never to EquaCore as contracting firm — "our lead consultant ran
the ServiceNow rollout at a Tier-1 Nigerian bank", not "EquaCore delivered it". Claiming
contracts EquaCore did not hold is misrepresentation that fails on the first call.
`workbench/case-studies.md` equivalent is still empty, so **no figures ship today** — the
fabricated-number block in the lint stands until real numbers exist.

## Why the backlog has no contact emails — `Phase A - Discovery` is archived

`Phase A - Discovery (Nigeria ICP)` was **archived on 2026-08-10**. It was
not a discovery step — it was a **second, parallel drafting pipeline** with its own Claude
prompt, writing straight to ClickUp cards and send-state every Monday 08:00, with **no company
research, no pain points, no offer and no humanizer**, still carrying the pre-2026-08-10
footer. It violated both standing requirements while we enforced them elsewhere.

Its output was also structurally unusable. `Extract Companies` emitted, per company:

```json
{ "company": "Aspira Nigeria Ltd.", "website": "", "email": "",
 "signal": "Nigerian manufacturing company — likely runs internal IT and service operations." }
```

A name and a sector guess. No domain, no website, no contact, and a `signal` that is a template
string identical for every company in a sector — i.e. exactly the "sector inference" the
research gate is built to reject. 724 such companies in its final run.

**This is the origin of the backlog's missing-email problem.** Those cards never had contacts
because the source never had them. A name-only lead can never satisfy `siteFetched`,
`hasPainPointEvidence`, contact verification, or a send — so no amount of enrichment downstream
was going to rescue them cheaply.

`Phase A2 - Apify Lead Scraper` supersedes it entirely, returning company, domain, website,
full name, title, LinkedIn, company size and a **validated email**.

## Restoring lead supply

`Phase A3`'s main branch produces nothing because `Apify Lead DB` has **0 rows at
`pipelineStatus = new`** (all `queued`/`rejected`, last scraped 2026-07-14). The daily run
therefore ends in ~0.15s.

`Phase A2 - Apify Lead Scraper` is the refill mechanism. It was
prepared on 2026-08-10 and **deliberately left inactive**:

- `mode` was `test`, which routes to the ICP sample-scoring gate and **never inserts**. Now
 `full`, so it takes the insert path (`Normalize Leads → dedup → Insert Lead Row`).
- `totalCount` reduced 300 → **100** per run, sized to the compliance guidance of ~10–20
 sends/day rather than the queue's appetite.
- Added `Weekly Trigger (Mon 07:00 Lagos)`, offset from Discovery's Mon 08:00.
- **`country` is still `Ghana`** — a business decision, deliberately not changed. Set it
 before enabling.

**To enable:** confirm the country, then activate the workflow. Nothing else is required.
`Normalize Leads` already sets `pipelineStatus: 'new'`, and the Apify call filters
`email_status: ['validated']`, so new leads arrive with a real address — which is the fix
for the backlog's missing-email problem.

**Do not enable until** the verification gate is proven and the existing backlog is
draining; otherwise it grows a queue nobody is clearing, at real cost (Apify run + 1
Firecrawl credit per fit lead + a Claude and two DeepSeek passes each).

In `full` mode the ICP sample gate is skipped entirely — per-lead ICP screening is done
downstream by `Qualify Lead` in Phase A3, which does hard-drop non-fits (verified).

## Known issues (updated 2026-08-12)

- **Large stalled backlog** — **599** rows at `pending_review`, and the drainable rate is
 **zero** while sends are locked. Against a 300-row sample, ~48% clear the deterministic
 hard-pass; the rest fail, mostly for a missing contact email. Discovery is creating cards
 with no address on them.

 A3 now **stops drafting** when this exceeds 150 (`Get Pending Backlog` → `Prep Leads`
 returns nothing). 150 is ~3 weeks of inventory at the 21/day envelope ÷ 3 emails per lead.
 It resumes on its own as the queue drains — there is nothing to re-enable. Because a
 paused feeder and a broken feeder look identical from the outside, the weekly retro carries
 `pendingBacklog` and prints `A3 DRAFTING PAUSED` while the guard is holding.

- **Qualified lead pool is nearly dry** — `Get New Leads` returned 10 on 2026-08-10, down
 from 20. A2 needs a run before the pilot opens, or the feeder has nothing to draw on once
 the backlog drains.

- **Most queued cards still lack recorded research evidence.** The verifier correctly
 refuses copy whose claims have no stored grounding, so those rows cannot promote until the
 repair queue re-researches and redrafts them. `Backfill - Redraft Queue to Offer Contract`
 runs **3× daily (05:00 / 13:00 / 21:00 Lagos) at batch 10** — batch size is pinned by the
 platform's 300s ceiling on trigger executions (batch 10 measured 214s in trigger mode;
 batch 14 would be killed; do not raise it, add runs instead). Real throughput is ~8 usable
 rows/run (~24/day; some rows legitimately route to `needs_research`), so the backlog
 clears in roughly **two weeks**, not the 60 days the old 7/day rate implied. Until a card
 has been repaired, **a stale card must never be approved directly**; its copy is not what
 we would choose to send. Rows with no contact email are skipped deliberately: redrafting
 one costs ~4 model calls to produce an email with nowhere to go.
 Progress is measurable, not guessable: `Ops - Lead Qualification Census (Read Only)` reports
 evidence coverage, repair durability, and `verifierReadyIfEvidenceComplete` — the single
 number that tracks distance to a fully flowing pipeline (~289 of the current backlog).

## Card and row must never disagree

The reviewer approves the **ClickUp card**; Cadence sends the **send row**. If the two hold
different copy, approval authorises text that never ships — a worse failure than either
version alone, because the review gate is then measuring the wrong thing.

The backfill writes both. `Ops - Sync ClickUp Cards From Send Rows` (the workflow,
manual, no model calls) rebuilds any redrafted card from its row if they ever drift. It was
needed the moment the backfill shipped without a card write: those rows no longer matched the
backfill's own selector, so their cards would have stayed wrong permanently.

Cards also state the verdict directly — a `needs_research` card is labelled
*"NOT sendable: no evidence-backed pain point"* rather than relying on a downstream gate.
- **Domain check is literal.** A recorded domain of `www.example.com` never matches an email
 at `example.com`, so those cards auto-reject. Rare (1 in 186 sampled) and it fails closed.
- **Wasted executions.** Every card Discovery creates fires the Approve Handler's ClickUp
 trigger; all of them fall out at `Is Approved?`. A single Discovery run burns ~40 executions.
- **Little error handling.** Most nodes have no `onError`; a single failure aborts the run.

## Folders

- `docs/` — `spec.md` (design + decisions log), runbook and system-overview PDFs.
- `prompts/` — the locked drafting prompt.
- `workflows/` — n8n workflow exports (see `workflows/README.md` for the re-export command).
- `config/` — directory/ICP seed and list schemas.

## Compliance

NDPA-primary. Every email carries the EquaCore identity, Lagos address and the company website.

**Two footer reductions on 2026-08-10, both at Emeka's explicit instruction:** the privacy URL
was replaced with the plain company website, then the `Not relevant? Reply "unsubscribe"…` line
was removed entirely.

> **The opt-out mechanism still works.** `Phase B - Reply Agent & Opt-out Watcher` detects
> "unsubscribe" in any reply and writes to `Outreach Suppression`, which the Cadence Scanner
> checks before every send. What changed is that recipients are no longer *told* that route
> exists. This is a known compliance and deliverability trade-off — no stated opt-out raises
> spam-complaint risk on the `sales@` domain — accepted deliberately, not overlooked.

The exact footer is defined **once**, in `lint/draft-solidity.js` (`FOOTER`), and enforced
byte-exact. Do not restate it in other docs or prompts, or the copies will drift — that is how
the backlog ended up with three different footer variants.

B2B legitimate-interest, role/business addresses only;
opt-outs are honoured permanently; volume kept deliberately low.
