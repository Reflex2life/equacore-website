# EquaCore Digital — Website

Source for [equacoredigital.com](https://equacoredigital.com) — the website for EquaCore Digital Ltd, a digital operations consulting firm specialising in ServiceNow talent augmentation, HaloITSM implementation, managed services, and independent advisory.

## Hosting & deployment

- **Hosted on Cloudflare Pages** — auto-deploys on push to `main`.
- DNS sits at Cloudflare (apex + `www` proxied; M365 / SendGrid / verification records DNS-only).
- The `_redirects` file (`/* /index.html 200`) is a Cloudflare Pages SPA fallback rule: every path returns `index.html`, then the in-page JS router shows the matching page div.
- The `CNAME` file at the repo root pins the custom domain.
- The `_headers` file sets cache policy: HTML revalidates every request; static assets (`.js`, `.css`, `.svg`, `.jpg`, `.png`, `.webp`, `.woff2`) are immutable for one year.

For full infrastructure details (DNS records, Make.com pipeline, SendGrid, SharePoint, etc.) see [`INFRASTRUCTURE.md`](./INFRASTRUCTURE.md). That file contains live API keys — keep it untracked.

## Tech stack

- Single-file HTML (`index.html`) with embedded CSS and JS — no build step, no dependencies.
- Inter + Plus Jakarta Sans loaded from Google Fonts (preloaded, non-blocking).
- Path-based routing using the History API (`pushState` / `popstate`) — no hash fragments. Cloudflare Pages serves `index.html` for any path; `handleRoute()` reads `location.pathname` and shows the matching `<div class="pg" id="pg-…">`.
- Google Analytics 4 (`G-JP8C5PXHH5`).
- Strict CSP, including `frame-ancestors 'none'` and `tally.so` for the talent pool embed.

## Pages

| Path | Page |
|---|---|
| `/` | Home |
| `/services` | Services overview |
| `/servicenow` | ServiceNow services (Talent + Managed Services + Advisory — **not** partner) |
| `/haloitsm` | HaloITSM services (official Halo partner) |
| `/talent` | Talent Augmentation |
| `/talent-pool` | Tally.so registration form for ServiceNow / HaloITSM specialists |
| `/engagement` | Engagement Models |
| `/about` | About EquaCore |
| `/markets` | Markets Served |
| `/contact` | Contact form (POSTs to Make.com webhook) |
| `/privacy` | Privacy Policy (NDPA 2023 + UK/EU GDPR) |
| `/enquiry-thanks` | Post-contact-form confirmation (JS-pushed; not in sitemap) |
| `/thank-you` | Post-Tally-submit confirmation (Tally redirect target; not in sitemap) |

## File layout

```
index.html                          — Complete website (13 page divs)
INFRASTRUCTURE.md                   — Full infra reference (untracked, contains API keys)
EquaCore_Digital_Infrastructure.pdf — Same content as PDF (untracked)
README.md                           — This file
CNAME                               — Custom domain pin (equacoredigital.com)
_redirects                          — Cloudflare Pages SPA fallback
_headers                            — Cache headers for static assets
sitemap.xml                         — 11 indexable URLs
robots.txt                          — Allow all + sitemap pointer
ms49929093.txt                      — Microsoft 365 domain verification
googleca6828c7e29f9e75.html         — Google Search Console verification
halo-logo-{white,dark}.svg          — HaloITSM official partner brand assets
hero-{strategy,platform,team}.jpg   — Page hero photography
scripts/check-trademark-risk.py     — Pre-push trademark / positioning audit
```

## Pre-push checks

Before pushing copy changes, run the trademark-risk audit:

```bash
python3 scripts/check-trademark-risk.py            # exit 0 if clean, 1 if hits
python3 scripts/check-trademark-risk.py --mentions # also list every brand mention
```

The script scans `index.html` for ServiceNow partnership-claim language. EquaCore is **not** a registered ServiceNow Partner Program member, so partner / implementation-partner / authorized / certified language must never appear in a ServiceNow context. HaloITSM implementation language is allowed because EquaCore **is** an official Halo partner — the script's `_not_haloitsm_context` filter handles that.

Patterns are defined in `BRAND_RISKS` at the top of the script — extend them if new product brands need policing.

## QA checklist (pre-push)

Run before every push that touches copy, navigation, or forms.

```bash
# 1. Trademark / positioning audit (required for any copy change)
python3 scripts/check-trademark-risk.py

# 2. Local preview
python3 -m http.server 8000   # or: npx serve -s .
```

Manual checks (spot-check after each deploy):

- [ ] **Routes** — visit `/`, `/services`, `/contact`, `/privacy`, `/talent-pool` directly (not via nav) and confirm correct page loads
- [ ] **Desktop dropdowns** — hover Services and About; confirm dropdown opens, `aria-expanded` becomes `true` in DevTools, closes on mouse-out and on Escape
- [ ] **Keyboard nav** — Tab to the Services button, press Enter/Space on mobile-width; confirm dropdown opens and closes with Escape
- [ ] **Mobile nav** — resize to ≤768 px; open hamburger, tap Services, confirm sub-menu expands; tap a link, confirm nav closes
- [ ] **Contact form** — submit with valid data; confirm redirect to `/enquiry-thanks`
- [ ] **Talent pool form** — submit via Tally embed; confirm redirect to `/thank-you`
- [ ] **Sitemap** — confirm `sitemap.xml` lists all public routes and no internal-only routes (`/enquiry-thanks`, `/thank-you`)
- [ ] **Lighthouse** — run PageSpeed Insights on homepage occasionally; flag any regressions below 90 on Performance or Accessibility

## Local preview

It's a static single file. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

For path-based routing to work locally on every URL, you'll want a server that falls back to `index.html` for unknown paths (mirrors the `_redirects` behaviour) — `npx serve -s .` does this.

---

© 2026 EquaCore Digital Ltd. All rights reserved.

ServiceNow® is a registered trademark of ServiceNow, Inc. HaloITSM™ is a trademark of Halo Service Solutions Ltd. EquaCore Digital is not affiliated with, endorsed by, or sponsored by ServiceNow, Inc.
