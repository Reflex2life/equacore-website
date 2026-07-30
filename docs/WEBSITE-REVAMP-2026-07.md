# EquaCore Website Revamp — July 2026

Last updated: 2026-07-04

This document records the full set of changes made to the EquaCore Digital
website during the July 2026 revamp. It covers the visual redesign, the
demo-booking conversion funnel, the migration of all form automation from
Make.com to n8n, SEO/security hardening, and the mobile-layout fixes.

For the underlying hosting/DNS/email environment, see
[`ENVIRONMENT.md`](ENVIRONMENT.md). For live secrets (workflow credentials,
Turnstile secret key, booking-owner identifiers) see the untracked
`INFRASTRUCTURE.md` at the repo root.

## Executive Summary

The site was rebuilt from a light corporate template into a dark
"restrained-glow" experience whose single job is to convert visitors into
booked demos. The raw Microsoft Bookings link was removed from every page and
placed behind a lead-capture gate, so bots can no longer book meetings and every
demo click becomes a captured lead. All three website forms (contact, demo gate,
talent pool) now run on n8n instead of Make.com. The work shipped as 16 commits
(`33d7f5e` → `db1b6bb`) on the `cold-outreach-automation` branch, each
fast-forwarded to `main` for Cloudflare Pages to build.

| Area | Before | After |
|---|---|---|
| Theme | Light corporate template | Dark ink surfaces + mint neon accents |
| Primary CTA | Inline "Contact us" | Site-wide "Book a demo" funnel |
| Booking link | Exposed raw on every page | Gated behind lead capture + Turnstile |
| Form backend | Make.com (2 scenarios) | n8n (3 workflows) |
| Talent pool | Tally embed | Native on-site form → n8n |
| Prerendering | Homepage meta on every route | Per-route static HTML for crawlers |
| Security headers | None | Full `_headers` policy set |

## Commit Map

| Commit | Change |
|---|---|
| `33d7f5e` | Website revamp: restrained-glow dark theme + demo-booking funnel |
| `07c1b1c` | Remove grid mesh; extend dark glow rhythm to all subpages |
| `4a019b8` | Add Aether Flow particle network behind the home hero |
| `1451642` | Gate demo booking behind lead-capture modal; forms point to n8n |
| `76a6b49` | Replace Tally with n8n-hosted talent pool form |
| `196a95a` | Reword hero: lead with Halo & ServiceNow platform work |
| `4c69710` | Embed native talent-pool form (multipart → n8n webhook) |
| `9fade4d` | Drop Make.com from CSP — n8n cutover complete |
| `2129393` | Add cursor-tracking mint glow border to home offering cards |
| `f62006d` | Extend cursor-glow border to all card components site-wide |
| `7a85804` | Security, SEO & AI-slop audit remediation |
| `731b599` | Update privacy policy to match current data flows |
| `88080ce` | Restore full talent-pool fields; name CV after candidate |
| `2fc422c` | Add cursor-tracking mint glow to the nav header |
| `167c287` | Fix horizontal overflow on /talent at mobile widths |
| `db1b6bb` | Fix approach-timeline number alignment on mobile |

## 1. Design System

The site remains a single static SPA in `index.html`. All redesign CSS lives in
one `/* RESTRAINED GLOW */` append-override block at the end of the `<style>`
element — future overrides go there, never scattered through the base sheet.

### Colour tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B1120` | Primary dark surface |
| `--neon` | `#2DD4BF` | Text/icon accent on dark (AA-safe) |
| `--mint` | `#0D9488` | Decorative only on dark (fails AA for text) |
| `--grad-mint` | mint gradient | Headline highlight, CTA fills |

Rule: neon mint is the only accent colour. No purple gradients, no sparkle/robot
"AI" iconography — those were explicitly rejected as generic "AI slop".

### Signature effects — removed (ENG-30, July 2026)

The revamp shipped four decorative effects. All were removed in ENG-30, which
moved the site toward enterprise restraint: depth from layered surfaces and
hairline rules rather than glow and motion. They are recorded here because the
commits remain in history, not because the code is still present.

- **Lamp-beam hero** — a pure-CSS radial beam behind the home headline, with a
  slow breathing opacity animation. Removed with its keyframes.
- **Aether Flow** (`#af`, commit `4a019b8`) — a vanilla-JS particle-network
  canvas in the home hero. Removed: CSS rule, JS block, and the `<canvas>`.
