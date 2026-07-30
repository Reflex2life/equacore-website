# EquaCore Digital Website Environment

Last updated: 2026-05-06

This document describes the live website, domain, DNS, email, and repository environment for EquaCore Digital.

## Executive Summary

EquaCore Digital's public website is hosted on Cloudflare Pages from the `Reflex2life/equacore-website` GitHub repository. The `.com` and `.ng` domains both serve the same website directly. The `.ng` domain does not redirect to `.com`; this preserves Nigerian-domain URLs for compliance.

Primary goals now in place:

- `equacoredigital.com` and `www.equacoredigital.com` serve the production website.
- `equacoredigital.ng` and `www.equacoredigital.ng` serve the same production website.
- Path URLs stay on their requested domain, for example `https://equacoredigital.ng/talent` remains on `.ng`.
- `@equacoredigital.com` mail remains routed through Microsoft 365.
- `@equacoredigital.ng` is being configured as a separate Zoho-hosted mail domain.

## Repository

| Item | Value |
|---|---|
| Canonical repository | `Reflex2life/equacore-website` |
| Repository URL | `https://github.com/Reflex2life/equacore-website` |
| Production branch | `main` |
| Deleted duplicate repo | `Reflex2life/equacoredigital-ng` |

The deleted duplicate repo had GitHub Pages enabled with `CNAME = equacoredigital.ng` and a small redirect page to `equacoredigital.com`. It was removed because the `.ng` domain is now hosted directly through Cloudflare Pages.

## Application Architecture

The website is a static single-page application:

- Main app file: `index.html`
- Cloudflare Pages fallback: `_redirects`
- Cache headers: `_headers`
- Custom domain pin for the original `.com` setup: `CNAME`
- Sitemap: `sitemap.xml`
- Robots file: `robots.txt`

The current `_redirects` rule is:

```text
/* /index.html 200
```

This lets direct route visits such as `/talent`, `/contact`, or `/privacy` load `index.html`, after which the in-page router displays the matching page.

## Hosting

| Item | Value |
|---|---|
| Hosting platform | Cloudflare Pages |
| Pages project | `equacore-website` |
| Pages origin | `equacore-website.pages.dev` |
| Custom domains | `equacoredigital.com`, `www.equacoredigital.com`, `equacoredigital.ng`, `www.equacoredigital.ng` |

Cloudflare Pages custom-domain status was verified active for all four hostnames on 2026-05-06.

## Domain Model

The `.com` and `.ng` domains are peer hostnames serving the same site.

Expected behavior:

| URL | Expected behavior |
|---|---|
| `https://equacoredigital.com/` | Loads the production site |
| `https://www.equacoredigital.com/` | Loads the production site |
| `https://equacoredigital.ng/` | Loads the same production site |
| `https://www.equacoredigital.ng/` | Loads the same production site |
| `https://equacoredigital.ng/talent` | Stays on `.ng` and loads the Talent page |
| `https://equacoredigital.com/talent` | Stays on `.com` and loads the Talent page |

Do not create `.ng -> .com` redirects unless the user explicitly changes the requirement.

## DNS Provider And Nameservers

Both domains are managed in Cloudflare DNS.

| Domain | Registrar | DNS provider | Nameservers |
|---|---|---|---|
| `equacoredigital.com` | Namecheap | Cloudflare | `dina.ns.cloudflare.com`, `mitchell.ns.cloudflare.com` |
| `equacoredigital.ng` | GO54/Whogohost | Cloudflare | `dina.ns.cloudflare.com`, `mitchell.ns.cloudflare.com` |

## Cloudflare DNS: Website Records

| Domain | Type | Name | Target | Proxy |
|---|---|---|---|---|
| `.com` | CNAME | `equacoredigital.com` | `equacore-website.pages.dev` | Proxied |
| `.com` | CNAME | `www.equacoredigital.com` | `equacore-website.pages.dev` | Proxied |
| `.ng` | CNAME | `equacoredigital.ng` | `equacore-website.pages.dev` | Proxied |
| `.ng` | CNAME | `www.equacoredigital.ng` | `equacore-website.pages.dev` | Proxied |

Cloudflare flattens the apex CNAME records as needed.

## Email Environment

### `.com` Mail

`@equacoredigital.com` is routed through Microsoft 365.

Important `.com` records:

