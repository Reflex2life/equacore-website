#!/usr/bin/env bash
# install-hooks.sh — install the git pre-push hook that runs the deploy gate.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$(cd "$ROOT" && git rev-parse --git-path hooks)"
case "$HOOKS_DIR" in /*) ;; *) HOOKS_DIR="$ROOT/$HOOKS_DIR";; esac
mkdir -p "$HOOKS_DIR"

cat > "$HOOKS_DIR/pre-push" <<'EOF'
#!/usr/bin/env bash
# Auto-installed by scripts/install-hooks.sh — runs the deploy gate before push.
REPO_ROOT="$(git rev-parse --show-toplevel)"
exec "$REPO_ROOT/scripts/pre-push-check.sh"
EOF
chmod +x "$HOOKS_DIR/pre-push"
chmod +x "$ROOT/scripts/pre-push-check.sh"

echo "Installed pre-push hook -> $HOOKS_DIR/pre-push"
echo "It runs scripts/pre-push-check.sh; push is blocked on FAIL."
echo "Bypass (emergencies only): git push --no-verify"