- **Cursor-tracking glow border** (commits `2129393`, `f62006d`, `2fc422c`) — a
  masked gradient border following the pointer, driven by a `pointermove`
  listener writing `--x`/`--y` to `:root`. It painted on twelve selectors, not
  only the three cards carrying the class. Removed entirely.
- **Pulsing bloom on `.btn-book`** — an animated mint halo behind the primary
  CTA. Removed; the button now carries a solid mint fill and a hairline.

What survives: the `feTurbulence` grain overlay, at reduced opacity
(`.04` → `.025`). It reads as print texture rather than spectacle. The `.rv`
reveal system, its `.d1`–`.d4` stagger and `--ease` are untouched — that is the
site's core motion and it stays.

## 2. Demo-Booking Conversion Funnel

The revamp's core goal. The Microsoft Bookings URL was stripped from all 10
booking anchors; each now carries a `data-book` attribute and a `href="/contact"`
no-JS fallback. Clicking one opens the booking modal (`#bkm`) instead of the
calendar.

Flow:

1. Visitor clicks any "Book a demo" control → modal opens with name / work email
   / company fields, a honeypot input, and a Cloudflare Turnstile widget
   (sitekey `0x4AAAAAADNeUrBaLGCiZE2q`, rendered explicitly on first open).
2. Submit → client-side spam checks (honeypot, 3-second time-trap, email regex +
   disposable-domain blocklist) → `fetch POST` to the n8n `demo-gate` webhook.
3. n8n verifies the Turnstile token server-side, records the lead in SharePoint,
   and returns the booking URL **only on success**.
4. The page opens the returned URL in a new tab, validated against an
   `office.com` / `microsoft.com` allow-list before `window.open`.

Result: bots hitting the webhook without a valid token get `{ok:false}` and no
URL; every legitimate demo click is captured as a SharePoint lead even if the
visitor abandons the calendar. The booking link itself was **not** rotated, so
in-flight cold-outreach emails keep working.

Booking availability (Microsoft Bookings "Halo & ServiceNow Demo") was set to
**Monday–Friday, 09:00–16:00**, weekends off.

## 3. Form Automation — Make.com → n8n

All customer-facing form automation moved to n8n (`voidnox.app.n8n.cloud`),
where the sales pipeline already runs. SharePoint writes use the **REST API**
(`/_api/...`); Microsoft Graph returns 401 for this credential. n8n IF nodes
that check for boolean-true need `looseTypeValidation:true`, or they throw
"Wrong type: '' is a string".

| Webhook (POST) | Replaces | Does |
|---|---|---|
| `/webhook/website-contact` | Make scenario 5527696 | Spam guard + Turnstile → SharePoint *Website Enquiries* → Zoho confirmation email |
| `/webhook/demo-gate` | (new) | Spam guard + Turnstile → SharePoint *Demo Requests* → returns booking URL |
| `/webhook/talent-apply` | Make scenario 5524704 + Tally | Multipart (fields + CV) → SharePoint *Talent Pool* item + CV upload → candidate + internal emails |

Verified live: contact form (execution 982 → SharePoint item + Zoho email);
demo gate (execution 978). Zoho SMTP sends as `sales@equacoredigital.com`.

SharePoint column internal names (verified): *Website Enquiries* =
Title/Email/Company/Platform/Message; *Talent Pool* LinkedIn column is
`LinkedInURL` (not `LinkedIn`); *Demo Requests* = Title/Email/Company/Source.

### Talent-pool native form

n8n Cloud serves `X-Frame-Options: SAMEORIGIN` on hosted Forms and offers no
custom-domain embed, so the hosted form **cannot** be iframed or rebranded.
`/talent-pool` therefore uses a native HTML form (`#tpf`, commit `4c69710`) that
POSTs `multipart/form-data` to the `talent-apply` webhook. Fields: name, email,
phone, country, LinkedIn, specialism, experience, availability, engagement,
certifications, cover note, CV file, consent.

Two fixes landed in commit `88080ce`:

- **Field restore** — specialism/experience/availability/engagement/
  certifications/cover-note were re-added after an earlier trim.
- **CV naming** — the CV had been uploading as `email_hash.pdf`; it is now named
  after the candidate (`<safe name> - CV.<ext>`). In the workflow the CV binary
  is re-attached from the webhook node (`$('Talent Apply Webhook').first().binary`)
  before the SharePoint upload, because the Turnstile HTTP node's output
  otherwise replaces the item and loses the binary.

## 4. SEO & Prerendering