| Type | Name | Value |
|---|---|---|
| MX | `equacoredigital.com` | `equacoredigital-com.mail.protection.outlook.com`, priority `0` |
| TXT | `equacoredigital.com` | `v=spf1 include:spf.protection.outlook.com include:zohomail.com -all` |
| TXT | `_dmarc.equacoredigital.com` | `v=DMARC1; p=none; rua=mailto:info@equacoredigital.com` |
| CNAME | `autodiscover.equacoredigital.com` | `autodiscover.outlook.com` |
| CNAME | `selector1._domainkey.equacoredigital.com` | Microsoft DKIM target |
| CNAME | `selector2._domainkey.equacoredigital.com` | Microsoft DKIM target |

There are also Zoho verification/DKIM records on `.com`, because the existing mail design includes Microsoft 365 routing/fallback to Zoho for mailboxes not found in M365.

Do not change `.com` MX to Zoho unless the user explicitly decides to move `.com` mail away from Microsoft 365.

### `.ng` Mail

`@equacoredigital.ng` is being configured as a separate Zoho-hosted domain, not as a Microsoft 365 alias.

Current `.ng` Zoho records:

| Type | Name | Value | Priority |
|---|---|---|---|
| MX | `equacoredigital.ng` | `mx.zoho.com` | `10` |
| MX | `equacoredigital.ng` | `mx2.zoho.com` | `20` |
| MX | `equacoredigital.ng` | `mx3.zoho.com` | `50` |
| TXT | `equacoredigital.ng` | `v=spf1 include:zohomail.com -all` | N/A |
| TXT | `equacoredigital.ng` | `zoho-verification=zb99353237.zmverify.zoho.com` | N/A |
| TXT | `_dmarc.equacoredigital.ng` | `v=DMARC1; p=none; rua=mailto:info@equacoredigital.ng` | N/A |

Pending follow-up:

- Capture the Zoho DKIM selector name for `equacoredigital.ng`. DKIM was confirmed in Zoho on 2026-05-06, but the selector name was not recorded.
- Consider moving DMARC from `p=none` to a stricter policy only after SPF/DKIM alignment is stable and reports have been reviewed.

## Transactional And Verification Records

The `.com` zone also contains non-website records for services already in use:

- SendGrid link/DKIM records:
  - `em588.equacoredigital.com -> u106618999.wl250.sendgrid.net`
  - `s1._domainkey.equacoredigital.com -> s1.domainkey.u106618999.wl250.sendgrid.net`
  - `s2._domainkey.equacoredigital.com -> s2.domainkey.u106618999.wl250.sendgrid.net`
- Google Search Console verification TXT.
- Microsoft verification file in the repo: `ms49929093.txt`.
- Google verification file in the repo: `googleca6828c7e29f9e75.html`.

## Access And Tools

Relevant management surfaces:

- Cloudflare dashboard: DNS, Pages, SSL/TLS, redirects, rules.
- GO54 dashboard: `.ng` registrar and nameserver management only. DNS is now delegated to Cloudflare.
- Namecheap: `.com` registrar.
- Zoho Mail Admin: `.ng` domain mail setup, verification, DKIM, mailbox creation.
- Microsoft 365 Admin / Exchange Admin: `.com` mail and existing fallback routing to Zoho.
- GitHub: canonical website repository.

## Verification Commands

Use these commands when checking the environment locally:

```bash
# Nameserver delegation
dig +short NS equacoredigital.com
dig +short NS equacoredigital.ng

# Website DNS
dig +short CNAME equacoredigital.com
dig +short CNAME www.equacoredigital.com
dig +short CNAME equacoredigital.ng
dig +short CNAME www.equacoredigital.ng

# Mail DNS
dig +short MX equacoredigital.com
dig +short TXT equacoredigital.com
dig +short TXT _dmarc.equacoredigital.com

dig +short MX equacoredigital.ng
dig +short TXT equacoredigital.ng
dig +short TXT _dmarc.equacoredigital.ng
```

Cloudflare API state was last checked on 2026-05-06 and showed:

- `equacoredigital.com`: active zone.
- `equacoredigital.ng`: active zone.
- All four Cloudflare Pages custom domains active.

## Operational Guardrails

- Do not recreate `Reflex2life/equacoredigital-ng`.
- Do not point `.ng` back to GitHub Pages.
- Do not redirect `.ng` to `.com` without explicit user approval.
- Do not change `.com` MX away from Microsoft 365 without explicit user approval.
- Do not copy `.com` DKIM values to `.ng`; DKIM values are domain-specific.
- Keep Cloudflare DNS records for website hostnames proxied unless there is a specific troubleshooting reason to disable proxying.
