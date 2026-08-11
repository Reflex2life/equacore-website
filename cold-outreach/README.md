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

## Autonomy — current state (2026-08-10)

**Nothing sends right now, by design.** Active send rows = 0, the autonomous reviewer is
disabled, and production approvals fail closed. This is a deliberate safe state while
contact verification is being proven, not a fault.

### The `Phase A3` autonomous review branch — DISABLED

`Phase A3` carries a second trigger (cron `0 0 7 * * 2-4`, Tue–Thu 07:00) that reviews
pending cards without a human. **`Daily Pending Review Trigger` is currently
`disabled: true`** and must stay off until verification is proven.

It reads the 10 oldest `pending_review` rows → deterministic hard-pass gate → DeepSeek
review agent → gate on `hardPass AND approve AND confidence >= 95`.

Two fixes were applied on 2026-08-10 so it is no longer destructive when re-enabled:

- Research gaps now write **`needs_research`** to the row and leave the ClickUp card at
 `pending review` (a `Genuine Rejection?` IF node gates the card update). Only a genuine
 judgement rejection marks a card `rejected`. Previously a missing email — 41% of the
 backlog — was permanently rejected.
- `Daily Review Evidence` and `Find Daily Emeka Member` were collapsing every batch to a
 single item, silently dropping 9 of every 10 cards.

**Its evidence is still circular** — the agent has no `ai_tool` connections and grades the
card description Phase A3 itself wrote. Contact verification does **not** live here; it
lives in `Phase A4` (below). Do not add Lusha to `Phase A3`.

### `Phase A4` / `A4b` — contact verification and redraft (shadow only)

Separate workflows that establish whether a contact is genuinely the right person:
Lusha lookup → candidate-domain probe → suppression check → evidence written to
`Outreach Verification Decisions`. `A4b` redrafts verified contacts with Claude, **routes
through the DeepSeek humanizer**, then applies a deterministic lint.

Both run in shadow (`shadowMode: true`) and mutate no card or send state.

**Known weakness under active fix (2026-08-10):** the domain probe was not gating on its
own result — `statusCode` values of `0`, `421` and `503` still produced
`domainVerified: true`, and one contact at an unrelated company was marked
`employmentVerified: true` despite `probeCompanyMatch: false`. A probe that did not reach
the site is not evidence. Only `2xx` may verify.

### The production send gate

`Phase B - Approve Handler` requires a persisted verification row with `decision=approve`,
`shadowMode=false`, all booleans true and confidence ≥95 before it will activate a send;
otherwise `Hold Unverified Approval`. **There are currently zero such rows**, so a human
approving a card in ClickUp is held rather than sent. Fail-closed and intentional.

The card body still reads "Move this task to Approved to send the sequence" — that
instruction is currently misleading and should be updated when the gate opens.

## Data stores

| Store | ID | Purpose |
|---|---|---|
| `Cold Outreach Sends` (n8n data table) | the workflow | Send state — drafts, step, `nextSendAt`, status |
| `Apify Lead DB` (n8n data table) | the workflow | Scraped leads, `pipelineStatus` |
| `Outreach Reply Insights` (n8n data table) | the workflow | Reply intent / escalation log (added 2026-08-08) |
| `Outreach Verification Decisions` (n8n data table) | the workflow | Contact-verification evidence ledger; gates production sends (added 2026-08-10) |
| `Outreach Suppression` (n8n data table) | `LBITkNkIlsJkQSKZ` | Email/domain suppression, checked pre-send by the Cadence Scanner (added 2026-08-10) |
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

## Known issues (2026-08-10)

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

- **~575 queued cards still carry a booking link.** They predate research, the humanizer and
 the offer, and would fail `draft-solidity` on four counts each. `Backfill - Redraft Queue to
 Offer Contract` repairs them at **7/day** — rate-matched to what the send envelope can
 absorb, so nothing is pre-paid — which means roughly **60 days** to clear 424 sendable rows.
 Until then **a stale card must never be approved directly**; its copy is not what we would
 choose to send. Rows with no contact email (163) are skipped deliberately: redrafting one
 costs ~4 model calls to produce an email with nowhere to go.

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
