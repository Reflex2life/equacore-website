#!/usr/bin/env python3
"""
check-trademark-risk.py — scan EquaCore HTML for trademark/partnership-claim risk.

Usage:
    python3 scripts/check-trademark-risk.py             # scan index.html, exit 1 on hit
    python3 scripts/check-trademark-risk.py -q          # quiet mode (summary only)
    python3 scripts/check-trademark-risk.py --mentions  # also list every brand mention
    python3 scripts/check-trademark-risk.py path1.html path2.html

Why this exists
---------------
EquaCore is a HaloITSM official partner but NOT a registered ServiceNow Partner
Program member. ServiceNow's trademark guidelines restrict non-partners from
claiming "Partner / Implementation Partner / Authorized / Certified / Official"
in their context. This script catches accidental copy that drifts back into
implementation-partner positioning.

Updating patterns
-----------------
Edit the BRAND_RISKS list below. Each entry is (label, regex, applies_to).
The "applies_to" tuple lets you say "this pattern is risky for ServiceNow but
not for HaloITSM" — which matters because we DO implement Halo.

Exit code
---------
0 = clean (or only false-positive-style hits in the footer disclaimer)
1 = violations found
"""
from __future__ import annotations
import argparse
import re
import sys
from pathlib import Path

# ANSI colour helpers (no-op when piped to a non-tty)
_TTY = sys.stdout.isatty()
def _c(code: str, s: str) -> str:
    return f"\033[{code}m{s}\033[0m" if _TTY else s
RED = lambda s: _c("31", s)
GRN = lambda s: _c("32", s)
YLO = lambda s: _c("33", s)
DIM = lambda s: _c("2",  s)
BLD = lambda s: _c("1",  s)

# ------------------------------------------------------------------------------
# RISK PATTERNS
# Each entry: (label, regex_pattern, scope_filter)
#   scope_filter is a callable(window_text) -> bool that returns True if the
#   match should be FLAGGED. Returns False to suppress (e.g. inside a HaloITSM
#   context where implementation language is fine).
# ------------------------------------------------------------------------------
def _not_haloitsm_context(window: str) -> bool:
    """Implementation language is fine when surrounded by HaloITSM context."""
    return "HaloITSM" not in window and "Halo Service" not in window

def _not_in_disclaimer(window: str) -> bool:
    """'ServiceNow, Inc' is fine inside the footer trademark line."""
    return "registered trademark" not in window and "not affiliated" not in window

BRAND_RISKS = [
    # ── Direct partnership claims ────────────────────────────────────────────
    ("Partnership claim",
     r"\bServiceNow\s+[Pp]artner\b|\b[Pp]artner\b.{0,30}\bServiceNow\b|"
     r"\bImplementation\s+Partner\b|\bAuthoriz(?:ed|ation)\b.{0,30}\bServiceNow\b|"
     r"\bCertified\s+ServiceNow\b|\bOfficial\s+ServiceNow\b",
     None),

    # ── Implementation-partner-adjacent positioning ──────────────────────────
    ('"ServiceNow practice"',
     r"\bServiceNow\s+practice\b",
     None),

    ('"implement" within 30 chars of ServiceNow (not HaloITSM context)',
     r"\bServiceNow\b",
     _not_haloitsm_context),  # special-handled below to check 30-char window

    ('"end-to-end" applied to ServiceNow',
     r"[Ee]nd-to-end\s+ServiceNow|ServiceNow.{0,30}[Ee]nd-to-end|"
     r"[Ee]nd-to-end\s+platform\s+delivery",
     None),

    # ── Trademark misuse ─────────────────────────────────────────────────────
    ("'ServiceNow' as bare noun (not adjective)",
     r"(?<![A-Za-z])the ServiceNow"
     r"(?!\s*&reg;|\s+platform|\s+ecosystem|\s+community|\s+environment|"
     r"\s+estate|\s+instance|\s+practice|\s+talent|\s+world|\s+lifecycle)",
     None),

    ("'ServiceNow, Inc' outside disclaimer",
     r"\bServiceNow,?\s*Inc\b",
     _not_in_disclaimer),

    # ── Restricted product brand names (require partner status to use) ───────
    ("'Now Platform' branded term",   r"\bNow Platform\b",  None),
    ("'Now Assist' branded term",     r"\bNow Assist\b",    None),
    ("'Now Create' branded term",     r"\bNow Create\b",    None),

    # ── Visual asset checks ──────────────────────────────────────────────────
    ("ServiceNow logo asset reference",
     r"src=[\"'][^\"']*servicenow[^\"']*[\"']|"
     r"href=[\"'][^\"']*servicenow[^\"']*\.(?:svg|png)[\"']",
     None),

    ("alt= mentions ServiceNow imagery",
     r"alt=[\"'][^\"']*ServiceNow[^\"']*[\"']",
     None),
]

