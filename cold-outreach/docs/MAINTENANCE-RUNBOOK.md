# EquaCore Cold-Outreach — Maintenance & Build Runbook

*Last updated: 2026-06-24. Companion to `SYSTEM-OVERVIEW.md` (team-facing).*
*This file is the source of truth for IDs, wiring, gotchas, and troubleshooting.*

Platform: **n8n Cloud** at `https://voidnox.app.n8n.cloud` · personal project `EqcDlwURPlgDwcUj`.

---

## 1. Workflows (all live)

| Workflow | ID | Trigger | Status |
|---|---|---|---|
| **Phase A – Discovery (Nigeria ICP)** | `P3QCj6WnvRJxC5Gd` | Schedule **weekly Mon 08:00** (instance tz ≈ UTC) + manual "Start" | Active |
| **Phase B – Approve Handler** | `hQaJ9ozahTAQ95qI` | ClickUp `taskStatusUpdated` on list `901219065232` | Active |
| **Phase B – Cadence Scanner** | `i6lcf6ATCryUQnmC` | Schedule **hourly** | Active |
| **Phase B – Reply Agent & Opt-out Watcher** | `3LRLzQYNXItQ2Y3A` | IMAP (Zoho), `forceReconnect=10` min | Active |

Archived/retired: old "Phase B - Reply & Opt-out Watcher" `qfXxRa5LdanBvrfj` (replaced by the Reply
Agent — **do not reactivate**, two IMAP triggers on one inbox = double-processing). Various
`Maint - …` and `… Probe` workflows were one-shot and archived.

### Phase A node chain
`Start`(manual) / `Weekly Trigger`(schedule) → `Directory URLs` (Code: 8 Lusha sector URLs) →
`Firecrawl Scrape Dir` (HTTP, `firecrawlApi`, batch 1/1.5s, **timeout 60s**, neverError) →
`Extract Companies` (Code: regex company names from Lusha markdown) →
`Get Existing Companies` (Data Table get all, executeOnce+alwaysOutputData) →
`Dedup New Only` (Code: drop companies already in the table) →
`Limit 3` (Code: **slice(0,50)** + sender rotation Tosin/Emeka/Michael) →
`Qualify Lead` (AI Agent, DeepSeek + parser → {fit,isNigeria,industry,reason}) →
`Fit?` (IF fit && isNigeria) →
`Draft Sequence` (AI Agent, **Claude Sonnet**, NO parser, delimited `===EMAILn===` output) →
`Parse Draft` (Code: split delimited template → {output:{email1..3}}) →
`Create ClickUp Task` (Pending Review card) → `Write Send-State Row` (Data Table insert).

### Approve Handler node chain
`Approved Trigger` → `Get Approved Task` → `Is Approved?` (status=='approved') →
`Get Send-State Row` (by taskId) → `Lusha Search` (HTTP `/v3/contacts/prospecting`) →
`Pick Best Contact` (Code: score NG + IT/Ops/GenMgmt + seniority + has-email) →
`Lusha Enrich Email` (HTTP `/v3/contacts/enrich`, `reveal:['emails']`) →
`Extract Email` (Code: email + derive `firstName`, role-inbox guarded) →
`Activate Send State` (Data Table update: email, firstName, status=active, step=1, nextSendAt=now) →
`Move Card to Sent` → `Create Pipeline Lead` (New Leads `901219065860`).

### Cadence Scanner node chain
`Every Hour` → `Get Active Sends` (status='active') → `Compute Due Sends`
(Code: nextSendAt<=now; pick subject/body by step; **substitute `{{FIRST_NAME}}` / legacy "Hi there,"
→ "Hello <firstName>,"**; +3 days; complete after step 3) → `Send Step Email` (Zoho SMTP, text) →
`Advance Send State` (Data Table update step/status/nextSendAt by row id).

### Reply Agent node chain
`Sales Inbox (IMAP)` (Zoho, simple, UNSEEN, forceReconnect 10) →
`Match & Classify` (Code: senderEmail + route=`unsub`|`auto`|`reply`) →
`Get Reply Row` (by email) → `Route Reply` (Switch):
- `unsub` → `Mark Unsubscribed` → `Card to Rejected`.
- `auto`/fallback → **dropped** (no reply).
- `reply` → `Mark Replied` → `Build Reply Context` (Code: strips quoted history) →
  `Sales Agent` (**Claude Sonnet**, no parser, delimited INTENT/ESCALATE/SUBJECT/BODY) →
  `Parse Agent Reply` (Code: also force-escalate if `agentRounds>=2`, risky-regex, or empty body) →
  `Escalate?` (IF):
  - true → `Flag Human (Comment)` (ClickUp comment on card).
  - false → `Approval Request` (**emailSend `sendAndWait`**, double approval, to `tosindada@`,
    cc `emekachiazor@`, 24h wait) → `Approved?` (IF `$json.data.approved`) →
    true → `Send Reply to Prospect` (Zoho SMTP) → `Bump Round` (agentRounds+1);
    false → `Declined Comment`.

