# EquaCore Cold-Outreach Engine — How It Works (Team Guide)

*Last updated: 2026-06-24*

This is the end-to-end guide to EquaCore's automated cold-outreach system. It finds Nigerian
companies, writes personalised cold emails, sends them on a schedule, and uses an AI agent to draft
replies — with **a human in control at the two moments that matter**: which leads to pursue, and
which replies to send.

---

## 1. The big picture

```
  ┌──────────────────────────────────────────────────────────────────────────────┐
  │                          THE WEEKLY LOOP (mostly automatic)                    │
  └──────────────────────────────────────────────────────────────────────────────┘

  (1) DISCOVER            (2) REVIEW            (3) ENRICH + SEND        (4) CONVERSE
  ────────────           ────────────          ──────────────────      ──────────────
  Every Monday,          50 cards land on      You move a card to      Prospect replies →
  the system scrapes     the "Cold Outreach    "Approved" →            AI drafts an answer →
  Nigerian company       Review" board in      • finds the decision-   you approve by email →
  directories, writes    ClickUp, each with    maker's email (Lusha)   it sends from sales@.
  a 3-email Halo         a ready-to-send       • emails them from       Pricing/legal/etc. is
  sequence per company,  draft.                  sales@ on a 3-step     escalated to a human.
  and creates a card.    ┌── YOU REVIEW ──┐     drip cadence
                         │ approve / reject│    • adds them to the
                         └────────────────┘      sales pipeline

        ▲ automatic            ▲ HUMAN              ▲ automatic            ▲ HUMAN approves
                                 GATE                                        each reply
```

**Two human decisions, everything else automated:**
1. **Approve a card** = "yes, contact this company." (Nothing is emailed until you do this.)
2. **Approve a reply** = "yes, send this answer." (The AI never emails a prospect on its own.)

---

## 2. The four stages in detail

### Stage 1 — Discovery (runs every Monday, or on demand)
- Scrapes **8 sector directories** of Nigerian companies (manufacturing, oil & gas, food & beverage,
  healthcare, IT services/MSP, pharma, transport & logistics, business consulting).
- Pulls up to **50 new companies per run** (it remembers everyone it's already added, so it never
  repeats — each week it works through the next 50).
- For each company: an AI checks it's a real, relevant Nigerian business, then **Claude writes a
  short 3-email sequence** that leads with **Halo** (our flagship pitch).
- Each company becomes a **card on the "Cold Outreach Review" board** in ClickUp, status **Pending
  Review**, with all three emails written out for you to read.

> The emails are written *before* we know the person's name, so they start with a placeholder. The
> real first name is filled in automatically at send time (see Stage 3).

### Stage 2 — Review (you)
- Open the **Cold Outreach Review** board in ClickUp. Each card = one company, with the draft emails
  in the description.
- **Edit the emails if you want**, then **drag the card to "Approved"** for the ones worth pursuing.
- Reject/ignore the rest. **Approving is the only thing that triggers an actual send.**
- Pace yourself to roughly **20 approvals per month** (that's the limit of our free contact-lookup
  tool — see the runbook).

### Stage 3 — Enrich & Send (automatic, the moment you approve)
When a card hits **Approved**, the system:
1. **Finds the right decision-maker** at that company and reveals their **verified work email**.
2. **Personalises the greeting** — "Hello Paul," instead of "Hi there," using the real name (and if
   it can't find a name, it safely falls back to "Hello there," — never "Hello info,").
3. **Sends email 1** from `sales@equacoredigital.com`, then **follow-ups every 3 days** (3 emails
   total) unless the prospect replies first.
4. **Moves the card to "Sent"** and **creates a lead** in the Sales Pipeline → *New Leads*.
- The sender name rotates across **Tosin → Emeka → Michael** so it looks like a real person.
- Every email carries the demo **booking link** and a compliance footer.

### Stage 4 — Reply handling (AI agent + your approval)
When a prospect **replies**:
- The system reads it and decides:
  - **"unsubscribe" / "remove me"** → suppresses them, marks the card **Rejected**. (Done, no human.)
  - **Out-of-office / auto-reply** → ignored (no pointless back-and-forth).
  - **A real reply** → **Claude drafts a short response** whose job is to **book the 20-minute demo**.
- **Claude's draft is emailed to you** (`tosindada@equacoredigital.com`, cc `emekachiazor@`) with two
  buttons: **"Send it"** and **"I'll handle it."**
  - Click **Send it** → the reply goes to the prospect from `sales@`.
  - Click **I'll handle it** → it stops and leaves you a note to take over.
- **Some replies are never auto-drafted — they go straight to you** with a note on the card:
  pricing/quotes, legal/security/contracts, scope/SLA/integration questions, "are you a ServiceNow
  partner?", or anything the AI is unsure about. The AI is also blocked from ever quoting a price,
  promising a timeline, or claiming we're a ServiceNow partner (we're a **Halo** partner).
- After 2 rounds of back-and-forth, it hands the conversation to a human automatically.

---

## 3. What the emails say (positioning)

- **Lead with Halo** (HaloITSM / HaloPSA / HaloCRM) — service management, PSA and customer service in
  one platform; all modules included (no per-feature licensing); faster to go live and cheaper to run
  than Zendesk/Freshdesk; clean migration off legacy tools.
- **ServiceNow** is mentioned only as a secondary "we also implement it via a partner" line, and only
  in a follow-up — never the opener (few Nigerian firms run ServiceNow).
- **Short and human** — email 1 is ≤ 60 words, follow-ups shorter, one idea + one ask, no corporate
  buzzwords, no "if useful" hedging.
- **One call to action**: book a 20-minute demo via the Microsoft Bookings link.

---

## 4. Where to look for what

| You want to… | Go to… |
|---|---|
| Review & approve leads | ClickUp → **Cold Outreach Review** board |
| See leads that became opportunities | ClickUp → **Sales Pipeline → New Leads** |
| Approve an AI-drafted reply | The **tosindada@equacoredigital.com** inbox (cc emekachiazor@) |
| See/▶ run the automations | n8n → the four "Phase A / Phase B …" workflows |
| The outbound mailbox | `sales@equacoredigital.com` (Zoho) |

---

## 5. What stays manual (on purpose)

- **Approving cards** (which companies to contact).
- **Approving AI replies** (what we say back).
- **Anything sensitive** — pricing, contracts, security, scope — always lands with a human.

Everything else — discovery, writing, personalising, sending, follow-ups, reply drafting,
opt-out handling — runs on its own.

---

## 6. Important note before scaling

Nigerian data-protection law (**NDPA 2023**) may require a lawful basis (often consent) for cold
marketing to named individuals. Before pushing high volume, **confirm our lawful basis with Nigerian
counsel**. We already honour opt-outs instantly and permanently; keep doing so.

---

*For technical details, IDs, credentials, and troubleshooting, see `MAINTENANCE-RUNBOOK.md`.*
