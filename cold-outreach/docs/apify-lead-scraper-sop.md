# SOP — Apify Lead Scraping Infrastructure (Phase A2 + A3)

_Created 2026-07-11. Follows Nick Saraev's Maker School Day 8 "Set up scraping
infrastructure" + his `scrape_leads.md` DOE directive, adapted to n8n + EquaCore._

## What it is

A second, higher-volume lead source alongside the Firecrawl directory-mining Phase A.
Contact-level leads (named decision-makers with verified emails + LinkedIn URLs) flow
into the SAME review/send engine — nothing sends without a human approving a ClickUp card.

| Piece | ID |
|---|---|
| WF **Phase A2 - Apify Lead Scraper** | `QkglKNLnD6m5NKK8` |
| WF **Phase A3 - Lead Qualify & Draft Feeder** | `MV00bf5ILuYR8EH2` |
| Data table **Apify Lead DB** | `62awkIsWKW0nHACQ` |
| Apify actor (leads) `code_crafter/leads-finder` | `IoSHqwTR9YGhzccez` |
| Apify actor (LinkedIn profiles) `dev_fusion/Linkedin-Profile-Scraper` | `2SyF0bVxmgGr8IVCZ` |

## Flow

**A2 (scrape):** Run Config (mode/test-or-full, **country**, jobTitles, keywords, count) → Apify
leads-finder (`contact_location` = Run Config country, decision-maker titles, `email_status: validated`) →
- **mode=test**: 25-lead sample → DeepSeek scores vs ICP → **hard stop** if <80% match
  (test-then-scale gate). Pass → rerun with mode=full.
- **mode=full**: normalize → dedup vs Apify Lead DB **and** Cold Outreach Sends → insert
  rows `pipelineStatus=new` → run summary (counts + est. cost).

