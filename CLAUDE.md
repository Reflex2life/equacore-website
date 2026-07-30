# EquaCore Website Operational Memory

This repo is the canonical website source for EquaCore Digital Ltd.

## Canonical Repo And Hosting

- GitHub repo: `Reflex2life/equacore-website`
- Cloudflare Pages project: `equacore-website`
- Cloudflare Pages origin: `equacore-website.pages.dev`
- Production branch: `main`
- The site is a static single-page app in `index.html`. `scripts/prerender.py` runs as the Cloudflare Pages build command and writes one static HTML file per indexable route (`services.html`, `servicenow.html`, …) with route-specific meta/JSON-LD; these files are also committed. After any `index.html` edit, re-run the prerender script and commit the regenerated route files.
- Deploy = fast-forward push to `main` over SSH (`git push origin <branch>:main`); Cloudflare Pages builds in ~1–2 min.
- Before pushing copy changes, run `python3 scripts/check-trademark-risk.py` (must exit 0).
- Private operational reference: `INFRASTRUCTURE.md` in this folder. It contains live secrets and must remain untracked.
- Canonical record of the July 2026 revamp (design system, demo funnel, form migration): `docs/WEBSITE-REVAMP-2026-07.md`.

## Domains

Both domains serve the same site content as separate hostnames:

- `equacoredigital.com`
- `www.equacoredigital.com`
- `equacoredigital.ng`
- `www.equacoredigital.ng`

Do not add a redirect from `.ng` to `.com` unless the user explicitly asks. The compliance goal is for `.ng` URLs such as `https://equacoredigital.ng/talent` to remain on the `.ng` hostname while showing the same website.

Live Cloudflare state checked on 2026-05-06 shows `.ng` and `www.ng` attached directly to the main `equacore-website` Pages project, with CNAMEs to `equacore-website.pages.dev`.

## DNS And Registrars

- DNS provider for both `.com` and `.ng`: Cloudflare
- Nameservers for both domains:
  - `dina.ns.cloudflare.com`
  - `mitchell.ns.cloudflare.com`
- `.com` registrar/original registrar: Namecheap
- `.ng` registrar: GO54/Whogohost

Both apex and `www` records point to Cloudflare Pages:

- `CNAME equacoredigital.com -> equacore-website.pages.dev` proxied
- `CNAME www.equacoredigital.com -> equacore-website.pages.dev` proxied
- `CNAME equacoredigital.ng -> equacore-website.pages.dev` proxied
- `CNAME www.equacoredigital.ng -> equacore-website.pages.dev` proxied

## Email Routing

The two domains intentionally use different mail routing:

- `@equacoredigital.com` receives through Microsoft 365. Its MX is `equacoredigital-com.mail.protection.outlook.com`.
- `.com` also has Zoho-related TXT/DKIM records because there is a Microsoft 365 fallback/route to Zoho for mailboxes not found in M365.
- `@equacoredigital.ng` is being configured as a separate Zoho-hosted mail domain to avoid touching Microsoft 365 routing.
- Zoho SMTP is the transactional sender for the n8n form workflows; form confirmations currently send as `sales@equacoredigital.com`.

Current `.ng` Zoho records in Cloudflare:

- `MX @ 10 mx.zoho.com`
- `MX @ 20 mx2.zoho.com`
- `MX @ 50 mx3.zoho.com`
- `TXT @ v=spf1 include:zohomail.com -all`
- `TXT @ zoho-verification=zb99353237.zmverify.zoho.com`
- `TXT _dmarc v=DMARC1; p=none; rua=mailto:info@equacoredigital.ng`

Zoho DKIM for `.ng` was confirmed in Zoho on 2026-05-06, but the selector name was not captured. Check Zoho Mail Admin before troubleshooting or rotating DKIM. Do not copy `.com` DKIM to `.ng`.

## Form Automation (n8n)

