#!/usr/bin/env bash
# SatışKolay — VPS deploy (nginx static)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${VPS_HOST:?VPS_HOST gerekli}"
USER_NAME="${VPS_USER:?VPS_USER gerekli}"
PORT="${VPS_PORT:-22}"
REMOTE_DIR="${VPS_REMOTE_DIR:-/var/www/satiskolay}"
DOMAIN="${VPS_DOMAIN:-_}"

TMP_KEY="$(mktemp)"
cleanup() { rm -f "$TMP_KEY"; }
trap cleanup EXIT

if [[ -n "${VPS_SSH_PRIVATE_KEY:-}" ]]; then
  printf '%s\n' "$VPS_SSH_PRIVATE_KEY" > "$TMP_KEY"
  chmod 600 "$TMP_KEY"
  SSH=(ssh -i "$TMP_KEY" -p "$PORT" -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)
  SCP=(scp -i "$TMP_KEY" -P "$PORT" -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)
elif [[ -f "${VPS_SSH_KEY_FILE:-}" ]]; then
  SSH=(ssh -i "$VPS_SSH_KEY_FILE" -p "$PORT" -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)
  SCP=(scp -i "$VPS_SSH_KEY_FILE" -P "$PORT" -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes)
else
  echo "VPS_SSH_PRIVATE_KEY veya VPS_SSH_KEY_FILE gerekli" >&2
  exit 1
fi

TARGET="${USER_NAME}@${HOST}"
echo "→ ${TARGET}:${REMOTE_DIR}"

# Pack site files
BUNDLE="$(mktemp -d)/satiskolay.tgz"
tar -czf "$BUNDLE" -C "$ROOT" \
  index.html \
  assets \
  README.md

"${SSH[@]}" "$TARGET" "sudo mkdir -p '$REMOTE_DIR' && sudo chown -R \$USER:\$USER '$REMOTE_DIR'"
"${SCP[@]}" "$BUNDLE" "${TARGET}:/tmp/satiskolay.tgz"
"${SSH[@]}" "$TARGET" "tar -xzf /tmp/satiskolay.tgz -C '$REMOTE_DIR' && rm -f /tmp/satiskolay.tgz"

# Nginx site (idempotent)
NGINX_CONF=$(cat <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${DOMAIN};
    root ${REMOTE_DIR};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(css|js|svg|png|jpg|jpeg|gif|webp|glb|gltf|woff2?)\$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
EOF
)

"${SSH[@]}" "$TARGET" "bash -s" <<REMOTE
set -euo pipefail
if command -v nginx >/dev/null 2>&1; then
  echo '$NGINX_CONF' | sudo tee /etc/nginx/sites-available/satiskolay >/dev/null
  sudo ln -sfn /etc/nginx/sites-available/satiskolay /etc/nginx/sites-enabled/satiskolay
  # Disable default if present to avoid port conflict
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t
  sudo systemctl reload nginx
  echo "nginx reloaded"
elif command -v apache2 >/dev/null 2>&1; then
  echo "nginx yok; apache DocumentRoot'u elle ${REMOTE_DIR} yapın"
else
  # Fallback: python static if nothing else (not for production long-term)
  echo "Uyarı: nginx bulunamadı. Dosyalar ${REMOTE_DIR} konumunda."
fi
REMOTE

echo "✓ Deploy tamam: http://${HOST}/"
if [[ "$DOMAIN" != "_" ]]; then
  echo "  Domain: http://${DOMAIN}/"
fi
