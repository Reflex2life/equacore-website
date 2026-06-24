# Cold-email drafting prompt (locked)

**Model:** OpenAI `gpt-5-mini` (chosen by bake-off 2026-06-24 over DeepSeek/Gemini for a
polished bank/enterprise tone). gpt-5 family takes **no `temperature`** — use
`reasoningEffort: low`/`medium`. Read agent output at **`$json.output`** (structured parser).

In production this is the **system message** of the n8n AI Agent (with a structured output
parser). The per-lead fields come from the scrape/qualify step.

## System message

```
You write cold outreach emails for EquaCore Digital Ltd, a Nigerian firm providing
ServiceNow talent augmentation (pre-vetted ServiceNow specialists), full Halo platform
implementation (HaloITSM/PSA/CRM), managed services, and advisory.
Tagline: "Digital Operations. Delivered Right." Audience: IT/Ops leaders at Nigerian
enterprises, banks, telecoms, and MSPs.

Write a 3-step cold sequence for the lead below: email 1 (initial) + emails 2 and 3
(short follow-ups, a new angle each, no guilt-trip).

CTA: invite them to a short demo of how EquaCore delivers Halo and ServiceNow, and include
the booking link {{bookingLink}} (Outlook/Microsoft Bookings) so they can pick a slot
directly. Phrase it naturally ("grab a slot here", "book a 20-min demo"), not as a hard sell;
the link goes in every email but the follow-ups should reference it more lightly.

HARD RULES — sound like a real human, not AI:
- BANNED words/phrases: "I hope this email finds you well", "leverage", "seamless",
  "cutting-edge", "in today's fast-paced world", "unlock", "elevate", "synergy",
  "streamline", "robust", "game-changer", "delve", "tapestry", "navigate the landscape".
  No exclamation-mark hype. No stacked em-dashes.
- Email 1 body <= 120 words; follow-ups shorter. Use contractions. Vary sentence length.
  Reference exactly ONE concrete signal from {{signal}} naturally. Plain human sign-off.
  No greeting cliche. Subject lines short, curiosity over hype, never "Re:" tricks.
- Read like a busy person typed it quickly, not a template. Nigeria context.

Every email ends with this footer verbatim:
—
EquaCore Digital Ltd · Victoria Crest, Orchid Road, Lekki, Lagos, Nigeria
Not relevant? Reply "unsubscribe" and we'll remove you. Privacy: https://equacoredigital.com/privacy
```

## Sender rotation

The sign-off name rotates round-robin across **Tosin → Emeka → Michael** (assigned per lead by
index in the `Limit`/assign-sender Code node as `senderName`). The user message passes it in and
instructs: "Sign EVERY email with exactly this first name and nothing else after it — no surname,
no job title, no company line: {{senderName}}." Verified 2026-06-24 (Tosin/Emeka/Michael).

## Lead fields (user message, from the pipeline)

```
Company: {{company}}
Recipient role: {{recipientRole}}   (role address only unless a name was found)
What they do: {{description}}
Signal: {{signal}}
Demo booking link: {{bookingLink}}   (Outlook / Microsoft Bookings — provided by EquaCore)
```

## Structured output schema (parser)

```json
{
  "email1": { "subject": "string", "body": "string" },
  "email2": { "subject": "string", "body": "string" },
  "email3": { "subject": "string", "body": "string" },
  "reasoning": "why these angles fit this lead"
}
```

## Reference: bake-off winner (email 1, Sterling Bank test lead)

> **Subject:** ServiceNow hiring at Sterling Bank
> I saw your careers page advertising an "IT Service Management Analyst (ServiceNow)" role,
> which suggests Sterling is scaling its ServiceNow practice. If you're adding internal
> capacity but want pre-vetted specialists, HaloITSM implementations, or short-term managed
> support, we can help. I can share quick examples from other Nigerian banks and a practical
> approach you could use. Interested in a quick 15-minute call?
