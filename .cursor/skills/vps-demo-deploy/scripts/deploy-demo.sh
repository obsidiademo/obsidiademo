#!/usr/bin/env bash
# Deploy a local static site folder to the Obsidia demo VPS under /var/www/demos/<slug>/
set -euo pipefail

usage() {
  echo "Usage: $0 <slug> <local-dir>" >&2
  echo "  slug      lowercase demo folder name (e.g. acme-demo)" >&2
  echo "  local-dir path to built static files (contains index.html)" >&2
  exit 1
}

SLUG="${1:-}"
LOCAL_DIR="${2:-}"
[[ -n "$SLUG" && -n "$LOCAL_DIR" ]] || usage

if [[ ! "$SLUG" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
  echo "Invalid slug: $SLUG (use lowercase letters, numbers, hyphens)" >&2
  exit 1
fi

if [[ ! -d "$LOCAL_DIR" ]]; then
  echo "Local directory not found: $LOCAL_DIR" >&2
  exit 1
fi

if [[ ! -f "$LOCAL_DIR/index.html" ]]; then
  echo "Warning: $LOCAL_DIR/index.html not found — deploy continues, but URL may 404." >&2
fi

HOST="${VPS_HOST:-2.24.109.139}"
USER_NAME="${VPS_USER:-root}"
PASS="${VPS_SSH_PASSWORD:-}"

if [[ -z "$PASS" ]]; then
  echo "VPS_SSH_PASSWORD is not set. Add it as a Cursor Runtime Secret." >&2
  exit 1
fi

if ! command -v sshpass >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update -qq
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq sshpass
  else
    echo "sshpass is required" >&2
    exit 1
  fi
fi

export SSHPASS="$PASS"
SSH=(sshpass -e ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
SCP=(sshpass -e scp -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)
REMOTE="${USER_NAME}@${HOST}"
REMOTE_DIR="/var/www/demos/${SLUG}"

"${SSH[@]}" "$REMOTE" "mkdir -p '${REMOTE_DIR}'"

if command -v rsync >/dev/null 2>&1; then
  sshpass -e rsync -avz --delete \
    -e "ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20" \
    "${LOCAL_DIR%/}/" "${REMOTE}:${REMOTE_DIR}/"
else
  # scp cannot delete stale files; wipe then copy
  "${SSH[@]}" "$REMOTE" "rm -rf '${REMOTE_DIR}' && mkdir -p '${REMOTE_DIR}'"
  "${SCP[@]}" -r "${LOCAL_DIR%/}/." "${REMOTE}:${REMOTE_DIR}/"
fi

"${SSH[@]}" "$REMOTE" \
  "chown -R www-data:www-data /var/www/demos && find '${REMOTE_DIR}' -type d -exec chmod 755 {} \; && find '${REMOTE_DIR}' -type f -exec chmod 644 {} \;"

URL="http://${HOST}/${SLUG}/"
echo "Deployed: ${URL}"

# Soft verify
if curl -fsS -o /dev/null -w "%{http_code}" "$URL" | grep -Eq '200|301|302'; then
  echo "Healthcheck: OK"
else
  echo "Healthcheck: could not confirm HTTP 200 for ${URL}" >&2
fi
