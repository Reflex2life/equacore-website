# EquaCore Cold Outreach Automation

Outbound lead-gen engine: discover Nigerian ICP-fit companies → scrape → qualify → draft
personalized cold emails → human review → send a 3-step sequence from `sales@` (Zoho).

**Status:** in build (Phase A). Draft-model bake-off complete → **OpenAI `gpt-5-mini`** locked
for drafting. See `docs/spec.md` for the full design.

## Pipeline (Phase A — discover → draft → review)

1. **Discover** (Nigeria only): hybrid — Nigerian directories + ICP search queries.
2. **Scrape (tiered):** free n8n HTTP fetch + HTML/regex extract → Firecrawl API fallback
   only on JS/anti-bot/no-email.
3. **Qualify:** DeepSeek (`deepseek-chat`), hard-drops non-Nigeria companies.
4. **Draft:** OpenAI `gpt-5-mini` + structured parser → 3-step sequence (see
   `prompts/draft-email-prompt.md`). Human voice, zero AI buzzwords.
5. **Review queue:** SharePoint list `Cold Outreach Leads` (Status=Pending) → human approves.

## Phase B — n8n + Zoho send engine (later)

Approved rows → n8n sends the sequence from `sales@equacoredigital.com` (Zoho SMTP),
throttled, stop-on-reply via IMAP, unsubscribe/bounce → `Outreach Suppression`. No
third-party platform, no separate domain.

## Folders

- `docs/` — `spec.md` (design).
- `prompts/` — locked drafting prompt + (later) qualification prompt.
- `workflows/` — exported n8n workflow JSON.
- `config/` — Nigerian directory URLs + ICP queries seed; SharePoint list schemas.

This folder is the **versioned source**; the canonical team copy is the "Cold Outreach
Automation" SharePoint document library on the EquaCoreCustomerEnquiries site.

## Outstanding to proceed with the build

- n8n credentials: **Firecrawl** (Header Auth), **Microsoft SharePoint OAuth2** (info@),
  later **Zoho `sales@`** (SMTP+IMAP). Verify Zoho DKIM on `.com`.
- Seed: Nigerian **directory URLs + ICP search queries** for discovery.
- Compliance: NDPA-primary; footer identity + address + unsubscribe + privacy on every email.
