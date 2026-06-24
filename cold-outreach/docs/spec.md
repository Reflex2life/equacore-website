# EquaCore Cold Outreach — Design Spec

**Date:** 2026-06-24 · **Status:** Phase A in build · Owner: Emeka Chiazor

## Goal & scope

Add an outbound channel: discover Nigerian ICP-fit companies, scrape them, draft
personalized cold emails, route through human review, and send a 3-step sequence from
`sales@equacoredigital.com`. **v1 scope = Nigeria only** (non-NG companies hard-dropped;
UK/EU/NA later). Complements existing inbound (contact form / Tally → Make.com → SharePoint).

## Architecture (two phases)

- **Phase A — discover → scrape → qualify → draft → SharePoint review queue.** Build + prove
  now; zero emails sent.
- **Phase B — n8n + Zoho send engine.** Approved rows → 3-step sequence from `sales@` (Zoho),
  throttle, stop-on-reply (IMAP), unsubscribe/bounce → suppression. No SaaS platform, no
  separate domain (established-domain sending; reputation protected by volume discipline).

Orchestration: n8n (`voidnox.app.n8n.cloud`), built via the n8n-expert skill process.

## Models

- **Qualify:** DeepSeek `deepseek-chat` (cheap internal boolean; hard-drop non-Nigeria).
- **Draft:** OpenAI `gpt-5-mini` — chosen by bake-off (2026-06-24) for polished bank-buyer
  tone. NO `temperature` (gpt-5); read agent output at `$json.output`.
- Routing policy: `model-cost-preference` memory + n8n-expert `model-routing.md`.

## Scraping (tiered — conserve Firecrawl credits)

Tier 1 = free n8n HTTP fetch + HTML Extract/regex (emails, about/services, signals).
Tier 2 = Firecrawl API (Header-Auth cred) fallback only on JS-rendered/anti-bot/no-email.

## Data model (SharePoint lists)

**`Cold Outreach Leads`** (review queue): Company, Website, Location, Industry, ContactEmail,
ContactName?, ContactRole, Signal, ICPReason, Email1Subject, Email1Body, Email2Subject,
Email2Body, Email3Subject, Email3Body, Status (`Pending|Approved|Rejected|Sent|Replied|
Unsubscribed`), SeqStep, NextSendAt, DiscoveredAt, Source, DedupKey(domain).

**`Outreach Suppression`**: DedupKey(domain), Email, Reason (already-contacted|unsubscribed|
bounced|client|competitor), AddedAt.

## Compliance (NDPA-primary v1)

Footer on every email: EquaCore Digital Ltd · Victoria Crest, Orchid Road, Lekki, Lagos,
Nigeria · unsubscribe · https://equacoredigital.com/privacy. B2B legitimate-interest
(business/role addresses only); honor opt-outs permanently via suppression; truthful
subjects/headers; conservative volume (start ~10–20/day, ramp).

## Credentials

Have (n8n): DeepSeek, OpenAI, Gemini. Add: Firecrawl (Header Auth), Microsoft SharePoint
OAuth2 (info@); Phase B: Zoho `sales@` (SMTP+IMAP, verify `.com` DKIM). Optional: Brave
Search API. Secrets live only as n8n credentials — never committed.

## Decisions log

- Nigeria-only v1; hybrid discovery (directories + queries); site-scrape emails (role
  addresses acceptable MVP; finder API later).
- Sending from `sales@` (Zoho), n8n-owned send engine — no cold-email platform / no separate
  domain. `info@` (M365) = n8n SharePoint CRUD identity.
- Review queue in SharePoint (fallback: n8n Data Table / Google Sheets if OAuth painful).
- 3-step sequence, stop-on-reply.
- Draft model = OpenAI `gpt-5-mini` (bake-off winner); qualify = DeepSeek.
- Artifacts: canonical = "Cold Outreach Automation" SharePoint doc library; versioned mirror
  = this repo `cold-outreach/`.

## Verification

Per-node `validate_node_config` + `validate_workflow`; Phase A live test on a tiny seed
(read `get_execution(includeData:true)`, inspect SharePoint rows, no emails sent); Phase B
test to internal addresses before real volume.