**A3 (feed):** daily schedule (07:00) or manual → 50 `new` rows → DeepSeek qualify
(fit + **countryMatch** vs the row's `country`) → Fit? → Apify LinkedIn profile scrape
(contact's own profile) → Claude Halo-first 3-email draft (writes its own icebreaker
from research; country-aware copy) → ClickUp card (Pending Review; **routed by market**:
Nigeria → list `901219065232`, all other countries → "Cold Outreach Review — West
Africa" `901219526986` with a `[Country]` name prefix + Market line) + Cold Outreach
Sends row (**email + firstName + country pre-filled**) → lead row `queued` (or `rejected`).

Downstream (unchanged): human approves card → Approve Handler → Cadence Scanner (Zoho
sales@, 3-step, 3-day gaps) → Reply Agent.

## Run procedure

1. New query or new country? Edit **Run Config** in A2 (country/jobTitles/keywords),
   keep `mode=test`, run, read the gate report. Iterate until PASSED. **Run the gate
   per country** — each market gets its own ≥80% pass before any full run.
2. Set `mode=full`, `totalCount` ≤ 500 (n8n Cloud memory + 300s run-sync cap), run.
   One country per run (keeps the gate meaningful and dedup counts readable).
3. Run A3 manually (or let the daily schedule drain 50/day once activated).
4. Approve cards in ClickUp as usual (one by one, never bulk). Deliverability caps
   unchanged (20–30/day/mailbox) — all markets share the sales@ mailbox and the
   Scanner's 35 sends/run cap; you control the market mix by which cards you approve.

## Cost table (per 1,000 leads)

| Item | Cost |
|---|---|
| Apify leads-finder | ~$1.50 |
| Apify LinkedIn profile scrape (only fit leads) | ~$1–5 |
| DeepSeek qualify + icebreaker | <$0.50 |
| Claude drafts | ~$1–2 |
| **Total** | **~$4–9 / 1,000** |

Free Apify plan = $5/mo credit → fine for the 100-lead pilot; upgrade before 4k/mo.

## Setup still pending (one-time, manual)

1. **Approve actor permissions** (Apify console, logged in as `radicalmind` via GitHub):
   - https://console.apify.com/actors/IoSHqwTR9YGhzccez?approvePermissions=true
   - https://console.apify.com/actors/2SyF0bVxmgGr8IVCZ?approvePermissions=true
2. **Create n8n credential** "Apify API" (type: Bearer Auth) with the Apify token, then
   attach it to: A2 "Apify Leads Finder" and A3 "Scrape LinkedIn Profile".
3. Both workflows are INACTIVE. Activate A3's daily trigger only after a clean manual
   end-to-end run (3 cards verified).

## NDPA note

These are **named individuals** — riskier than role inboxes under NDPA 2023 (consent
likely required for cold marketing; no B2B exemption; fines up to ₦10m/2% revenue).
Mitigations in place: instant unsubscribe → suppression, plain-text minimal sends,
human review gate. Confirm lawful basis with NG counsel before scaling volume.

## Status (2026-07-11, verified live)

- Gate history: run 1 failed (free-plan API block), run 2 failed 48% (companies too
  small), run 3 **PASSED 20/25 (80%)** after adding the `size` filter (51+ staff bands).
- Full run (exec 2159): 96 scraped → 5 dupes skipped → **91 inserted**, 80 with
  verified emails, ~$0.14.
- A3 verified end-to-end (exec 2160): 3 leads → real LinkedIn profiles scraped →
  specific fact-grounded icebreakers → Claude drafts → ClickUp cards 869e39bwu/bww/bwx
  (Pending Review) → send-state rows with email+firstName → lead rows `queued`.
- **A3 is ACTIVE** (daily 07:00, 50 leads/run). A2 stays manual; Run Config currently
  mode=full, totalCount=100.

## Learnings

- 2026-07-11: leads-finder + LinkedIn scraper both require one-time "full permission"
  approval in the console — API returns `full-permission-actor-not-approved` until then.
- 2026-07-11: leads-finder output is snake_case (`first_name`, `email`, `linkedin`,
  `company_name`, `company_domain`, `industry`, `company_size`…); input takes
  `fetch_count`, `contact_location`, `contact_job_title`, `email_status`, `company_keywords`.
- 2026-07-11: no Google Sheets cred on the n8n instance → lead DB is an n8n Data Table
  (also makes dedup trivial). Add a Sheets export later if a shareable deliverable is needed.
- Draft prompt is duplicated between Phase A (`P3QCj6WnvRJxC5Gd`) and A3 — edit BOTH
  when changing copy.
- 2026-07-11: monetized actors **block API runs on the free Apify plan** ("Users on the
  free Apify plan can run the actor through the UI…") — paid plan required; user
  upgraded.
- 2026-07-11: without a `size` filter the actor returns mostly micro software shops
  ("CTO" of 3-person startups) — gate failed at 48%. Size bands 51+ fixed it.
- 2026-07-11: Apify lead data can be **stale** — one contact's LinkedIn showed a
  different current employer than the lead record. Icebreaker prompt now bans naming
  any employer other than the lead's company; human review remains the backstop.
- 2026-07-11: MCP `update_workflow` payloads containing JS **backticks/template
  literals** get blocked by Cloudflare WAF — use string concatenation in jsCode sent
  via MCP.

- 2026-07-14: **dataTable `isNotEmpty` does NOT exclude empty strings** — A3's email
  filter only skips NULL emails; leads-finder writes `''`, so email-less leads ARE
  drafted (cards with no email). Working as accepted now: those cards resolve via the
  Approve Handler's Lusha path at approval, or via the AMF→send-row reconcile pattern
  (one-shot workflow: match `amf_verified` Lead DB emails into `pending_review` send
  rows by company). 2026-07-14 full-drain run: AMF found 33/80 (33cr), 26 filled into
  drafted cards.
- 2026-07-14: **A3 queue-clog bug found + fixed.** The LinkedIn profile scrape returns an
  EMPTY array (HTTP 200, `[]`) for some profiles; with per-item requests an empty response
  contributes ZERO output items, so that lead silently vanished mid-chain — no card, no
  `queued`/`rejected` mark, stuck at `new` forever. Because Get New Leads takes the 50
  OLDEST `new` rows, stuck leads accumulated at the queue head until runs produced 0 cards
  (Jul 14: exec 2531/2534 — "success", zero cards, same 50 re-scraped daily at Apify cost).
  Fix: `Fit? → Fit Leads (materialize lead items) → Scrape (alwaysOutputData, $json.linkedin)
  → Build Research Context (runOnceForAllItems: joins profiles to ALL fit leads by
  linkedinUrl; missing profile → research='' → sector opener)`. Lesson: an HTTP node whose
  per-item response can be an empty array needs an explicit join back to the source items —
  `neverError`/`onError` only protect against error responses, not empty successes.
- 2026-07-11: A3's Parse Draft now bakes the REAL first name into the drafts (replaces
  `{{FIRST_NAME}}` at parse time) since A2 leads carry the name upfront — unlike
  Pipeline 1, which only learns it from Lusha at approval. Empty firstName leaves the
  token, which the Cadence Scanner still substitutes at send.

## Edge Cases

- Apify returns 0 leads → gate/normalize simply produce nothing; broaden titles/keywords.
- LinkedIn profile scrape fails/empty → `research=''` → icebreaker=NONE → sector opener
  (never blocks the pipeline; node is neverError + continueRegularOutput).
- Lead with no `linkedin` URL → same fallback path.
- Duplicate contact at same company → dedup keys on domain, email, and normalized
  company name vs both tables.

## Phase A2b - AMF Email Enrichment (BUILT + VERIFIED 2026-07-11)

WF `AWxs23sGkCVTfkSg` (manual): Lead DB rows with emailStatus `missing` or `amf_not_found`
→ `POST api.anymailfinder.com/v5.1/find-email/person` (name + domain + linkedin, Header
Auth cred "AnyMailFinder" `1zyBxWuojpPe8C22`, timeout 120s, batch 3) → verified hits
written back as `amf_verified`, misses `amf_not_found`. Run after big A2 scrapes.
First run: 33 processed → 25 found, 8 not found, 24 credits. Coverage now 241/249 (97%).

AMF learnings:
- Old v5.0 paths are dead; newapp accounts use **v5.1**. Auth header is the raw key
  (`Authorization: <key>`); Bearer also works.
- Success = `email_status: "valid"` and `valid_email` contains the EMAIL STRING (not a
  boolean) — first run misfiled all 25 hits by testing `valid_email === true`.
- Credits charged ONLY on valid finds; not_found = free; repeated searches are cached
  and free — a failed-parse run costs nothing to replay.
- Some lookups exceed 60s (live mailbox verification) — 120s timeout needed.

## Phase A2c - Google Maps Lead Scraper (BUILT + VERIFIED 2026-07-11, overnight loop)

WF `BQMGiag3WGiQuefi` (manual): actor `lukaskrivka/google-maps-with-contact-details`
(`WnMxbsRLNbPeYL6ge`, no permission wall) — Google Maps places with websites in a
Nigerian city → role emails crawled from their sites (NDPA-safer than named people).
Run Config: searchTerms (comma list), locationQuery ("Lagos, Nigeria"), maxPerSearch.
Keep terms × maxPerSearch ≤ ~80/run (run-sync 300s cap). First run: 60 places → 56
inserted, 36 with role emails. These leads have no person/LinkedIn → A3 uses sector
openers; rows without ANY email are skipped by A3 (email isNotEmpty filter) and
nameless rows are excluded from A2b person-search (Filter Enrichable node).

## Overnight verification (2026-07-11 ~03:00)

- A3 50-lead drain (exec 2198): 50 fetched → **45 ClickUp cards** (Flutterwave, Heirs
  Holdings, Accion MFB, Jobberman…), 3 qualify-rejected, 2 left `new` for retry.
  Data flow into ClickUp confirmed at volume. Board now ~48 Pending Review cards.
- Lead DB ≈ 305 companies across three sources (leads-finder, AMF-enriched, gmaps).
- Refactors shipped: real-first-name baking, icebreaker employer guard, AMF parse fix,
  A3 email-required filter, A2b nameless-row filter. A3 republished ACTIVE.

## Bulk-move incident + fixes (2026-07-11 morning)

**Bulk status changes in ClickUp do NOT fire per-task webhooks** — cards bulk-moved to
Approved/Sent were never processed by the Approve Handler. Audit showed the 82 Sent
cards were fine (processed on earlier days); 24 Approved cards (all Pipeline-1, no
email) were stuck. Fixes shipped:
- **Approve Handler**: new "Has Email?" branch — pre-enriched (Apify) leads skip Lusha
  entirely (~2cr saved per approval). Republished.
- **Cadence Scanner**: hard cap 35 sends/run (backlog can never mass-send). Republished.
- **Reconcile workflows** (one-off, safe to re-run): `xQZuSkFIuOFhbMT5` activates
  approved/sent cards whose rows have emails (staggered 10/weekday); `eA0L565CkOMBOd1v`
  replays the Lusha step for approved no-email cards (staggered 8/weekday, Nigeria-only
  contact filter). Result: 1/24 recovered (Baywood Continental); other 23 not in Lusha —
  left in Approved for manual triage.
- **RULE: approve cards ONE BY ONE** (individual status changes fire webhooks reliably).
- Lusha gotcha: contact matches can be foreign companies with similar names — always
  filter `location.country === 'Nigeria'` before enriching.

## West Africa expansion (2026-07-14) — country parameterization

The pipeline is now multi-country (Anglophone West Africa v1: **Ghana, Sierra Leone,
Liberia, Gambia**; Nigeria unchanged). Country is a parameter/column, not a fork:

- **Data tables**: `country` column added to Apify Lead DB + Cold Outreach Sends;
  all pre-existing rows backfilled to `Nigeria`. Every workflow read uses
  `country || 'Nigeria'` so legacy/NULL rows behave exactly as before.
- **A2**: Run Config has a `country` field (one country per run) feeding the actor's
  `contact_location`; icpLabel + gate prompt are country-neutral ("target country");
  Normalize/Insert stamp `country` on every row.
- **A3**: qualify outputs `countryMatch` (was `isNigeria`) vs the row's country; draft
  prompt is West-Africa-aware (footer still Lekki, Lagos — sender identity); ClickUp
  card routing by market (see Flow); send-state row carries country.
- **Approve Handler**: second ClickUp trigger on the WA list `901219526986`; Lusha
  "Pick Best Contact" scores `location.country === row.country` (was hardcoded Nigeria).
  Apify-sourced leads still skip Lusha via Has Email?.
- **Review lists**: Nigeria keeps `901219065232`; all WA markets share
  **"Cold Outreach Review — West Africa" `901219526986`** ([Country]-prefixed cards).
  ⚠️ Custom statuses (Pending Review/Approved/Sent/Replied/Rejected) must be set in
  the ClickUp UI per list — the API cannot create them.
- **Dedup**: unchanged, domain-based across countries — pan-African groups (Ecobank,
  MTN, UBA…) get ONE touch total; a Ghana lead at an already-contacted group domain is
  skipped by design.
- **Gate history (2026-07-14, all with standard titles + 51+ size bands)**:
  Ghana PASSED 22/25 (88%) — AT Ghana, Etranzact, Universal Merchant Bank in sample.
  Sierra Leone PASSED 22/25 (88%). Liberia PASSED 20/25 (80%) — all mismatches NGOs
  (Mercy Corps, Oxfam, WFP…); Liberia's formal economy is NGO-heavy, so expect NGO
  leads to reach qualify/review — reject there if not wanted.
- **⚠️ Gambia is NOT supported by the leads-finder actor** — its `contact_location`
  allowed-values list has nigeria/ghana/sierra leone/liberia but NO Gambia variant
  ("gambia" and "the gambia" both 400). Alternative if Gambia is ever wanted: A2c
  Google-Maps scraper pointed at Banjul (role emails, no person data).
- **Full-run yields (2026-07-14)**: Ghana 295→219 inserted (197 emails, $0.44);
  Sierra Leone 97→76 (40 emails, $0.15 — pool exhausted below the 300 ask);
  Liberia 91→60 (34 emails, $0.14). Email-less rows can be AMF-enriched via A2b.
- **Compliance**: Ghana Data Protection Act 2012 (Act 843) is the strictest of the
  four — confirm lawful basis with counsel before scaling (as with NDPA). Sierra
  Leone/Liberia/Gambia had no comprehensive data-protection statute in force as of
  mid-2026 — verify current status before scale. Opt-out + suppression apply to all
  markets.

## Follow-ups (not built)
- Approve Handler: ~~skip Lusha when the send-state row already has an email~~ DONE
  2026-07-11 (Has Email? branch).
- Weekly schedule on A2 with a vetted query config (add only after gate-passed queries exist).
- Francophone West Africa (French drafting + reply handling) — deliberately out of scope v1.
