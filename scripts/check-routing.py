#!/usr/bin/env python3
"""Static regression gate for Cloudflare Pages routing and the 404 boundary."""

import ast
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PERMANENT = {"301", "308"}


def fail(message: str) -> None:
    raise SystemExit(f"routing: {message}")


def route_maps() -> tuple[set[str], set[str]]:
    tree = ast.parse((ROOT / "scripts/prerender.py").read_text(encoding="utf-8"))
    found: dict[str, set[str]] = {}
    for node in tree.body:
        if not isinstance(node, ast.Assign):
            continue
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id in {"ROUTES", "RUNTIME_ROUTES"}:
                found[target.id] = set(ast.literal_eval(node.value))
    if set(found) != {"ROUTES", "RUNTIME_ROUTES"}:
        fail("ROUTES and RUNTIME_ROUTES maps are required in scripts/prerender.py")
    return found["ROUTES"], found["RUNTIME_ROUTES"]


def redirect_rules() -> dict[str, tuple[str, str]]:
    rules: dict[str, tuple[str, str]] = {}
    for number, raw in enumerate((ROOT / "_redirects").read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) != 3:
            fail(f"_redirects:{number} must contain source, destination and status")
        source, destination, status = parts
        if source in rules:
            fail(f"duplicate redirect source {source}")
        rules[source] = (destination, status)
    return rules


class ErrorPageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: set[str] = set()
        self.html_lang = ""
        self.fr_sections = 0
        self.h1_count = 0
        self.script_count = 0
        self.noindex = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html":
            self.html_lang = values.get("lang", "") or ""
        elif tag == "section" and values.get("lang") == "fr":
            self.fr_sections += 1
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "script":
            self.script_count += 1
        elif tag == "a" and values.get("href", "").startswith("/"):
            self.links.add(values["href"] or "")
        elif tag == "meta" and values.get("name") == "robots":
            self.noindex = "noindex" in (values.get("content", "") or "").lower()


def main() -> None:
    routes, runtime_routes = route_maps()
    rules = redirect_rules()
    expected_french_sources = {"/fr", "/fr/"}

    for route in routes:
        if not (ROOT / f"{route}.html").is_file():
            fail(f"missing prerendered route file {route}.html")
        target = f"/{route}"
        for source in (f"/fr/{route}", f"/fr/{route}/"):
            expected_french_sources.add(source)
            destination, status = rules.get(source, ("", ""))
            if destination != target or status not in PERMANENT:
                fail(f"{source} must permanently redirect to {target}")

    for source in ("/fr", "/fr/"):
        destination, status = rules.get(source, ("", ""))
        if destination != "/" or status not in PERMANENT:
            fail(f"{source} must permanently redirect to /")

    for route in runtime_routes:
        if not (ROOT / f"{route}.html").is_file():
            fail(f"missing runtime route file {route}.html")

    for source, (_destination, status) in rules.items():
        if status == "200":
            fail(f"unexpected rewrite {source}; SPA rewrites are forbidden")
        if source == "/fr" or source.startswith("/fr/"):
            if source not in expected_french_sources:
                fail(f"unrecognised French route {source} must fall through to 404")
            if status not in PERMANENT:
                fail(f"French route {source} must use a permanent redirect")
        if "*" in source:
            fail(f"wildcard route {source} would weaken the explicit 404 boundary")

    if (ROOT / "llms.txt").exists():
        fail("llms.txt is deliberately unpublished and must use normal 404 handling")

    page = ErrorPageParser()
    page.feed((ROOT / "404.html").read_text(encoding="utf-8"))
    if page.html_lang != "en" or page.fr_sections < 1:
        fail("404.html must expose explicit English and French language structure")
    if page.h1_count != 1:
        fail("404.html must contain exactly one h1")
    if page.script_count:
        fail("404.html must remain standalone and script-free")
    if not page.noindex:
        fail("404.html must include a noindex robots directive")
    required_links = {"/", "/services", "/contact"}
    if not required_links.issubset(page.links):
        fail("404.html navigation must link to /, /services and /contact")

    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    if "404.html" in sitemap or "/fr/" in sitemap:
        fail("404 and toggle-only French URLs must not appear in sitemap.xml")
    for route in runtime_routes:
        if f"/{route}" in sitemap:
            fail(f"runtime route /{route} must remain outside sitemap.xml")

    print(
        f"routing: PASS ({len(routes) + 1} canonical routes, "
        f"{len(runtime_routes)} runtime routes, {len(expected_french_sources)} "
        "French redirects, standalone 404 boundary)"
    )


if __name__ == "__main__":
    main()
