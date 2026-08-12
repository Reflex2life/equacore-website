# EquaCore Cold Outreach — Design Spec

**Created:** 2026-06-24 · **Last reconciled against the live instance:** 2026-08-12
**Status:** FULLY AUTONOMOUS — review → verify → promote → approve → send with no human
in the loop (Emeka-authorized 2026-08-12) · Owner: Emeka Chiazor

> This spec is reconciled from the running workflows on `voidnox.app.n8n.cloud`, not from
> intent. Where the original 2026-06-24 design was later changed, the change is recorded in
> the decisions log rather than quietly edited away.

## Goal & scope

An outbound channel: discover ICP-fit companies, scrape them, draft personalized cold
emails, route through review, and send a 3-step sequence from `sales@equacoredigital.com`.
Scope has widened from the original **Nigeria-only v1** to Nigeria plus other West African
markets — leads carry a `country` column and route to one of two ClickUp lists.

## Architecture

- **Phase A — discover → scrape → qualify → draft → review queue.**
 `Phase A - Discovery` (weekly Mon 08:00) → `Phase A2*` Apify/Maps scrapers → `Apify Lead DB`
 → `Phase A3 - Lead Qualify & Draft Feeder` (weekday intake 13:00 Lagos) qualifies, drafts, humanizes, and
 creates a ClickUp review card plus a `Cold Outreach Sends` row at `pending_review`.
- **Phase B — n8n + Zoho send engine.** Card moved to **Approved** → `Phase B - Approve Handler`
 (ClickUp trigger) enriches via Lusha and sets the row `active` → `Phase B - Cadence Scanner`
 (hourly, Tue–Thu 10:00–16:00 Lagos, ≤35/run, 3 days between steps) sends over Zoho SMTP →
 `Phase B - Reply Agent & Opt-out Watcher` (IMAP) handles replies, opt-outs and bounces.
- **Standing guard.** `Reconcile - Approved Backlog Guard` (every 3h, business hours Mon–Fri)
 catches approved cards whose send state never activated.

No cold-email SaaS, no separate sending domain — established-domain sending, reputation
protected by volume discipline.

## Autonomous review branch (added 2026-08-08, undocumented at the time)

A second trigger on `Phase A3` (Tue–Thu 09:10 Lagos) reviews pending cards
with no human involved:

1. Pull the 10 oldest `pending_review` rows and their ClickUp cards.
2. **Deterministic hard-pass gate** — requires a named (non-generic) work email, an email
 domain matching the recorded company domain, and an unsubscribe + privacy footer in body 1.
3. **DeepSeek review agent** returns `{approve, confidence, reason}`.
4. **Gate:** `hardPass AND approve AND confidence >= 95`.
 - Pass → ClickUp status `approved`, assigned to Emeka. **This feeds the send engine.**
 - Fail → row and card permanently marked `rejected`.

**Design intent:** a fully autonomous pipeline, with this agent validating the writeup *and
verifying that the contact is the genuine person the email should reach*.

**Implementation gap.** The verification half is not built. The agent's entire evidence set
is `company`, `email`, `domain`, draft 1, and `cardContent` — and `cardContent` is the
ClickUp description Phase A3 wrote from the same lead record, so the check is circular. The
agent has no `ai_tool` connections, never sees the `Scrape LinkedIn Profile` research (that
feeds `Build Research Context` for drafting only), and the Lusha person/email lookup runs
**after** approval in `Phase B - Approve Handler` — the one real identity signal in the
system arrives too late to inform the decision.

Consequence: the branch can reject a malformed contact but cannot detect a wrong one. To
meet the stated intent, contact verification must move ahead of the gate — mirror the Lusha
lookup into Phase A3 (or attach it as an agent tool), pass the profile research into the
review evidence, and treat "verified employment/role at this domain" as a hard-pass
condition alongside the existing format checks.

## "Fully autonomous as long as the draft is solid"

Emeka's standing instruction (2026-08-10). There is **no human spot-check** in the happy path,
which means the lint *is* the quality control — "solid" must be deterministic and fail closed.
`cold-outreach/lint/draft-solidity.js` is the contract (18 tests; positive case is a real
production draft from execution 3525). A draft that cannot be mechanically proven solid goes to
`needs_research`, never to send and never to `rejected`.

Gates, all required: contact verified against a 2xx probe on an authoritative domain · verified
company matches the card's company (or its `companyAliases`) · suppression clear ·
`siteFetched` · `hasPainPointEvidence` · `humanized === true` · copy checks (greeting token,
byte-exact footer, no booking link, no bare "Halo", no banned AI vocabulary, no source leaks,
pain point posed as a question, no statistic absent from the research evidence).

## Models

- **Qualify:** DeepSeek `deepseek-chat`.
- **Draft:** **Claude Sonnet** (`lmChatAnthropic`), followed by a **DeepSeek humanizer pass**.
 Supersedes the 2026-06-24 bake-off choice of OpenAI `gpt-5-mini`, which is no longer used
 anywhere in the pipeline.
- **Company research:** DeepSeek, inside `Shared - Company Research`, the
 single implementation called by both Phase A3 and the A4b redraft path.
- **Reply agent:** Claude. **Autonomous reviewer** and **nickname casualizer:** DeepSeek.
- Read AI-Agent output at `$json.output`; never set `temperature` on gpt-5 models.
- Routing policy: `model-cost-preference` memory + n8n-expert `model-routing.md`.

## Data model (n8n Data Tables + ClickUp)

Supersedes the original SharePoint-list design.

**`Cold Outreach Sends`** — the workflow. Send state:
`taskId, company, casualCompany, senderName, email, firstName, domain, country,
subject1..3, body1..3, step, nextSendAt, status, agentRounds`.
`status`: `pending_review` → `active` → `completed`, plus `rejected | replied |
unsubscribed | bounced`.

