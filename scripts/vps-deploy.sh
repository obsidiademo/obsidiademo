#!/usr/bin/env bash
# Deploy a static site to the Hostinger VPS demo hub.
# Credentials come from Cloud Agent secrets — never print them.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: vps-deploy [--slug SLUG] [--title TITLE] [--description DESC]
                  [--source DIR] [--no-index] [--dry-run]

Deploys SOURCE to $VPS_DEPLOY_ROOT/<slug>/ on the Hostinger VPS
(default root: /var/www/demos). Served at http://$VPS_HOST/<slug>/.

Secrets (environment variables):
  VPS_HOST              hostname or IP (required)
  VPS_USER              SSH user (default: root)
  VPS_PORT              SSH port (default: 22)
  VPS_SSH_PASSWORD      password auth (alias: VPS_PASSWORD)
  VPS_SSH_PRIVATE_KEY   optional private key PEM (preferred if set)
  VPS_DEPLOY_ROOT       remote parent directory (default: /var/www/demos)
EOF
}

log() { printf '%s\n' "$*" >&2; }
die() { log "error: $*"; exit 1; }

SLUG=""
TITLE=""
DESC=""
SOURCE="."
UPDATE_INDEX=1
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --slug) SLUG="${2:-}"; shift 2 ;;
    --title) TITLE="${2:-}"; shift 2 ;;
    --description) DESC="${2:-}"; shift 2 ;;
    --source) SOURCE="${2:-}"; shift 2 ;;
    --no-index) UPDATE_INDEX=0; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    *) die "unknown argument: $1" ;;
  esac
done

HOST="${VPS_HOST:-}"
USER="${VPS_USER:-root}"
PORT="${VPS_PORT:-22}"
PASSWORD="${VPS_SSH_PASSWORD:-${VPS_PASSWORD:-}}"
KEY="${VPS_SSH_PRIVATE_KEY:-}"
ROOT="${VPS_DEPLOY_ROOT:-/var/www/demos}"

[[ -n "$HOST" ]] || die "VPS_HOST is not set"
[[ -d "$SOURCE" ]] || die "source directory not found: $SOURCE"
[[ "$PORT" =~ ^[0-9]+$ ]] || die "VPS_PORT must be numeric"

if [[ -z "$SLUG" ]]; then
  SLUG="$(basename "$(realpath "$SOURCE")")"
fi
SLUG="$(printf '%s' "$SLUG" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9-]+/-/g; s/^-+//; s/-+$//; s/-+/-/g')"
[[ -n "$SLUG" ]] || die "could not derive a slug"
[[ "$SLUG" != "." && "$SLUG" != ".." ]] || die "invalid slug"
case "$SLUG" in
  *..*|/*|*\\*) die "invalid slug: $SLUG" ;;
esac

if [[ -z "$TITLE" ]]; then
  TITLE="$SLUG"
fi

SOURCE="$(realpath "$SOURCE")"
REMOTE_DIR="${ROOT%/}/$SLUG"

TMPDIR="$(mktemp -d)"
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

SSH_OPTS=(
  -o StrictHostKeyChecking=accept-new
  -o UserKnownHostsFile="$HOME/.ssh/known_hosts"
  -o ConnectTimeout=20
  -o NumberOfPasswordPrompts=1
  -o Port="$PORT"
)

if [[ -n "$KEY" ]]; then
  KEY_FILE="$TMPDIR/id"
  printf '%s\n' "$KEY" | sed 's/\r$//' > "$KEY_FILE"
  chmod 600 "$KEY_FILE"
  SSH_OPTS+=(-i "$KEY_FILE" -o IdentitiesOnly=yes -o PreferredAuthentications=publickey)
else
  [[ -n "$PASSWORD" ]] || die "set VPS_SSH_PASSWORD (or VPS_SSH_PRIVATE_KEY)"
  command -v sshpass >/dev/null || die "sshpass is required for password auth"
  export SSHPASS="$PASSWORD"
  SSH_OPTS+=(-o PreferredAuthentications=password,keyboard-interactive -o PubkeyAuthentication=no)
fi

command -v rsync >/dev/null || die "rsync is required"

ssh_cmd() {
  if [[ -n "$KEY" ]]; then
    ssh "${SSH_OPTS[@]}" "$@"
  else
    sshpass -e ssh "${SSH_OPTS[@]}" "$@"
  fi
}

scp_cmd() {
  if [[ -n "$KEY" ]]; then
    scp "${SSH_OPTS[@]}" "$@"
  else
    sshpass -e scp "${SSH_OPTS[@]}" "$@"
  fi
}

# rsync -e execs this wrapper; do not inline sshpass flags (commas break quoting).
RSH_WRAP="$TMPDIR/rsh"
{
  printf '%s\n' '#!/usr/bin/env bash' 'set -euo pipefail'
  if [[ -n "$KEY" ]]; then
    printf 'exec ssh'
  else
    printf 'exec sshpass -e ssh'
  fi
  for o in "${SSH_OPTS[@]}"; do
    printf ' %q' "$o"
  done
  printf ' "$@"\n'
} > "$RSH_WRAP"
chmod +x "$RSH_WRAP"
RSYNC_RSH="$RSH_WRAP"

log "deploying slug=$SLUG remote=$REMOTE_DIR source=$SOURCE"

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "dry-run: would rsync and chown www-data"
  exit 0
fi

ssh_cmd "${USER}@${HOST}" "mkdir -p $(printf '%q' "$REMOTE_DIR")"

rsync -az --delete \
  --exclude '.git/' \
  --exclude '.cursor/' \
  --exclude 'node_modules/' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'scripts/vps-deploy.sh' \
  -e "$RSYNC_RSH" \
  "$SOURCE"/ "${USER}@${HOST}:${REMOTE_DIR}/"

ssh_cmd "${USER}@${HOST}" "chown -R www-data:www-data $(printf '%q' "$REMOTE_DIR")"

if [[ "$UPDATE_INDEX" -eq 1 ]]; then
  INDEX_REMOTE="${ROOT%/}/index.html"
  INDEX_LOCAL="$TMPDIR/index.html"
  if scp_cmd "${USER}@${HOST}:${INDEX_REMOTE}" "$INDEX_LOCAL"; then
    python3 - "$INDEX_LOCAL" "$SLUG" "$TITLE" "$DESC" <<'PY'
import html, pathlib, re, sys
path, slug, title, desc = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4]
text = path.read_text(encoding="utf-8")
href = f"/{slug}/"
if f'href="{href}"' in text or f"href='{href}'" in text:
    sys.exit(0)
title_esc = html.escape(title)
desc_esc = html.escape(desc or f"{title} demosu")
card = (
    f'\n    <a class="card" href="{href}">\n'
    f'      <strong style="color:#1aa89a">{title_esc}</strong>\n'
    f'      <div>{desc_esc}</div>\n'
    f'    </a>\n'
)
updated, n = re.subn(r"[ \t]*</main>", card + "  </main>", text, count=1)
if n != 1:
    sys.exit(0)
path.write_text(updated, encoding="utf-8")
PY
    scp_cmd "$INDEX_LOCAL" "${USER}@${HOST}:${INDEX_REMOTE}"
    ssh_cmd "${USER}@${HOST}" "chown www-data:www-data $(printf '%q' "$INDEX_REMOTE")"
  fi
fi

log "deployed /${SLUG}/"
