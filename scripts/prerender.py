#!/usr/bin/env python3
"""Prerender per-route static HTML from index.html.

The site is a single-file SPA: every route's content already lives in index.html
as a `.pg` section toggled by JS. JS-rendering crawlers (Googlebot) get correct
per-route <title>/description/canonical via the router's setMeta(). But many AI
answer engines (Perplexity, ChatGPT browse, some AI-Overview fetchers) read the
RAW HTML without executing JS — so without prerendering they see the homepage's
meta on every URL.

This script writes one static file per supported route (e.g. services.html) with:
  - route-specific <title>, meta description, canonical, og/twitter tags
  - the matching `.pg` section pre-marked `act` so the correct page is the
    primary visible content on first paint, no JS required

Cloudflare Pages serves /services.html for a request to /services (clean URLs).
Generated HTML files retain the two runtime-only thank-you views without adding
them to the sitemap, while a top-level 404.html keeps unknown pages and missing
assets out of the SPA shell.
The in-page JS still runs and re-confirms meta against location.origin, so .ng
hosts self-correct their canonical at render time.

Run from repo root:  python3 scripts/prerender.py
Configure as the Cloudflare Pages build command to keep output in sync.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

BASE = "https://equacoredigital.com"

# Routes that are children of /services (for breadcrumbs) and get a Service schema.
SERVICES_CHILDREN = {"servicenow", "haloitsm", "freshworks", "anthropic", "openai", "talent", "health-check"}
SERVICE_ROUTES = {
    "health-check": "ITSM Health Check",
    "servicenow": "ServiceNow Talent, Managed Operations and Independent Advisory",
    "haloitsm": "Halo Platform Implementation (HaloITSM, HaloPSA, HaloCRM)",
    "freshworks": "Freshworks Implementation and Optimisation",
    "anthropic": "Responsible Claude Adoption",
    "openai": "OpenAI Adoption and Integration",
    "talent": "Platform-ready Talent",
}
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"

# Mirrors the titles/descs maps in index.html's router. Keep in sync.
ROUTES = {
    "health-check": (
        "ITSM Health Check — EquaCore Digital",
        "A platform-neutral assessment of your service operation, with a customer-owned Health and Maturity Report, scored assessment areas and a prioritised roadmap.",
    ),
    "services": (
        "Services — EquaCore Digital",
        "EquaCore Digital delivers platform implementation and improvement across Halo and Freshworks solutions, independent ServiceNow services, specialist talent and responsible AI delivery.",
    ),
    "servicenow": (
        "ServiceNow Talent, Managed Operations & Independent Advisory — EquaCore Digital",
        "Independent ServiceNow services from a Nigeria-based practice: pre-vetted talent, ongoing managed operations and advisory for organisations in Nigeria, West Africa, the UK and Europe.",
    ),
    "haloitsm": (
        "Halo Services (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital",
        "EquaCore Digital is a Full Halo Technology Alliance Partner implementing HaloITSM, HaloPSA, and HaloCRM — covering migrations, process alignment, onboarding, and post-go-live managed support.",
    ),
    "freshworks": (
        "Freshworks Services & Implementation — EquaCore Digital",
        "EquaCore Digital delivers Freshworks implementation and optimisation, from process mapping and configuration to integrations, migration and enablement.",
    ),
    "anthropic": (
        "Responsible Claude Adoption — EquaCore Digital",
        "EquaCore Digital helps organisations adopt Claude responsibly through use-case discovery, integration design, human oversight, rollout and evaluation.",
    ),
    "openai": (
        "OpenAI Adoption & Integration — EquaCore Digital",
        "EquaCore Digital helps organisations adopt and integrate OpenAI through use-case discovery, connected knowledge and tools, human approval, rollout and ongoing improvement.",
    ),
    "talent": (
        "Platform-ready Talent — EquaCore Digital",
        "Pre-vetted, platform-ready talent for ServiceNow; HaloITSM, HaloPSA and HaloCRM; Freshservice and Freshworks solutions; OpenAI adoption and integration; and Claude adoption.",
    ),
    "talent-pool": (
        "Join Our Talent Pool — EquaCore Digital",
        "Join the EquaCore talent pool. Platform-ready professionals in Nigeria can register for permanent, contract or embedded placements across Nigeria, the UK and Europe.",
    ),
    "engagement": (
        "Engagement Models — EquaCore Digital",
        "How EquaCore Digital works with you: independent advisory, project-based delivery, ongoing support, embedded consulting and hybrid models — each with a written scope, a named lead and change control.",
    ),
    "about": (
        "About — EquaCore Digital",
        "EquaCore Digital is a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner, with independent ServiceNow services. Founded by service management practitioners and based in Lagos, Nigeria.",
    ),
    "markets": (
        "Where we work — EquaCore Digital",
        "EquaCore Digital is based in Lagos, Nigeria, and works with organisations in Nigeria, across West Africa, the UK and Europe.",
    ),
    "contact": (
        "Contact — EquaCore Digital",
        "Contact EquaCore Digital to discuss platform-ready talent, platform implementation, managed operations or advisory in Nigeria, West Africa, the UK and Europe.",
    ),
    "privacy": (
        "Privacy Policy — EquaCore Digital",
        "EquaCore Digital privacy policy — how we collect, use, and protect your data.",
    ),
}

# Supported direct-load views that deliberately remain outside the sitemap.
# Keep their existing indexing policy: no sitemap entry and no robots override.
RUNTIME_ROUTES = {
    "thank-you": (
        "Thank You — EquaCore Digital",
        "EquaCore Digital improves service delivery through platform implementation, independent advisory, managed support and specialist talent.",
    ),
    "enquiry-thanks": (
        "Message Received — EquaCore Digital",
        "EquaCore Digital improves service delivery through platform implementation, independent advisory, managed support and specialist talent.",
    ),
}


def esc(s: str) -> str:
    """Escape for use inside a double-quoted HTML attribute."""
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def sub_one(pattern: str, repl: str, text: str, label: str) -> str:
    # Replace via a function returning a literal, so no backreference/escape
    # surprises from dynamic content (titles/descriptions are arbitrary text).
    new, n = re.subn(pattern, lambda _m: repl, text, count=1)
    if n != 1:
        sys.exit(f"prerender: expected exactly 1 match for {label}, got {n}")
    return new


def extra_schema(route: str, title: str, desc: str) -> str:
    """Per-route BreadcrumbList (all routes) + Service schema (service pages).

    The homepage FAQPage schema is stripped from subpages in render() because
    that FAQ content is not visible on those pages (a Google guideline violation).
    """
    name = title.split(" — ")[0].split(" (")[0].strip()
    crumbs = [{"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"}]
    pos = 2
    if route in SERVICES_CHILDREN:
        crumbs.append({"@type": "ListItem", "position": pos, "name": "Services", "item": f"{BASE}/services"})
        pos += 1
    crumbs.append({"@type": "ListItem", "position": pos, "name": name, "item": f"{BASE}/{route}"})
    blocks = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs}]
    if route in SERVICE_ROUTES:
        blocks.append({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": SERVICE_ROUTES[route],
            "serviceType": SERVICE_ROUTES[route],
            "provider": {"@type": "Organization", "name": "EquaCore Digital", "url": BASE},
            "areaServed": ["NG", "GB", "EU", "West Africa"],
            "description": desc,
        })
    return "".join(f'<script type="application/ld+json">{json.dumps(b)}</script>\n' for b in blocks)


def render(route: str, title: str, desc: str, src: str) -> str:
    url = f"{BASE}/{route}"
    t, d = esc(title), esc(desc)
    html = src
    # The homepage FAQPage schema doesn't match subpage content — strip it and
    # inject route-appropriate Breadcrumb (+ Service) schema instead.
    html = sub_one(r'(?s)<script type="application/ld\+json">\s*\{\s*"@context": "https://schema\.org",\s*"@type": "FAQPage".*?</script>\s*', "", html, "strip FAQ schema")
    html = sub_one(r"</head>", extra_schema(route, title, desc) + "</head>", html, "inject route schema")
    html = sub_one(r"<title>.*?</title>", f"<title>{t}</title>", html, "title")
    html = sub_one(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{d}">', html, "description")
    # Root-relative canonical resolves against the requesting host, so .ng URLs
    # stay self-canonical even for non-JS crawlers (compliance requirement).
    html = sub_one(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="/{route}">', html, "canonical")
    html = sub_one(r'<link rel="alternate" hreflang="en" href="[^"]*">', f'<link rel="alternate" hreflang="en" href="{BASE}/{route}">', html, "hreflang en")
    html = sub_one(r'<link rel="alternate" hreflang="en-NG" href="[^"]*">', f'<link rel="alternate" hreflang="en-NG" href="https://equacoredigital.ng/{route}">', html, "hreflang en-NG")
    html = sub_one(r'<link rel="alternate" hreflang="x-default" href="[^"]*">', f'<link rel="alternate" hreflang="x-default" href="{BASE}/{route}">', html, "hreflang x-default")
    html = sub_one(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{t}">', html, "og:title")
    html = sub_one(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{d}">', html, "og:description")
    html = sub_one(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', html, "og:url")
    html = sub_one(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{t}">', html, "twitter:title")
    html = sub_one(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{d}">', html, "twitter:description")
    # Move the active page from home to this route so non-JS readers get it first.
    html = sub_one(r'<div class="pg act" id="pg-home">', '<div class="pg" id="pg-home">', html, "deactivate home")
    html = sub_one(rf'<div class="pg" id="pg-{route}">', f'<div class="pg act" id="pg-{route}">', html, f"activate {route}")
    return html


def main() -> None:
    src = SRC.read_text(encoding="utf-8")
    generated_routes = {**ROUTES, **RUNTIME_ROUTES}
    for route, (title, desc) in generated_routes.items():
        (ROOT / f"{route}.html").write_text(render(route, title, desc, src), encoding="utf-8")
        print(f"wrote {route}.html")
    print(
        f"prerendered {len(ROUTES)} indexable routes and "
        f"{len(RUNTIME_ROUTES)} runtime routes"
    )

    # Keep sitemap freshness accurate: stamp every <lastmod> with the build date.
    sitemap = ROOT / "sitemap.xml"
    if sitemap.exists():
        txt = sitemap.read_text(encoding="utf-8")
        txt = re.sub(r"<lastmod>[^<]*</lastmod>", f"<lastmod>{date.today().isoformat()}</lastmod>", txt)
        sitemap.write_text(txt, encoding="utf-8")
        print("refreshed sitemap lastmod")


if __name__ == "__main__":
    main()