**`Apify Lead DB`** — the workflow. Scraped leads; `pipelineStatus`: `new` → `queued`.

**`Outreach Reply Insights`** — the workflow (added 2026-08-08).
`company, country, openerSubject, replyIntent, escalated, receivedAt`.

**ClickUp review queue** — team `90121850569`, space `90128084984`, lists `901219065232`
(Nigeria) and `901219526986` (other markets). Card statuses: `pending review` → `approved` /
`rejected` → `sent`.

There is no `Outreach Suppression` list; suppression is expressed as terminal `status`
values on `Cold Outreach Sends`.

## Compliance (NDPA-primary)

Footer on every email, byte-exact and lint-enforced. Defined once in
`lint/draft-solidity.js` (`FOOTER`):

```
—
EquaCore Digital Ltd · Lekki, Lagos, Nigeria
https://equacoredigital.com
```

**2026-08-10, two reductions, both on Emeka's explicit instruction:**

1. the privacy URL replaced with the plain company website;
2. the `Not relevant? Reply "unsubscribe" and we'll remove you.` line removed entirely.

Each was back-applied to all non-terminal send rows and all in-review ClickUp cards across
**both** lists (Nigeria `901219065232` and West Africa `901219526986`). Terminal rows —
`completed`, `replied` — were deliberately left untouched so the record of what was actually
sent stays truthful.

**Compliance position, stated plainly.** The opt-out *mechanism* is intact: the Reply Agent
detects "unsubscribe" in any reply and writes to `Outreach Suppression`, which the Cadence
Scanner consults before every send. What is gone is the *stated* opt-out. NDPA transparency
practice and B2B cold-email norms expect a visible opt-out, and its absence raises
spam-complaint risk against the `sales@` domain. This was raised and the instruction
reaffirmed; it is a deliberate business decision, recorded here so it is not later mistaken
for a regression.

B2B legitimate-interest (business/role addresses only); opt-outs honoured permanently via the
`Outreach Suppression` table; truthful subjects and headers; conservative volume. The Cadence
Scanner caps a run at 35 sends and only runs Tue–Thu 10:00–16:00 Lagos.

## Credentials

In n8n: DeepSeek, OpenAI, Gemini, Anthropic, ClickUp OAuth2, Zoho `sales@` (SMTP + IMAP),
Lusha, Apify. Secrets live only as n8n credentials and are **stripped from every export in
`workflows/`** — never committed.

## Decisions log

Current:

- Multi-market (Nigeria + other West African markets), routed by a `country` column to two
 ClickUp lists. *Supersedes Nigeria-only v1.*
- Review queue in **ClickUp**, send state in **n8n Data Tables**. *Supersedes SharePoint
 lists — the OAuth path was abandoned.*
- Draft model = **Claude Sonnet + DeepSeek humanizer**. *Supersedes the gpt-5-mini bake-off
 winner.*
- Sending from `sales@` (Zoho), n8n-owned send engine — no cold-email platform, no separate
 domain.
- 3-step sequence, 3 days apart, stop-on-reply.
- 2026-08-08: autonomous review branch added to Phase A3 (see above).
- 2026-08-08: reply-insight logging added to the Reply Agent.
- 2026-08-12: **full autonomy authorized and wired** (Emeka's direct instruction). A3's
 dual-reviewer agreement now drives Phase A4e (live single-task lineage: A4 → A4c → A4b)
 then Phase A6/A5 promotion; the card flips to Approved only on `promoted: true`.
 Promotions capped at 2/run for the 300s trigger-execution ceiling. *Supersedes the
 human card-flip as the approval step; the Approve Handler's gates are unchanged.*
- 2026-08-12: identity gates realigned with Emeka's per-action approval — person-name
 matching is token-subset (credential suffixes and middle names no longer false-reject),
 company matching strips legal suffixes and accepts canonical-company equality. The A4b
 offer contract (free 5-working-day mapping in email 2) was restored after silent drift.
- 2026-08-12 (pm): all outreach schedules consolidated to business hours on the
 operator's instruction — review Tue–Thu 09:10, intake weekdays 13:00, redraft backfill
 weekdays 11:00/15:00, A2 scrape Mondays 09:00, safety monitor 15-min Mon–Fri 09:00–16:45,
 canary gate-aligned Tue–Thu. Reply Agent and failure handling stay event-driven 24/7.
 *Supersedes the 05:00–21:00 spread and the 24/7 safety polling.*
- 2026-08-12: emergency stop engages only on persistent failure (3 transient errors/60 min
 per workflow; non-transient immediately). Reply-capture proof is renewed by a
 gate-aligned canary (Tue–Thu 09:00 + 10:45–15:45 Lagos, constant subject, purge-then-match)
 instead of hand-stamping. *Supersedes the
 latch-forever stop and the unrenewable 1-hour proof that silently blocked all sending
 2026-08-11 → 08-12.*

Superseded (kept for history): SharePoint `Cold Outreach Leads` + `Outreach Suppression`
lists; OpenAI `gpt-5-mini` as draft model; Nigeria-only scope; `info@` (M365) as the CRUD
identity; SharePoint doc library as the canonical artifact store.

## Verification

Per-node `validate_node_config` + `validate_workflow` before publish — then a **live run**,
because validation never proves behavior. Trigger-based workflows (webhook, ClickUp, IMAP,
schedule) cannot be manually executed; activate and send a real event, then read
`get_execution(includeData: true)` and confirm the data, not just `status: success`.

Pay particular attention to Code nodes in `runOnceForAllItems` mode: returning a single item
silently drops every other item in the batch. Two such defects were found and fixed in the
Phase A3 review branch on 2026-08-10.
