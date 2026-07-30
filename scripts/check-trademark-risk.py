#!/usr/bin/env python3
"""
check-trademark-risk.py — scan EquaCore HTML for trademark/partnership-claim risk.

Usage:
    python3 scripts/check-trademark-risk.py             # scan index.html, exit 1 on hit
    python3 scripts/check-trademark-risk.py -q          # quiet mode (summary only)
    python3 scripts/check-trademark-risk.py --mentions  # also list every brand mention
    python3 scripts/check-trademark-risk.py --selftest  # run the pattern fixtures
    python3 scripts/check-trademark-risk.py path1.html path2.html

Why this exists
---------------
EquaCore is a HaloITSM official partner but NOT a registered ServiceNow Partner
Program member. ServiceNow's trademark guidelines restrict non-partners from
claiming "Partner / Implementation Partner / Authorized / Certified / Official"
in their context. This script catches accidental copy that drifts back into
implementation-partner positioning.

EquaCore IS a full Anthropic partner, so plain partner language for Anthropic is
sanctioned and must not flag. What the Anthropic rules catch is *drift* — copy
that later escalates the accurate claim into "certified", "official" or
"authorised", or that ships a logo asset. The ServiceNow rules here were written
after the drift happened; the Anthropic ones are deliberately in place before the
AI-practice copy lands.

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

    # ── Anthropic / Claude ───────────────────────────────────────────────────
    # EquaCore IS a full Anthropic partner, so "Anthropic partner" and
    # "partner of Anthropic" are sanctioned and deliberately absent below.
    # Only escalations beyond plain partner language are risky.
    ("Anthropic partner-status escalation",
     r"[Cc]ertified\s+Anthropic\b|\bAnthropic\s+[Cc]ertified\b|"
     r"[Oo]fficial\s+Anthropic\b|\bAnthropic\s+[Oo]fficial\b|"
     r"\bAnthropic\b.{0,30}\b[Aa]uthori[sz](?:ed|ation)\b|"
     r"\b[Aa]uthori[sz](?:ed|ation)\b.{0,30}\bAnthropic\b",
     None),

    # The partnership is with Anthropic, not with the product. Bare "Claude"
    # as a product name ("Claude-based implementations") stays clean.
    ("Claude cited as the partner/credential",
     r"\bClaude\s+[Pp]artner\b|\b[Cc]ertified\s+Claude\b|"
     r"\bClaude\s+[Cc]ertified\b|\b[Oo]fficial\s+Claude\b",
     None),

    ("Anthropic/Claude logo asset reference",
     r"src=[\"'][^\"']*(?:anthropic|claude)[^\"']*\.(?:svg|png|jpe?g|webp|gif)[\"']|"
     r"href=[\"'][^\"']*(?:anthropic|claude)[^\"']*\.(?:svg|png|jpe?g|webp|gif)[\"']",
     None),

    ("alt= mentions Anthropic imagery",
     r"alt=[\"'][^\"']*[Aa]nthropic[^\"']*[\"']",
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

def _find_in_text(text: str) -> list[tuple[str, str, str]]:
    """Apply every BRAND_RISKS rule to one chunk of text.

    The single matching implementation, shared by scan_html and --selftest, so
    the fixtures exercise exactly what the gate runs.
    """
    findings: list[tuple[str, str, str]] = []

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

            findings.append(
                (label, m.group(), _context(text, m.start(), m.end()))
            )

    return findings

def scan_html(path: Path) -> int:
    """Returns count of real violations (post scope-filter)."""
    html = path.read_text(encoding="utf-8")
    pages = _split_pages(html)
    total_hits = 0

    for page_id, content in pages:
        page_findings = _find_in_text(_strip_svg(content))

        if page_findings:
            total_hits += len(page_findings)
            print(f"\n{BLD(RED('●'))} {BLD(page_id)}")
            for label, hit, ctx in page_findings:
                print(f"  {YLO('▸')} {label}")
                print(f"    match: {RED(hit)}")
                print(f"    {DIM('…' + ctx + '…')}")

    return total_hits

# ------------------------------------------------------------------------------
# SELFTEST FIXTURES
# (description, text, must_flag). Every rule needs both directions: a string it
# has to catch and a neighbouring one it must leave alone. The must-NOT cases are
# the ones that matter — a rule that flags real copy gets disabled, not fixed.
# ------------------------------------------------------------------------------
SELFTEST_CASES: list[tuple[str, str, bool]] = [
    # ── AC-2 sanctioned Anthropic partner language ───────────────────────────
    ("AC-2 full Anthropic partner",   "EquaCore is a full Anthropic partner.",     False),
    ("AC-2 Anthropic partner",        "As an Anthropic partner we build agents.",  False),
    ("AC-2 partner of Anthropic",     "EquaCore is a partner of Anthropic.",       False),

    # ── AC-3 unsanctioned status escalation ──────────────────────────────────
    ("AC-3 Certified Anthropic",      "We are a Certified Anthropic shop.",        True),
    ("AC-3 Anthropic certified",      "Our team is Anthropic certified.",          True),
    ("AC-3 Official Anthropic",       "An Official Anthropic delivery partner.",   True),
    ("AC-3 Anthropic Authorised",     "An Anthropic Authorised reseller.",         True),
    ("AC-3 Anthropic Authorized",     "An Anthropic Authorized reseller.",         True),
    ("AC-3 Authorised near Anthropic","Authorised to resell Anthropic licences.",  True),

    # ── AC-4 Claude is the product, not the partner ──────────────────────────
    ("AC-4 Claude partner",           "EquaCore is a Claude partner.",             True),
    ("AC-4 Claude certified",         "Our engineers are Claude certified.",       True),
    ("AC-4 bare Claude product use",  "Claude-based implementations for ITSM.",    False),
    ("AC-4 Claude named as a tool",   "We build on Claude and Halo together.",     False),

    # ── AC-5 asset misuse ────────────────────────────────────────────────────
    ("AC-5 Anthropic logo src",
     '<img src="/assets/img/anthropic-logo.svg" alt="Partner">', True),
    ("AC-5 Claude logo src",
     '<img src="/assets/img/claude-mark.png" alt="Partner">',    True),
    ("AC-5 alt mentions Anthropic",
     '<img src="/assets/img/team.jpg" alt="Anthropic partner badge">', True),
    ("AC-5 plain link to anthropic.com",
     '<a href="https://www.anthropic.com">Anthropic</a>',        False),

    # ── NG-2 regression: existing ServiceNow rules still behave ──────────────
    ("NG-2 ServiceNow partner still flags",
     "EquaCore is a ServiceNow Partner.",                        True),
    ("NG-2 Now Platform still flags",
     "Built on the Now Platform.",                               True),
    ("NG-2 HaloITSM implementation still clean",
     "HaloITSM implementation specialists on the bench.",        False),
]

def run_selftest() -> int:
    """Run SELFTEST_CASES through the real matcher. Returns count of failures."""
    failures = 0
    print(BLD("\nPattern selftest\n"))

    for desc, text, must_flag in SELFTEST_CASES:
        findings = _find_in_text(text)
        flagged = bool(findings)
        if flagged == must_flag:
            print(f"  {GRN('✓')} {desc}")
        else:
            failures += 1
            want = "flag" if must_flag else "stay clean"
            got = f"{len(findings)} hit(s)" if flagged else "no hits"
            print(f"  {RED('✗')} {desc}")
            print(f"      expected to {want}, got {got}")
            print(f"      text: {DIM(text)}")
            for label, hit, _ in findings:
                print(f"      matched {YLO(label)} on {RED(hit)}")

    print()
    if failures == 0:
        print(GRN(BLD(f"✓ Selftest passed — {len(SELFTEST_CASES)} cases.")))
    else:
        print(RED(BLD(f"✗ Selftest failed — {failures}/{len(SELFTEST_CASES)} cases.")))
    return failures

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
    ap.add_argument("--selftest", action="store_true",
                    help="run the pattern fixtures instead of scanning files")
    args = ap.parse_args()

    if args.selftest:
        return 1 if run_selftest() else 0

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
