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

EquaCore is an Anthropic Partner and an OpenAI Partner, so those exact plain
partner claims are sanctioned and must not flag. The AI-partner rules catch
*drift* into an unsupported tier or qualification, a product cited as the
partner, or an unapproved logo asset. The ServiceNow rules here were written
after claim drift happened; these rules are deliberately preventative.

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
import hashlib
import re
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

# ANSI colour helpers (no-op when piped to a non-tty)
_TTY = sys.stdout.isatty()
def _c(code: str, s: str) -> str:
    return f"\033[{code}m{s}\033[0m" if _TTY else s
RED = lambda s: _c("31", s)
GRN = lambda s: _c("32", s)
YLO = lambda s: _c("33", s)
DIM = lambda s: _c("2",  s)
BLD = lambda s: _c("1",  s)

ROOT = Path(__file__).resolve().parent.parent
APPROVED_BRAND_ASSET_HASHES = {
    "assets/brand/anthropic-wordmark.svg": "56cc8de50f5c863520c7ae24464a8b2fd5c2f66f9063b9790aff8c37b4a0a554",
    "assets/brand/freshworks-wordmark.png": "ace7f595d81a231ca8f4b1204d50d89bbe602f75481c2c3de471889a62621cc3",
    "assets/brand/halo-wordmark.svg": "92326e5b54542e5469cbcbfea22fff8ebfdb62acd386760f0938ae461c14e9e2",
    "assets/brand/openai-wordmark.svg": "f5a8c4c38b81972f2ede620b06ac5c51fa7cd16a35a3b8361deffaa3202a351e",
}

# ------------------------------------------------------------------------------
# RISK PATTERNS
# Each entry: (label, regex_pattern, scope_filter)
#   scope_filter is a callable(window_text, match_text, element_text) -> bool
#   that returns True if the match should be FLAGGED. Returns False to suppress
#   (e.g. inside a HaloITSM context where implementation language is fine).
# ------------------------------------------------------------------------------
def _not_haloitsm_context(window: str, _match: str, _element: str) -> bool:
    """Implementation language is fine when surrounded by HaloITSM context."""
    return "HaloITSM" not in window and "Halo Service" not in window

