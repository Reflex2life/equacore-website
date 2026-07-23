#!/usr/bin/env python3
"""Cache-bust guard for index.html asset URLs.

Every local CSS/JS asset referenced in index.html must carry a `?v=<hash>` query
whose value is the first 8 hex chars of the asset's SHA-256 content hash. The
_headers file marks static assets immutable for one year, so an edited asset
served under an unchanged URL is cached stale by Cloudflare's CDN for up to a
year. A content-hash `?v=` means a changed asset always gets a fresh URL — no
one has to remember to bump a version manually.

Usage:
  python3 scripts/check-cache-bust.py         # verify; exit 1 on any mismatch
  python3 scripts/check-cache-bust.py --fix   # rewrite index.html with correct hashes

prerender.py builds the per-route HTML files by copying index.html, so after a
--fix you must re-run `python3 scripts/prerender.py` to propagate the new hashes
to the route files (the prerender-drift check enforces that they stay in sync).
"""
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
ASSETS = ["assets/css/styles.css", "assets/js/scripts.js", "assets/js/i18n.js"]


def content_hash(rel: str) -> str:
    return hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()[:8]


def run(fix: bool) -> int:
    src = INDEX.read_text(encoding="utf-8")
    problems = []
    for rel in ASSETS:
        if not (ROOT / rel).exists():
            problems.append(f"{rel}: file missing")
            continue
        want = content_hash(rel)
        # Asset URL, optionally already carrying a ?v=<hash>.
        pat = re.compile(re.escape(rel) + r"(?:\?v=([0-9a-f]+))?")
        m = pat.search(src)
        if not m:
            problems.append(f"{rel}: not referenced in index.html")
            continue
        if m.group(1) != want:
            problems.append(f"{rel}: ?v={m.group(1)} but content hash is {want}")
            if fix:
                src = pat.sub(f"{rel}?v={want}", src)

    if fix:
        INDEX.write_text(src, encoding="utf-8")
        return run(False)  # re-verify after rewriting

    if problems:
        print("cache-bust: FAIL")
        for p in problems:
            print(f"  - {p}")
        print("Fix: python3 scripts/check-cache-bust.py --fix && python3 scripts/prerender.py")
        return 1
    print(f"cache-bust: PASS ({len(ASSETS)} assets stamped with content hashes)")
    return 0


if __name__ == "__main__":
    sys.exit(run("--fix" in sys.argv))
