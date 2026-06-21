#!/usr/bin/env python3
"""Prerender per-route static HTML from index.html.

The site is a single-file SPA: every route's content already lives in index.html
as a `.pg` section toggled by JS. JS-rendering crawlers (Googlebot) get correct
per-route <title>/description/canonical via the router's setMeta(). But many AI
answer engines (Perplexity, ChatGPT browse, some AI-Overview fetchers) read the
RAW HTML without executing JS — so without prerendering they see the homepage's
meta on every URL.

This script writes one static file per indexable route (e.g. services.html) with:
  - route-specific <title>, meta description, canonical, og/twitter tags
  - the matching `.pg` section pre-marked `act` so the correct page is the
    primary visible content on first paint, no JS required

Cloudflare Pages serves /services.html for a request to /services (clean URLs),
and the SPA fallback in _redirects only fires for paths with no matching file.
The in-page JS still runs and re-confirms meta against location.origin, so .ng
hosts self-correct their canonical at render time.

Run from repo root:  python3 scripts/prerender.py
Configure as the Cloudflare Pages build command to keep output in sync.
"""
import re
import sys
from pathlib import Path

BASE = "https://equacoredigital.com"
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"

# Mirrors the titles/descs maps in index.html's router. Keep in sync.
ROUTES = {
    "services": (
        "Services — EquaCore Digital",
        "EquaCore Digital delivers four services: ServiceNow talent augmentation, full Halo platform implementation (HaloITSM, HaloPSA, HaloCRM), managed services, and independent advisory.",
    ),
    "servicenow": (
        "ServiceNow in Nigeria — Consulting, Talent & Managed Services — EquaCore Digital",
        "EquaCore Digital is a Nigeria-based ServiceNow partner offering implementation, talent augmentation, managed services, and independent advisory for organisations in Nigeria and worldwide. Headquartered in Lagos.",
    ),
    "haloitsm": (
        "Halo Services (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital",
        "EquaCore Digital is a full Halo Technology Alliance Partner implementing HaloITSM, HaloPSA, and HaloCRM — covering migrations, process alignment, onboarding, and post-go-live managed support.",
    ),
    "talent": (
        "Talent Augmentation — EquaCore Digital",
        "EquaCore Digital places pre-vetted, enterprise-ready ServiceNow professionals — administrators, developers, architects, BAs, and CMDB/Discovery/SAM specialists — with global enterprises.",
    ),
    "talent-pool": (
        "Join Our Talent Pool — EquaCore Digital",
        "Join the EquaCore talent pool. ServiceNow and Halo professionals can register to be matched with global enterprise placements.",
    ),
    "engagement": (
        "Engagement Models — EquaCore Digital",
        "EquaCore Digital engagement models: staff augmentation, managed services, and advisory — with structured governance and measurable outcomes for distributed teams.",
    ),
    "about": (
        "About — EquaCore Digital",
        "EquaCore Digital is a practitioner-led digital operations firm specialising in ServiceNow and the full Halo platform, based in Nigeria and delivering globally.",
    ),
    "markets": (
        "Markets Served — EquaCore Digital",
        "EquaCore Digital serves clients across Nigeria, the UK, Europe, and West Africa with ServiceNow and Halo platform delivery backed by structured governance.",
    ),
    "contact": (
        "Contact — EquaCore Digital",
        "Contact EquaCore Digital to discuss ServiceNow talent, Halo platform implementation, managed services, or advisory. Based in Lagos, Nigeria, delivering globally.",
    ),
    "privacy": (
        "Privacy Policy — EquaCore Digital",
        "EquaCore Digital privacy policy — how we collect, use, and protect your data.",
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


def render(route: str, title: str, desc: str, src: str) -> str:
    url = f"{BASE}/{route}"
    t, d = esc(title), esc(desc)
    html = src
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
    for route, (title, desc) in ROUTES.items():
        (ROOT / f"{route}.html").write_text(render(route, title, desc, src), encoding="utf-8")
        print(f"wrote {route}.html")
    print(f"prerendered {len(ROUTES)} routes")


if __name__ == "__main__":
    main()