def _not_in_disclaimer(window: str, _match: str, _element: str) -> bool:
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
     r"(?!\s*(?:&reg;|®)?\s*(?:platform|ecosystem|community|environment|"
     r"estate|instance|practice|talent|world|lifecycle)\b)",
     None),

    ("'ServiceNow, Inc' outside disclaimer",
     r"\bServiceNow,?\s*Inc\b",
     _not_in_disclaimer),

    # ── Restricted product brand names (require partner status to use) ───────
    ("'Now Platform' branded term",   r"\bNow Platform\b",  None),
    ("'Now Assist' branded term",     r"\bNow Assist\b",    None),
    ("'Now Create' branded term",     r"\bNow Create\b",    None),

    # ── Anthropic / Claude ───────────────────────────────────────────────────
    # EquaCore is an Anthropic Partner, so "Anthropic partner" and "partner of
    # Anthropic" are sanctioned and deliberately absent below. Only unsupported
    # tiers or qualifications beyond plain partner language are risky.
    ("Anthropic partner-status escalation",
     # Deny any modifier immediately attached to the sanctioned claim, except
     # neutral grammar words. This catches unknown tiers such as "Premier" or
     # "Gold" rather than relying on a finite list of programme names.
     r"(?i:\b(?!(?:a|an|the|and|or|as|is|are|our|its|of|with|alongside)\b)"
     r"[a-z0-9][a-z0-9.+/_-]*\s+Anthropic\s+partner\b)|"
     r"(?i:\bAnthropic\s+(?!partner\b)"
     r"(?:[a-z0-9][a-z0-9.+/_-]*\s+){1,3}partner\b)|"
     r"(?i:\b(?!(?:a|an|the|and|or|as|is|are|our|its|of|with|alongside)\b)"
     r"[a-z0-9][a-z0-9.+/_-]*\s+partner\s+of\s+Anthropic\b)|"
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

    # ── OpenAI / ChatGPT / GPT ───────────────────────────────────────────────
    # EquaCore is an OpenAI Partner. Plain "OpenAI Partner" language is allowed;
    # tiers, programme qualifiers, product-as-partner wording, and logo assets
    # are not supported by the approved source statement.
    ("OpenAI partner-status escalation",
     r"(?i:\b(?!(?:a|an|the|and|or|as|is|are|our|its|of|with|alongside)\b)"
     r"[a-z0-9][a-z0-9.+/_-]*\s+OpenAI\s+partner\b)|"
     r"(?i:\bOpenAI\s+(?!partner\b)"
     r"(?:[a-z0-9][a-z0-9.+/_-]*\s+){1,3}partner\b)|"
     r"(?i:\b(?!(?:a|an|the|and|or|as|is|are|our|its|of|with|alongside)\b)"
     r"[a-z0-9][a-z0-9.+/_-]*\s+partner\s+of\s+OpenAI\b)|"
     r"\bOpenAI\s+[Pp]artner\s+[Nn]etwork\b|"
     r"[Cc]ertified\s+OpenAI\b|\bOpenAI\s+[Cc]ertified\b|"
     r"[Oo]fficial\s+OpenAI\b|\bOpenAI\s+[Oo]fficial\b|"
     r"\bOpenAI\b.{0,30}\b[Aa]uthori[sz](?:ed|ation)\b|"
     r"\b[Aa]uthori[sz](?:ed|ation)\b.{0,30}\bOpenAI\b",
     None),

    # The relationship is with OpenAI, not a product or model family.
    ("OpenAI product cited as the partner/credential",
     r"\b(?:ChatGPT|GPT(?:-\d+(?:\.\d+)?)?)\s+[Pp]artner\b|"
     r"\b[Cc]ertified\s+(?:ChatGPT|GPT(?:-\d+(?:\.\d+)?)?)\b|"
     r"\b(?:ChatGPT|GPT(?:-\d+(?:\.\d+)?)?)\s+[Cc]ertified\b|"
     r"\b[Oo]fficial\s+(?:ChatGPT|GPT(?:-\d+(?:\.\d+)?)?)\b",
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

_IMAGE_EXT = re.compile(r"\.(?:svg|png|jpe?g|webp|gif)(?:[?#].*)?$", re.I)

class _BrandAssetParser(HTMLParser):
    """Inspect decoded HTML attributes after the parser establishes boundaries."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.findings: list[tuple[str, str, str]] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        element = self.get_starttag_text() or f"<{tag}>"
        attr_map: dict[str, str] = {}
        for name, value in attrs:
            attr_map.setdefault(name.lower(), value or "")

        urls: list[tuple[str, str]] = []
        for name in ("src", "href", "data"):
            if value := attr_map.get(name):
                urls.append((name, unquote(value)))
        if srcset := attr_map.get("srcset"):
            for candidate in srcset.split(","):
                if value := candidate.strip().split(maxsplit=1)[0]:
                    urls.append(("srcset", unquote(value)))

        values = [value for _, value in urls]
        for name, value in urls:
            lowered = value.lower()
            if _IMAGE_EXT.search(value) and re.search(r"anthropic|claude", lowered):
                if value != "/assets/brand/anthropic-wordmark.svg":
                    self.findings.append((
                        "Anthropic/Claude logo asset reference",
                        f'{name}="{value}"',
                        element,
                    ))
            if _IMAGE_EXT.search(value) and re.search(r"openai|chatgpt|gpt", lowered):
                if value != "/assets/brand/openai-wordmark.svg":
                    self.findings.append((
                        "OpenAI product logo asset reference",
                        f'{name}="{value}"',
                        element,
                    ))
            if _IMAGE_EXT.search(value) and "servicenow" in lowered:
                self.findings.append((
                    "ServiceNow logo asset reference",
                    f'{name}="{value}"',
                    element,
                ))

        alt = attr_map.get("alt")
        if alt is not None:
            lowered_alt = alt.lower()
            if "anthropic" in lowered_alt and not (
                alt == "Anthropic"
                and "/assets/brand/anthropic-wordmark.svg" in values
            ):
                self.findings.append((
                    "alt= mentions Anthropic imagery", f'alt="{alt}"', element
                ))
            if ("openai" in lowered_alt or "chatgpt" in lowered_alt) and not (
                alt == "OpenAI"
                and "/assets/brand/openai-wordmark.svg" in values
            ):
                self.findings.append((
                    "alt= mentions OpenAI product imagery", f'alt="{alt}"', element
                ))
            if "servicenow" in lowered_alt:
                self.findings.append((
                    "alt= mentions ServiceNow imagery", f'alt="{alt}"', element
                ))

def _find_asset_markup(text: str) -> list[tuple[str, str, str]]:
    parser = _BrandAssetParser()
    parser.feed(text)
    parser.close()
    return parser.findings

def _split_pages(html: str) -> list[tuple[str, str]]:
    """Split the SPA into independently reported head, page, and footer chunks."""
    pages: list[tuple[str, str]] = []
    if (m := re.search(r"<head.*?</head>", html, re.S)):
        pages.append(("head", m.group(0)))
    pages.extend(re.findall(
        r'<div class="pg[^"]*" id="(pg-[^"]+)">(.*?)'
        r'(?=<div class="pg[^"]*" id="pg-|<footer)',
        html, re.S,
    ))
    if (m := re.search(r"<footer.*?</footer>", html, re.S)):
        pages.append(("footer", m.group(0)))
    return pages or [("(whole file)", html)]

def _find_in_text(text: str) -> list[tuple[str, str, str]]:
    """Apply every BRAND_RISKS rule to one chunk of text.

    The single matching implementation, shared by scan_html and --selftest, so
    the fixtures exercise exactly what the gate runs.
    """
    findings = _find_asset_markup(text)
    # Claims in visible copy and metadata are matched after character-reference
    # decoding; asset attributes above are parsed from raw markup first.
    text = unescape(text)

    for label, pattern, scope_filter in BRAND_RISKS:
        for m in re.finditer(pattern, text):
            window = text[max(0, m.start() - 60):m.end() + 60]
            tag_start = text.rfind("<", 0, m.start() + 1)
            tag_end = text.find(">", m.end())
            element = (
                text[tag_start:tag_end + 1]
                if tag_start >= 0 and tag_end >= 0
                else m.group()
            )

            # Special handling for the "implement near ServiceNow" rule:
            # only flag if "implement" actually appears in the 60-char window.
            if "implement" in label.lower():
                if not re.search(r"\bimplement(?:ation|s|ed|ing)?\b",
                                 window, re.I):
                    continue

            # Scope filter (e.g., suppress HaloITSM contexts)
            if scope_filter and not scope_filter(window, m.group(), element):
                continue

            findings.append(
                (label, m.group(), _context(text, m.start(), m.end()))
            )

    return findings

def verify_approved_asset_hashes() -> list[str]:
    """Reject missing or changed logo bytes that would inherit an allowlisted path."""
    errors: list[str] = []
    for relative_path, expected in APPROVED_BRAND_ASSET_HASHES.items():
        path = ROOT / relative_path
        if not path.is_file():
            errors.append(f"{relative_path}: approved asset is missing")
            continue
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != expected:
            errors.append(
                f"{relative_path}: SHA-256 {actual} does not match approved {expected}"
            )
    return errors

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
    # ── AC-2 sanctioned partner language ─────────────────────────────────────
    ("AC-2 Anthropic partner",        "EquaCore is an Anthropic Partner.",         False),
    ("AC-2 partner of Anthropic",     "EquaCore is a partner of Anthropic.",       False),
    ("AC-2 OpenAI partner",           "EquaCore is an OpenAI Partner.",            False),
    ("AC-2 partner of OpenAI",        "EquaCore is a partner of OpenAI.",          False),

    # ── AC-3 unsanctioned status escalation ──────────────────────────────────
    ("AC-3 full Anthropic partner",   "EquaCore is a full Anthropic partner.",     True),
    ("AC-3 Anthropic tier",           "EquaCore is a Preferred Anthropic Partner.", True),
    ("AC-3 unknown Anthropic tier",   "EquaCore is a Premier Anthropic Partner.", True),
    ("AC-3 reversed Anthropic tier",  "EquaCore is an Anthropic Gold Partner.",   True),
    ("AC-3 numeric Anthropic tier",   "EquaCore is a Tier 1 Anthropic Partner.",  True),
    ("AC-3 reversed numeric Anthropic tier",
     "EquaCore is an Anthropic Tier 1 Partner.",                                True),
    ("AC-3 Certified Anthropic",      "We are a Certified Anthropic shop.",        True),
    ("AC-3 Anthropic certified",      "Our team is Anthropic certified.",          True),
    ("AC-3 Official Anthropic",       "An Official Anthropic delivery partner.",   True),
    ("AC-3 Anthropic Authorised",     "An Anthropic Authorised reseller.",         True),
    ("AC-3 Anthropic Authorized",     "An Anthropic Authorized reseller.",         True),
    ("AC-3 Authorised near Anthropic","Authorised to resell Anthropic licences.",  True),
    ("AC-3 full OpenAI partner",      "EquaCore is a Full OpenAI Partner.",         True),
    ("AC-3 certified OpenAI partner", "EquaCore is a Certified OpenAI Partner.",    True),
    ("AC-3 OpenAI official partner",  "EquaCore is an OpenAI Official Partner.",    True),
    ("AC-3 strategic OpenAI partner", "EquaCore is a Strategic OpenAI Partner.",    True),
    ("AC-3 implementation partner",  "EquaCore is an OpenAI Implementation Partner.", True),
    ("AC-3 OpenAI tier",              "EquaCore is an Elite OpenAI Partner.",       True),
    ("AC-3 unknown OpenAI tier",      "EquaCore is a Gold OpenAI Partner.",        True),
    ("AC-3 reversed OpenAI tier",     "EquaCore is an OpenAI Premier Partner.",    True),
    ("AC-3 numeric OpenAI tier",      "EquaCore is a Tier 1 OpenAI Partner.",      True),
    ("AC-3 reversed numeric OpenAI tier",
     "EquaCore is an OpenAI Tier 1 Partner.",                                   True),
    ("AC-3 OpenAI programme name",    "We joined the OpenAI Partner Network.",      True),
    ("AC-3 OpenAI certified",         "Our team is OpenAI certified.",              True),
    ("AC-3 OpenAI Authorized",        "An OpenAI Authorized reseller.",            True),

    # ── AC-4 products are not the partner ────────────────────────────────────
    ("AC-4 Claude partner",           "EquaCore is a Claude partner.",             True),
    ("AC-4 Claude certified",         "Our engineers are Claude certified.",       True),
    ("AC-4 bare Claude product use",  "Claude-based implementations for ITSM.",    False),
    ("AC-4 Claude named as a tool",   "We build on Claude and Halo together.",     False),
    ("AC-4 ChatGPT partner",          "EquaCore is a ChatGPT Partner.",            True),
    ("AC-4 GPT-5 certified",          "Our team is GPT-5 certified.",             True),
    ("AC-4 OpenAI technology use",    "We build solutions on OpenAI technology.", False),

    # ── AC-5 asset misuse ────────────────────────────────────────────────────
    ("AC-5 Anthropic logo src",
     '<img src="/assets/img/anthropic-logo.svg" alt="Partner">', True),
    ("AC-5 Claude logo src",
     '<img src="/assets/img/claude-mark.png" alt="Partner">',    True),
    ("AC-5 alt mentions Anthropic",
     '<img src="/assets/img/team.jpg" alt="Anthropic partner badge">', True),
    ("AC-5 approved Anthropic wordmark",
     '<img src="/assets/brand/anthropic-wordmark.svg" alt="Anthropic">', False),
    ("AC-5 wrong asset with plain Anthropic alt",
     '<img src="/assets/img/team.jpg" alt="Anthropic">', True),
    ("AC-5 sanctioned filename blocks a different asset type",
     '<img src="/assets/brand/anthropic-wordmark.png" alt="Anthropic">', True),
    ("AC-5 sanctioned Anthropic filename suffix is not approved",
     '<img src="/assets/brand/anthropic-wordmark.svg.png" alt="Partner">', True),
    ("AC-5 adjacent approved Anthropic asset cannot mask another asset",
     '<img src="/assets/brand/anthropic-wordmark.svg" alt=""><img src="/assets/img/anthropic-logo.svg" alt="Partner">', True),
    ("AC-5 external Anthropic lookalike path is not approved",
     '<img src="https://example.com/assets/brand/anthropic-wordmark.svg" alt="Partner">', True),
    ("AC-5 spaced uppercase Anthropic asset attribute is scanned",
     '<img SRC = "/assets/img/ANTHROPIC-logo.svg" alt="Partner">', True),
    ("AC-5 unquoted Anthropic asset attribute is scanned",
     '<img src=/assets/img/anthropic-logo.svg alt=Partner>', True),
    ("AC-5 numeric entity in Anthropic asset is decoded",
     '<img src="/assets/img/anthr&#111;pic-logo.svg" alt="Partner">', True),
    ("AC-5 named entity in Anthropic extension is decoded",
     '<img src="/assets/img/anthropic-logo&period;svg" alt="Partner">', True),
    ("AC-5 hex entity in Anthropic alt is decoded",
     '<img src="/assets/img/team.jpg" alt="Anthr&#x6f;pic">', True),
    ("AC-5 spaced approved Anthropic asset stays clean",
     '<img SRC = "/assets/brand/anthropic-wordmark.svg" ALT = "Anthropic">', False),
    ("AC-5 encoded approved Anthropic asset stays clean",
     '<img src="/assets/brand/anthropic-wordmark&period;svg" alt="Anthropic">', False),
    ("AC-5 encoded quote cannot truncate an Anthropic asset value",
     '<img src="/assets/brand/anthropic-wordmark.svg&#34;.png" alt="Partner">', True),
    ("AC-5 percent-encoded Anthropic asset is decoded",
     '<img src="/assets/img/anthr%6fpic-logo.svg" alt="Partner">', True),
    ("AC-5 spaced uppercase Anthropic alt is scanned",
     '<img src="/assets/img/team.jpg" ALT = "ANTHROPIC">', True),
    ("AC-5 adjacent approved Anthropic asset cannot mask a wrong alt",
     '<img src="/assets/brand/anthropic-wordmark.svg" alt=""><img src="/assets/img/team.jpg" alt="Anthropic">', True),
    ("AC-5 plain link to anthropic.com",
     '<a href="https://www.anthropic.com">Anthropic</a>',        False),
    ("AC-5 OpenAI logo src",
     '<img src="/assets/img/openai-logo.svg" alt="Partner">',   True),
    ("AC-5 ChatGPT logo href",
     '<a href="/assets/img/chatgpt-mark.png">Product</a>',       True),
    ("AC-5 alt mentions OpenAI",
     '<img src="/assets/img/team.jpg" alt="OpenAI partner badge">', True),
    ("AC-5 approved OpenAI wordmark",
     '<img src="/assets/brand/openai-wordmark.svg" alt="OpenAI">', False),
    ("AC-5 wrong asset with plain OpenAI alt",
     '<img src="/assets/img/team.jpg" alt="OpenAI">', True),
    ("AC-5 sanctioned filename blocks a different asset type",
     '<img src="/assets/brand/openai-wordmark.png" alt="OpenAI">', True),
    ("AC-5 sanctioned OpenAI filename suffix is not approved",
     '<img src="/assets/brand/openai-wordmark.svg.png" alt="Partner">', True),
    ("AC-5 adjacent approved OpenAI asset cannot mask another asset",
     '<img src="/assets/brand/openai-wordmark.svg" alt=""><img src="/assets/img/openai-logo.svg" alt="Partner">', True),
    ("AC-5 external OpenAI lookalike path is not approved",
     '<img src="https://example.com/assets/brand/openai-wordmark.svg" alt="Partner">', True),
    ("AC-5 spaced uppercase OpenAI asset attribute is scanned",
     '<img SRC = "/assets/img/OPENAI-logo.svg" alt="Partner">', True),
    ("AC-5 unquoted OpenAI asset attribute is scanned",
     '<img src=/assets/img/openai-logo.svg alt=Partner>', True),
    ("AC-5 hex entity in OpenAI asset is decoded",
     '<img src="/assets/img/open&#x41;i-logo.svg" alt="Partner">', True),
    ("AC-5 named entity in OpenAI extension is decoded",
     '<img src="/assets/img/openai-logo&period;svg" alt="Partner">', True),
    ("AC-5 numeric entity in OpenAI alt is decoded",
     '<img src="/assets/img/team.jpg" alt="Open&#65;I">', True),
    ("AC-5 spaced approved OpenAI asset stays clean",
     '<img SRC = "/assets/brand/openai-wordmark.svg" ALT = "OpenAI">', False),
    ("AC-5 encoded approved OpenAI asset stays clean",
     '<img src="/assets/brand/openai-wordmark&period;svg" alt="OpenAI">', False),
    ("AC-5 encoded quote cannot truncate an OpenAI asset value",
     '<img src="/assets/brand/openai-wordmark.svg&#x22;.png" alt="Partner">', True),
    ("AC-5 percent-encoded OpenAI srcset is decoded",
     '<img srcset="/assets/img/open%41i-logo.svg 2x" alt="Partner">', True),
    ("AC-5 spaced uppercase OpenAI alt is scanned",
     '<img src="/assets/img/team.jpg" ALT = "OPENAI">', True),
    ("AC-5 adjacent approved OpenAI asset cannot mask a wrong alt",
     '<img src="/assets/brand/openai-wordmark.svg" alt=""><img src="/assets/img/team.jpg" alt="OpenAI">', True),
    ("AC-5 plain link to openai.com",
     '<a href="https://openai.com">OpenAI</a>',                  False),

    # ── NG-2 regression: existing ServiceNow rules still behave ──────────────
    ("NG-2 ServiceNow partner still flags",
     "EquaCore is a ServiceNow Partner.",                        True),
    ("NG-2 Now Platform still flags",
     "Built on the Now Platform.",                               True),
    ("NG-2 ServiceNow registered platform stays clean after entity decode",
     "The client uses the ServiceNow&reg; platform.",             False),
    ("NG-2 ServiceNow bare noun still flags after entity decode",
     "The client selected the ServiceNow for this work.",        True),
    ("NG-2 ServiceNow logo still flags through parsed attributes",
     '<img src="/assets/img/servicenow-logo.svg" alt="Platform">', True),
    ("NG-2 ServiceNow imagery alt still flags through parsed attributes",
     '<img src="/assets/img/team.jpg" alt="ServiceNow team">',   True),
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

    # Regression for the file-level splitter: public claims in metadata and
    # JSON-LD must pass through the same matcher as visible page copy.
    head_probe = (
        '<html><head><meta name="description" '
        'content="EquaCore is a Premier Anthropic Partner."></head>'
        '<body><div class="pg" id="pg-home"></div></body></html>'
    )
    head_chunks = dict(_split_pages(head_probe))
    if _find_in_text(head_chunks.get("head", "")):
        print(f"  {GRN('✓')} metadata/head claims are scanned")
    else:
        failures += 1
        print(f"  {RED('✗')} metadata/head claims are scanned")

    print()
    if failures == 0:
        print(GRN(BLD(f"✓ Selftest passed — {len(SELFTEST_CASES) + 1} cases.")))
    else:
        print(RED(BLD(
            f"✗ Selftest failed — {failures}/{len(SELFTEST_CASES) + 1} cases."
        )))
    return failures

def list_brand_mentions(path: Path) -> None:
    """List every governed brand mention for visual review."""
    html = _strip_svg(path.read_text(encoding="utf-8"))
    print(f"\n{BLD('All ServiceNow mentions:')}")
    for i, m in enumerate(re.finditer(r"\bServiceNow\b", html), 1):
        ctx = _context(html, m.start(), m.end(), pad=50)
        print(f"  {i}. {DIM(ctx)}")
    print(f"\n{BLD('All HaloITSM mentions:')}")
    for i, m in enumerate(re.finditer(r"\bHaloITSM\b", html), 1):
        ctx = _context(html, m.start(), m.end(), pad=50)
        print(f"  {i}. {DIM(ctx)}")
    print(f"\n{BLD('All Anthropic mentions:')}")
    for i, m in enumerate(re.finditer(r"\bAnthropic\b", html), 1):
        ctx = _context(html, m.start(), m.end(), pad=50)
        print(f"  {i}. {DIM(ctx)}")
    print(f"\n{BLD('All OpenAI mentions:')}")
    for i, m in enumerate(re.finditer(r"\bOpenAI\b", html), 1):
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
    asset_errors = verify_approved_asset_hashes()
    if asset_errors:
        total += len(asset_errors)
        if not args.quiet:
            print(BLD("\nApproved brand asset integrity"))
            for error in asset_errors:
                print(f"  {RED('✗')} {error}")
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