---

## 2. Data Table — "Cold Outreach Sends" `S2B1Sdkckui4zzzO`

The shared state store (project `EqcDlwURPlgDwcUj`). One row per lead.

| Column | Type | Set by | Meaning |
|---|---|---|---|
| taskId | string | Phase A | ClickUp card id (links row ↔ card) |
| company | string | Phase A | Company name |
| email | string | Approve Handler | Decision-maker's revealed email |
| firstName | string | Approve Handler | First name for greeting (Lusha→email fallback) |
| senderName | string | Phase A | Tosin/Emeka/Michael (rotates) |
| domain | string | Approve Handler | Company domain |
| subject1..3 / body1..3 | string | Phase A | The 3 drafted emails |
| step | number | Approve/Scanner | Next email to send (1→3) |
| nextSendAt | date | Approve/Scanner | When the next step is due |
| status | string | all | `pending_review`→`active`→`completed` / `replied` / `unsubscribed` |
| agentRounds | number | Reply Agent | # of AI replies sent (cap 2) |
| casualCompany | string | Phase A/A3 | Short company name for prose |
| country | string | A3 (2026-07-14) | Lead's market (Nigeria/Ghana/…); legacy rows backfilled `Nigeria`; all reads fall back `\|\| 'Nigeria'` |

**Status lifecycle:** `pending_review` (drafted) → `active` (approved, sending) →
`completed` (3 emails sent) · `replied` (prospect replied, cadence stopped) ·
`unsubscribed` (opted out). The Scanner only ever sends rows with status **`active`**.

---

## 3. ClickUp

- Workspace (team): `90121850569`. **Both ClickUp workspaces are named "Workspace"** — the other,
  `9015676129`, is wrong/legacy.
- **Cold Outreach Review** list `901219065232` (space `90128084984`) — **Nigeria only**. Statuses:
  Pending Review → Approved → Sent → Replied → Rejected. **Approve trigger = status → Approved.**