All three website forms run on n8n (`voidnox.app.n8n.cloud`) as of the July 2026 revamp. Make.com is decommissioned (removed from the CSP in commit `9fade4d`) and the Tally embed was replaced by a native on-site form. Private details and credentials live in `INFRASTRUCTURE.md`.

| Webhook (POST) | Does |
|---|---|
| `/webhook/website-contact` | Contact form → spam guard + Turnstile → SharePoint *Website Enquiries* → Zoho confirmation email |
| `/webhook/demo-gate` | Demo lead-capture modal → SharePoint *Demo Requests* → returns the Microsoft Bookings URL only on success |
| `/webhook/talent-apply` | Native talent-pool form, multipart (fields + CV) → SharePoint *Talent Pool* + candidate/internal emails |

Full workflow details: `docs/WEBSITE-REVAMP-2026-07.md` §3.

## GitHub Cleanup

A temporary duplicate repo named `Reflex2life/equacoredigital-ng` was created for a GitHub Pages redirect from `.ng` to `.com`. It was deleted after the Cloudflare Pages setup became active. Do not recreate it.

## More Details

See `docs/ENVIRONMENT.md` for the fuller environment reference.

## AI Agent Loop (Linear + Finn-loop)

Work is tracked in **Linear** — team **Engineering** (`ENG`, id `7833827e-3ca6-4a9b-b7c3-69d164ec9218`), project **EquaCore Website**.

**The loop is three stages:** `/finn-spec` turns a chosen idea into a build-ready issue → a human applies the `agent-ready` label → `/loop /finn-build` claims it and opens a PR → `/finn-review` posts a verdict → the `gate` check must pass → **a human merges.** Each stage has a human gate on either side, and that is what makes the chain safe to run unattended.

The merge stays human and there is no auto-merge: merging `main` publishes to equacoredigital.com and equacoredigital.ng within 1–2 minutes, so it is a production deploy. `onApproval.merge` in `.claude/finn-loop.json` is `false`, `/finn-review` refuses to merge while it is, and GitHub auto-merge is never enabled. The check is named `gate` — that is the `check_run` name the API returns for the `gate` job in the `CI` workflow, and `requiredChecks` must match it exactly. `CI / gate` is only the web UI's display form and matches nothing.

The three skills live at **`~/.claude/skills/finn-{spec,build,review}`** (user-level, shared with other repos) and read **`.claude/finn-loop.json`** in this repo to learn which repository, Linear team, required checks, verify commands and guardrails apply. Without that file they refuse to run; `/finn-build` also aborts if `gh repo view` does not match its `repo` value, so an issue from another project can never be built here.

**`/finn-ideate` is not a loop stage.** It is a standalone research tool, configured separately in `.claude/finn-ideate.json`, that files candidate `idea`-labeled issues for human triage. It is deliberately outside the loop: it produces raw input rather than a contract, so a slow ideation pass can never stall the build queue and a full queue can never pressure it into filing filler. Run it on demand when the `agent-ready` queue has run dry, not under `/loop` — a timed ideation loop outruns the triage capacity it feeds. Its `teams` is `ENG` only, because an idea filed outside the build team strands where no downstream stage can reach it.

The `idea` label is workspace-level and must never be combined with `agent-ready` until the issue has been through `/finn-spec`. Builders never introduce ServiceNow "partner/authorised/certified" language (the trademark check forbids it; Halo partner language is allowed).

## Asset cache-busting (enforced)

Static assets are marked immutable for a year in `_headers`, so a changed CSS/JS file served under an unchanged URL is cached stale by the CDN for up to a year. The `?v=` query is a **content hash stamped automatically** by `scripts/check-cache-bust.py` — never hand-edit it. After editing `index.html`, `assets/css/*.css`, or `assets/js/*.js`:

    python3 scripts/check-cache-bust.py --fix    # re-stamp ?v= hashes from content
    python3 scripts/prerender.py                 # propagate to route files, then commit

The gate `bash scripts/pre-push-check.sh` (trademark, prerender-drift, route parity, cache-bust) must exit 0; the same checks run in CI on every PR to `main`.