`scripts/prerender.py` runs as the Cloudflare Pages build command and writes one
static file per indexable route (`services.html`, `servicenow.html`, …). Non-JS
crawlers (Perplexity, ChatGPT browse, AI-Overview fetchers) would otherwise see
the homepage's meta on every URL.

Each generated file gets a route-specific `<title>`, description, canonical,
OG/Twitter tags, and its matching `.pg` section pre-marked `act`. The script:

- **Root-relative canonicals** so `.ng` URLs stay self-canonical for non-JS
  crawlers (a compliance requirement — `.ng` must not canonicalise to `.com`).
- **Strips the homepage FAQPage JSON-LD from subpages** (the FAQ isn't visible
  there — a Google structured-data guideline) and injects per-route
  BreadcrumbList + Service schema instead.
- **Refreshes `sitemap.xml` `<lastmod>`** to the build date.

The homepage FAQPage JSON-LD must exactly mirror the 6 visible `<details>`
entries. `index.html`'s `titles`/`descs` router maps must stay in sync with the
`ROUTES` map in `prerender.py`.

## 5. Security Hardening (commit `7a85804`)

### Response headers — `_headers`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: frame-ancestors 'none'
```

### Content-Security-Policy meta (`index.html`)

`connect-src` allows `https://voidnox.app.n8n.cloud` (the n8n webhooks) plus
Google Analytics; `script-src` allows the GA tags and
`https://challenges.cloudflare.com` (Turnstile). Make.com was removed from the
CSP once the cutover completed (commit `9fade4d`).

### Repository hygiene — `.gitignore`

Blocks internal/PII/credential files from ever being committed:
`*.csv`, `.~lock.*#`, `*onboarding*`, `*_Session_Context_*`,
`CEO_*_Review_*.md`, `EquaCore_Zoho_*`, `EquaCore_Talent_Pool_*`, plus the
pre-existing `INFRASTRUCTURE.md` and office-document patterns. These files hold
cleartext credentials/PII; the audit confirmed they had **0 commits** in history
(no leak). If any are ever pushed, rotate the affected credentials immediately.

### Other audit outcomes

- The demo-gate `window.open(url)` is allow-listed to office.com/microsoft.com.
- "AI slop" copy and iconography were removed or rewritten.
- Privacy policy rewritten (commit `731b599`) to match the current n8n data
  flows, Turnstile processing, SharePoint storage, and Zoho email.

## 6. Mobile Layout Fixes

Audited at a true 390×844 iPhone viewport. Two real defects found and fixed:

- **`/talent` horizontal overflow** (commit `167c287`) — the "Our Model"
  section set `grid-template-columns:1fr 1fr` *inline*, which outranks the
  responsive media query, so the grid never collapsed on phones and forced the
  page to ~561px (horizontal scroll). Fix:
  `@media(max-width:1024px){.tc{grid-template-columns:1fr!important}}`.
- **Approach-timeline number displacement** (commit `db1b6bb`) — on mobile the
  left-side steps (Discovery/Adoption) list content before their number dot in
  the DOM. CSS Grid sparse auto-placement wrapped those dots to a second row, so
  01/03 rendered *below* their text. Fix: pin `.tl-c` and `.tl-d` to `grid-row:1`
  and top-align the row inside `@media(max-width:1024px)`.

Everything else (hero, forms, nav menu, booking modal, tap targets ≥44px)
verified clean at 390px.

## 7. Deployment

- **Deploy = push the branch to `main`.** Cloudflare Pages builds `main`
  (~1–2 min), running `python3 scripts/prerender.py` as the build command.
- Push over **SSH**, not HTTPS: the macOS osxkeychain helper can't unlock in a
  non-interactive shell. `origin` is
  `git@github.com:Reflex2life/equacore-website.git`; the working command is
  `git push origin cold-outreach-automation:main`.
- After any `index.html` edit, run the prerender script and commit the 10
  regenerated route files alongside it.

## 8. Open Items (owner: EquaCore)

These require account access that automation can't reach:

1. **Live talent-form smoke test** — submit the form once with a real CV to
   confirm the restored fields and candidate-named CV land in the SharePoint
   Talent Pool document library. Browser file-upload plus the Turnstile token
   can't be driven headlessly.
2. **Deactivate the dormant Make.com scenarios** — 5527696 (contact) and
   5524704 (Tally). n8n has fully taken over both flows; the Make scenarios are
   left on-canvas as a documented fallback but should show zero new executions.
3. **Optional** — decide whether to add SharePoint columns + form fields for
   Bio / "how did you hear about us" / passport photo (the old Tally form
   collected these, but no matching SharePoint columns ever existed).
