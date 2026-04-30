# EquaCore Digital — Website

Official website for EquaCore Digital Ltd — a digital operations consulting and implementation firm specializing in ServiceNow, HaloITSM, and Talent Augmentation.

## Quick Start

Simply open `index.html` in a browser, or deploy to any static hosting provider.

## Deployment

### Netlify (recommended)
1. Push this repo to GitHub
2. Connect to [Netlify](https://netlify.com)
3. Set publish directory to `/`
4. Deploy — HTTPS and CDN included free

### GitHub Pages
1. Go to repo Settings → Pages
2. Set source to `main` branch, root `/`
3. Your site will be live at `https://yourusername.github.io/equacore-website`

### Vercel
1. Import this repo at [Vercel](https://vercel.com)
2. Deploy with defaults

## Tech Stack

- Single-file HTML with embedded CSS & JS
- Plus Jakarta Sans (Google Fonts)
- No build tools, no dependencies
- Responsive design (desktop, tablet, mobile)
- Hash-based SPA routing

## Structure

```
index.html                        — Complete website (all 9 pages)
halo-logo-{white,dark}.svg        — HaloITSM official partner brand assets
hero-{strategy,platform,team}.jpg — Page hero photography
scripts/check-trademark-risk.py   — Pre-push trademark/positioning audit
README.md                         — This file
```

## Pre-push checks

Before pushing copy changes, run the trademark-risk audit:

```bash
python3 scripts/check-trademark-risk.py            # exit 0 if clean, 1 if hits
python3 scripts/check-trademark-risk.py --mentions # also list every brand reference
```

The script scans `index.html` for ServiceNow partnership-claim language
(EquaCore is **not** a registered ServiceNow Partner Program member; HaloITSM
implementation language is allowed because EquaCore **is** a Halo partner).
Patterns are defined in `BRAND_RISKS` at the top of the script — extend
them if new product brands need policing.

## Pages

- Home
- Services Overview
- ServiceNow Services
- HaloITSM Services
- Talent Augmentation
- Engagement Models
- About EquaCore
- Markets Served
- Contact

---

© 2025 EquaCore Digital Ltd. All rights reserved.