# ------------------------------------------------------------------------------
def _strip_svg(text: str) -> str:
    """Remove <svg>…</svg> blocks to cut path-data noise."""
    return re.sub(r"<svg.*?</svg>", "", text, flags=re.S)

def _context(text: str, start: int, end: int, pad: int = 60) -> str:
    """Render a clean text window around a match."""
    raw = text[max(0, start - pad):end + pad]
    raw = re.sub(r"<[^>]+>", "", raw)
    return re.sub(r"\s+", " ", raw).strip()

def _split_pages(html: str) -> list[tuple[str, str]]:
    """Split the single-file SPA into (page_id, content) chunks plus footer."""
    pages = re.findall(
        r'<div class="pg[^"]*" id="(pg-[^"]+)">(.*?)'
        r'(?=<div class="pg[^"]*" id="pg-|<footer)',
        html, re.S,
    )
    if (m := re.search(r"<footer.*?</footer>", html, re.S)):
        pages.append(("footer", m.group(0)))
    return pages or [("(whole file)", html)]

def scan_html(path: Path) -> int:
    """Returns count of real violations (post scope-filter)."""
    html = path.read_text(encoding="utf-8")
    pages = _split_pages(html)
    total_hits = 0

    for page_id, content in pages:
        text = _strip_svg(content)
        page_findings: list[tuple[str, str, str]] = []

        for label, pattern, scope_filter in BRAND_RISKS:
            for m in re.finditer(pattern, text):
                window = text[max(0, m.start() - 60):m.end() + 60]

                # Special handling for the "implement near ServiceNow" rule:
                # only flag if "implement" actually appears in the 60-char window.
                if "implement" in label.lower():
                    if not re.search(r"\bimplement(?:ation|s|ed|ing)?\b",
                                     window, re.I):
                        continue

                # Scope filter (e.g., suppress HaloITSM contexts)
                if scope_filter and not scope_filter(window):
                    continue

                page_findings.append(
                    (label, m.group(), _context(text, m.start(), m.end()))
                )

        if page_findings:
            total_hits += len(page_findings)
            print(f"\n{BLD(RED('●'))} {BLD(page_id)}")
            for label, hit, ctx in page_findings:
                print(f"  {YLO('▸')} {label}")
                print(f"    match: {RED(hit)}")
                print(f"    {DIM('…' + ctx + '…')}")

    return total_hits

def list_brand_mentions(path: Path) -> None:
    """List every ServiceNow + HaloITSM mention for visual review."""
    html = _strip_svg(path.read_text(encoding="utf-8"))
    print(f"\n{BLD('All ServiceNow mentions:')}")
    for i, m in enumerate(re.finditer(r"\bServiceNow\b", html), 1):
        ctx = _context(html, m.start(), m.end(), pad=50)
        print(f"  {i}. {DIM(ctx)}")
    print(f"\n{BLD('All HaloITSM mentions:')}")
    for i, m in enumerate(re.finditer(r"\bHaloITSM\b", html), 1):
        ctx = _context(html, m.start(), m.end(), pad=50)
        print(f"  {i}. {DIM(ctx)}")

# ------------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1].strip())
    ap.add_argument("files", nargs="*", default=["index.html"],
                    help="HTML files to scan (default: index.html)")
    ap.add_argument("-q", "--quiet", action="store_true",
                    help="suppress per-hit detail; only print summary")
    ap.add_argument("--mentions", action="store_true",
                    help="also list every brand mention for visual review")
    args = ap.parse_args()

    total = 0
    for f in args.files:
        path = Path(f)
        if not path.exists():
            print(f"{RED('✗')} {path}: not found")
            return 2
        if not args.quiet:
            print(BLD(f"\nScanning {path}…"))
        hits = scan_html(path)
        total += hits
        if args.mentions:
            list_brand_mentions(path)

    print()
    if total == 0:
        print(GRN(BLD(f"✓ Clean — no trademark risks found.")))
        return 0
    else:
        print(RED(BLD(f"✗ {total} trademark risk{'s' if total != 1 else ''} found.")))
        print(DIM("  Review the matches above before pushing."))
        return 1

if __name__ == "__main__":
    sys.exit(main())
