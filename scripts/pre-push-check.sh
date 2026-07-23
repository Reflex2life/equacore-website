#!/usr/bin/env bash
# pre-push-check.sh — pre-push verification gate for the EquaCore website.
#
# Checks (runs all, reports all — does not stop at first failure):
#   1. Trademark/positioning scan (scripts/check-trademark-risk.py)
#   2. Prerender drift: regenerate route files in a temp copy and diff against
#      the committed/working-tree route files (sitemap.xml lastmod excluded —
#      it is re-stamped on every build)
#   3. Route sanity: every internal route linked from index.html or listed in
#      sitemap.xml must exist as a committed per-route HTML file
#   4. Cache-bust: every CSS/JS asset URL in index.html carries a ?v=<hash>
#      matching the asset's content hash (scripts/check-cache-bust.py)
#
# Exit 0 = PASS, non-zero = FAIL. Checks that cannot run are reported as
# SKIPPED (with reason) and count as failure — no false-pass.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PASS=0; FAIL=0; SKIP=0
declare -a SUMMARY

report() { # status name detail
  SUMMARY+=("$1  $2 — $3")
  case "$1" in
    PASS) PASS=$((PASS+1));;
    FAIL) FAIL=$((FAIL+1));;
    SKIP) SKIP=$((SKIP+1));;
  esac
}

hr() { printf '%s\n' "----------------------------------------------------------------"; }

# ---------------------------------------------------------------- check 1
hr; echo "[1/4] Trademark risk scan"
if ! command -v python3 >/dev/null 2>&1; then
  report SKIP "trademark" "python3 not found on PATH"
elif [ ! -f scripts/check-trademark-risk.py ]; then
  report SKIP "trademark" "scripts/check-trademark-risk.py missing"
else
  if python3 scripts/check-trademark-risk.py; then
    report PASS "trademark" "no trademark risks in index.html"
  else
    report FAIL "trademark" "violations found (see output above)"
  fi
fi

# ---------------------------------------------------------------- check 2
hr; echo "[2/4] Prerender drift check"
ROUTES=""
if command -v python3 >/dev/null 2>&1 && [ -f scripts/prerender.py ]; then
  ROUTES=$(python3 - <<'EOF'
import re, pathlib
src = pathlib.Path("scripts/prerender.py").read_text()
m = re.search(r"^ROUTES = \{(.*?)^\}", src, re.S | re.M)
print(" ".join(re.findall(r'^\s{4}"([a-z-]+)":', m.group(1), re.M)) if m else "")
EOF
  )
fi

if ! command -v python3 >/dev/null 2>&1; then
  report SKIP "prerender-drift" "python3 not found on PATH"
elif [ ! -f scripts/prerender.py ] || [ ! -f index.html ]; then
  report SKIP "prerender-drift" "scripts/prerender.py or index.html missing"
elif [ -z "$ROUTES" ]; then
  report SKIP "prerender-drift" "could not parse ROUTES from prerender.py"
else
  TMP=$(mktemp -d "${TMPDIR:-/tmp}/prerender-gate.XXXXXX")
  trap 'rm -rf "$TMP"' EXIT
  mkdir -p "$TMP/scripts"
  cp index.html "$TMP/" && cp scripts/prerender.py "$TMP/scripts/"
  # intentionally do NOT copy sitemap.xml: its lastmod is stamped per-build
  if (cd "$TMP" && python3 scripts/prerender.py >/dev/null); then
    DRIFT=""
    for r in $ROUTES; do
      if [ ! -f "$r.html" ]; then
        DRIFT="$DRIFT $r.html(missing)"
      elif ! diff -q "$r.html" "$TMP/$r.html" >/dev/null; then
        DRIFT="$DRIFT $r.html"
      fi
    done
    if [ -z "$DRIFT" ]; then
      report PASS "prerender-drift" "$(echo "$ROUTES" | wc -w | tr -d ' ') route files match fresh prerender output"
    else
      echo "Drifted route files:$DRIFT"
      echo "Fix: python3 scripts/prerender.py && git add *.html sitemap.xml"
      report FAIL "prerender-drift" "stale route files:$DRIFT"
    fi
  else
    report FAIL "prerender-drift" "prerender.py exited non-zero"
  fi
fi

# ---------------------------------------------------------------- check 3
hr; echo "[3/4] Internal link / route sanity"
if [ ! -f index.html ] || [ ! -f sitemap.xml ]; then
  report SKIP "routes" "index.html or sitemap.xml missing"
else
  # Internal routes referenced in index.html: href="/foo" (nav + body links)
  LINKED=$(grep -oE 'href="/[a-z-]+"' index.html | sed 's|href="/||; s|"||' | sort -u)
  # Routes in sitemap: path component of each <loc>
  SITEMAP=$(grep -oE '<loc>[^<]+</loc>' sitemap.xml | sed -E 's|</?loc>||g; s|https?://[^/]+/?||' | sed '/^$/d' | sort -u)
  BAD=""
  for r in $(printf '%s\n%s\n' "$LINKED" "$SITEMAP" | sort -u); do
    [ -z "$r" ] && continue
    if [ ! -f "$r.html" ]; then
      BAD="$BAD /$r(no $r.html)"
    fi
  done
  # Also require every linked route to be in the sitemap (indexable parity)
  MISSING_SM=""
  for r in $LINKED; do
    echo "$SITEMAP" | grep -qx "$r" || MISSING_SM="$MISSING_SM /$r"
  done
  if [ -z "$BAD" ] && [ -z "$MISSING_SM" ]; then
    report PASS "routes" "all linked/sitemapped routes have committed HTML files and sitemap entries"
  else
    [ -n "$BAD" ] && echo "Routes without a prerendered file:$BAD"
    [ -n "$MISSING_SM" ] && echo "Linked routes missing from sitemap.xml:$MISSING_SM"
    report FAIL "routes" "broken:${BAD}${MISSING_SM:+ not-in-sitemap:$MISSING_SM}"
  fi
fi

# ---------------------------------------------------------------- check 4
hr; echo "[4/4] Cache-bust hash check"
if ! command -v python3 >/dev/null 2>&1; then
  report SKIP "cache-bust" "python3 not found on PATH"
elif [ ! -f scripts/check-cache-bust.py ]; then
  report SKIP "cache-bust" "scripts/check-cache-bust.py missing"
elif python3 scripts/check-cache-bust.py >/dev/null 2>&1; then
  report PASS "cache-bust" "asset ?v= hashes match content"
else
  python3 scripts/check-cache-bust.py || true
  report FAIL "cache-bust" "asset ?v= out of sync (run --fix + prerender)"
fi

# ---------------------------------------------------------------- verdict
hr
for line in "${SUMMARY[@]}"; do echo "  $line"; done
hr
if [ "$FAIL" -eq 0 ] && [ "$SKIP" -eq 0 ]; then
  echo "VERDICT: PASS ($PASS/$((PASS+FAIL+SKIP)) checks)"
  exit 0
elif [ "$FAIL" -eq 0 ]; then
  echo "VERDICT: FAIL — $SKIP check(s) SKIPPED (could not run; not treated as a pass)"
  exit 1
else
  echo "VERDICT: FAIL — $FAIL failed, $SKIP skipped, $PASS passed"
  exit 1
fi