- **Cold Outreach Review — West Africa** list `901219526986` (same space, added 2026-07-14) —
  shared queue for Ghana/Sierra Leone/Liberia/Gambia; cards carry a `[Country]` name prefix +
  Market line. Approve Handler has a second trigger on this list. ⚠️ Must carry the SAME five
  custom statuses as the Nigeria list (set in the ClickUp UI — API can't create statuses);
  until they exist, A3 card-creation into this list fails and Approve/Sent transitions can't fire.
- **Sales Pipeline** space `90128085539` → folder Pipeline Management `901211962352` →
  **New Leads** `901219065860`, **Pipeline** `901219065859` (shared across markets).
- ClickUp limits: cannot create custom statuses/fields via API (set in UI); no delete-list via API.

---

## 4. Credentials (n8n)

| Service | Cred name | Cred ID | Type |
|---|---|---|---|
| Firecrawl | Firecrawl API | `LbarSfx4MwQc8OxW` | firecrawlApi |
| Lusha | Equacore Lusha account | `mpPiRn6tEUECh7PK` | lushaApi |
| Anthropic (Claude) | Claude Anthropic account | `9zjF9fEwh7e07YLU` | anthropicApi |
| DeepSeek | DeepSeek account | `QKt1Pk1P4JisYmIV` | deepSeekApi |
| OpenAI | OpenAI account | `RHgwdavxG9ZA1wxf` | openAiApi |
| Gemini | Google Gemini (PaLM) | `g38sPQ9sEgHXvZjq` | googlePalmApi |
| Zoho SMTP (send) | Zoho Sales SMTP account | `dNt6bQ75wTvlSOvz` | smtp |
| Zoho IMAP (receive) | Zoho Sales IMAP account | `pX145xpm70Qzu390` | imap |
| ClickUp | Equacore ClickUp OAuth2 API | `u6QskCANdJE2ZfMQ` | clickUpOAuth2Api |
| SharePoint | Equacore SharePoint account | `Jw9owE9pyq7MbmqO` | microsoftSharePointOAuth2Api |
| Apollo (unused) | Header Auth account | `HbTsoff6aF3a9tPY` | httpHeaderAuth |

**Models in use:** Claude **`claude-sonnet-5`** (cold-email drafting since 2026-07-11 bake-off —
no temperature param, Sonnet 5/Opus 4.8 reject non-default sampling); Claude `claude-sonnet-4-6`
(sales replies — Reply Agent not yet migrated); DeepSeek **`deepseek-chat`** (lead qualify + ICP
gate). gpt-5-mini retired from drafting. Gemini reserved for embeddings/vision/long-context.

**Constants:** from `sales@equacoredigital.com`; booking link =
`https://outlook.office.com/bookwithme/user/1e9f99cc6e8042dbba4dc9fc24502124@equacoredigital.com/meetingtype/cy9U1wgBf0K1XkZr0q-gHw2?anonymous`;
footer address `EquaCore Digital Ltd · Lekki, Lagos, Nigeria`.

---

## 5. Cost & rate limits (the real constraints)

- **Lusha (free): ~40 credits/month.** Each approved lead costs ~2 (1 search + 1 email reveal) →
  **~20 enriched leads/month.** Pace approvals accordingly. Credits spend at *approval* time.
- **Firecrawl (free):** concurrency-limited → Phase A scrapes are batched (1 per 1.5s) with a 60s
  per-scrape timeout. Run **one** Phase A execution at a time.
- **Phase A cap = 50/run.** No-cap OOMs n8n Cloud (see gotchas).
- **Apollo (free): API unusable** — its plan blocks the people-search/enrich endpoints. Not wired in.

---

## 6. Gotchas & non-obvious design (READ before editing)

1. **Claude + n8n Structured Output Parser is broken.** Claude wraps output in `{output:...}` or
   breaks hand-written-JSON escaping. **Fix used everywhere:** parser OFF; Claude emits a plain
   `===EMAILn===` / `INTENT:/ESCALATE:/SUBJECT:/BODY:` delimited template; a Code node splits it.
   Never reintroduce the structured parser on a Claude agent here.
2. **No-cap Phase A → out-of-memory crash.** Feeding hundreds of items through two AI agents exhausts
   n8n Cloud memory (`WorkflowCrashedError`). Keep the 50 cap. Cards appear only at the *end* of a run
   (agents process the whole batch first).
3. **IMAP trigger silently stalls** on n8n Cloud — connection dies, no executions logged, replies
   missed. Mitigation: `options.forceReconnect=10` on the IMAP node (reconnect every 10 min). If it
   still stalls, deactivate→reactivate the workflow, or move to a scheduled Zoho-API poll.
4. **emailSend can't set `In-Reply-To`/`References`** → replies thread by **"Re:" subject only**
   (acceptable, not true header threading).
5. **Reply Agent multi-reply-per-poll limitation (OPEN):** `Build Reply Context` is
   runOnceForAllItems returning a single item → if several different prospects reply in the same poll
   cycle, **only the first is handled.** Rare at low volume; fix = iterate all items (careful with
   cross-node pairing; re-test the live inbound path).
6. **Dedup uses fetch-once + in-memory Set**, not the per-item `rowNotExists` op (which is too slow
   on hundreds of rows).
7. **Lusha is a community node** (un-introspectable) → called via **HTTP Request + predefined
   `lushaApi` cred**. Same for Firecrawl. Lusha v3: `POST /v3/contacts/prospecting` (search, ~1
   credit/page) then `POST /v3/contacts/enrich` with `{ids:[id], reveal:['emails']}` (1 credit).
8. **Personalisation happens at SEND time** (Scanner), not draft time — so already-drafted "Hi there,"
   cards also get personalised once the name is known on approval. Role inboxes (info@, sales@…) are
   guarded so they never become "Hello Info,".
9. **Provider-swap recipe** (e.g. model change): removeConnection (ai_languageModel) → removeNode →
   addNode → addConnection → **setNodeCredential explicitly** (don't rely on addNode creds attaching).

---

## 7. Troubleshooting

| Symptom | Likely cause → fix |
|---|---|
| Replies not being handled / 0 executions on Reply Agent | IMAP stalled → deactivate+reactivate `3LRLzQYNXItQ2Y3A`; confirm `forceReconnect=10`. Confirm inbound actually lands in the **Zoho** sales@ inbox (sending is Zoho SMTP; receiving must be the Zoho mailbox the IMAP cred reads). |
| Phase A run "crashed" | OOM from too many items → ensure `Limit 3` is `slice(0,50)`, run only one at a time. |
| Phase A run hangs for minutes | Firecrawl throttle/hang → `forceReconnect`/timeout already set; check Firecrawl status; run once. |
| Draft parsing error ("schema"/JSON) | Someone re-enabled the structured parser on a Claude agent → turn it OFF, use the delimited template + Code parse. |
| Approval email never arrives | Check the Reply Agent execution is in `waiting` status; verify Zoho SMTP cred; check tosindada@ spam. |
| Clicking "Send it" doesn't send | Check the `Approved?` IF reads `$json.data.approved`; inspect the resumed execution. |
| Duplicate cards on re-run | Dedup (`Get Existing Companies` + `Dedup New Only`) mis-wired → confirm chain Extract → Get Existing → Dedup → Limit. |
| "Hello Info," in an email | Role-inbox guard in `Extract Email` bypassed → check the denylist + alpha/length checks. |
| Pricing/ServiceNow-partner claim in a reply | Guardrail in `Parse Agent Reply` + agent prompt → confirm risky-regex + system-prompt hard-bans intact. |

**Debug flow:** `search_executions({workflowId})` → `get_execution({…, includeData:true})` → read the
actual node data (look for `undefined` fields, wrong Switch branch, error objects).

---

## 8. Compliance

- **Opt-outs:** "unsubscribe/remove me" → row `status=unsubscribed`, card → Rejected, cadence stops.
  Honour permanently.
- **Footer:** every cold email carries EquaCore identity + privacy link + unsubscribe instruction.
  (Conversational AI replies are plain 1:1 and intentionally carry **no** marketing footer.)
- **⚠️ NDPA 2023 (Nigeria):** guidance leans toward **consent required** for cold marketing to named
  individuals (legitimate interest may not cover it; no B2B exemption; fines up to ₦10m / 2% revenue).
  **Confirm lawful basis with Nigerian counsel before scaling.** Log Lusha source / lawful basis per
  contact. GDPR/CAN-SPAM apply only if emailing EU/US recipients.
- **⚠️ West Africa markets (added 2026-07-14):** per-country lawful basis needed before scale —
  **Ghana:** Data Protection Act 2012 (Act 843), the strictest of the four; registration with the
  Data Protection Commission may apply to data controllers targeting Ghana — confirm with counsel.
  **Sierra Leone / Liberia / Gambia:** no comprehensive data-protection statute in force as of
  mid-2026 — verify current status before scaling each market. Opt-out + suppression + footer
  identity apply identically in all markets; footer keeps the real Lagos sender address.

---

## 9. Build log — what we built on 2026-06-24

1. **Multi-sector discovery** — generalised Phase A from NDIC-banks to **8 Lusha sector directories**
   (manufacturing, oil&gas, food&bev, healthcare, IT/MSP, pharma, transport, consulting), mining
   company names from the public Lusha pages. Added **dedup** (auto-pagination) and a **50 cap**
   (after a no-cap OOM crash).
2. **Cold-email rewrite** — repositioned **Halo-first**, ServiceNow as a follow-up-only line,
   ServiceNow-talent banned; ultra-concise (≤60 words); killed hedging/source-leaks/company-as-person
   greeting; shortened footer to "Lekki, Lagos, Nigeria".
3. **Switched drafting model gpt-5-mini → Claude Sonnet**; solved the Claude+parser issue with the
   delimited-template + Code-parse pattern.
4. **Recipient name personalisation** — "Hello Paul," via `firstName` (Lusha name → email fallback,
   role-guarded), substituted at send time (also fixes already-drafted cards).
5. **Phase B send engine** (built earlier same day, verified): Approve Handler (Lusha enrich),
   Cadence Scanner (Zoho send, 3-day cadence), state Data Table.
6. **Conversational sales agent** (Claude) on the reply path with **human approval** (sendAndWait),
   hard escalation (pricing/legal/scope/partner-status), auto-reply gate, 2-round cap, guardrails.
   **Verified end-to-end** (inbound → draft → approve → send). Fixed an **IMAP stall** with
   `forceReconnect=10`.
7. **Scheduling** — Phase A set to run **weekly (Mon 08:00)**; all four workflows activated.
8. **Evaluated Apollo** (free API unusable) and **researched** AI-sales-agent best practices +
   NDPA compliance.

Personal memory (assistant): `~/.claude/projects/-Users-nouser/memory/equacore_cold_outreach.md`
holds the running session notes. n8n-specific gotchas live in the `n8n-expert` skill.
