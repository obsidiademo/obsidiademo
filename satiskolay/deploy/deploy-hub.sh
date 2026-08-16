#!/usr/bin/env bash
#
# SatışKolay statik sitesini, nginx tabanlı bir "demo hub" sunucusuna
# alt klasör olarak (ör. http://SUNUCU/satiskolay/) yayınlar/günceller.
#
# Bu sunucuda site şu anda böyle yayınlanıyor:
#   nginx  ->  root /var/www/demos  ->  /satiskolay/  (Docker yok)
# nginx yapılandırması alt klasörleri otomatik sunduğu için sadece
# dosyaları kopyalamak yeterlidir; nginx'e dokunulmaz.
#
# Ön koşullar:
#   - Yerel makinede: bash, rsync, ssh (parola ile giriş için sshpass)
#   - Sunucuda: rsync ve alt klasörleri sunan bir nginx (root = REMOTE_WEBROOT)
#
# Kullanım (SSH anahtarı ile):
#   VPS_HOST=srv.ornek.com VPS_USER=root ./deploy-hub.sh
#
# Kullanım (parola ile):
#   VPS_HOST=srv.ornek.com VPS_USER=root VPS_SSH_PASSWORD='***' ./deploy-hub.sh
#
# İsteğe bağlı ortam değişkenleri:
#   VPS_PORT        SSH portu (varsayılan: 22)
#   REMOTE_WEBROOT  Hub kök klasörü (varsayılan: /var/www/demos)
#   SLUG            Alt klasör adı (varsayılan: satiskolay)
#
set -euo pipefail

: "${VPS_HOST:?VPS_HOST gerekli (ör. srv.ornek.com)}"
: "${VPS_USER:?VPS_USER gerekli (ör. root)}"
VPS_PORT="${VPS_PORT:-22}"
REMOTE_WEBROOT="${REMOTE_WEBROOT:-/var/www/demos}"
SLUG="${SLUG:-satiskolay}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REMOTE_DIR="${REMOTE_WEBROOT%/}/${SLUG}"

# Parola verildiyse sshpass ile sarmala, yoksa doğrudan ssh/rsync kullan.
SSH_BASE=(ssh -p "${VPS_PORT}" -o StrictHostKeyChecking=accept-new)
if [[ -n "${VPS_SSH_PASSWORD:-}" ]]; then
  command -v sshpass >/dev/null || { echo "HATA: parola girişi için 'sshpass' kurulu olmalı." >&2; exit 1; }
  export SSHPASS="${VPS_SSH_PASSWORD}"
  SSH_CMD=(sshpass -e "${SSH_BASE[@]}" -o PreferredAuthentications=password -o PubkeyAuthentication=no)
else
  SSH_CMD=("${SSH_BASE[@]}")
fi

echo ">> Hedef: ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR} (SSH portu ${VPS_PORT})"

echo ">> Uzak klasör hazırlanıyor..."
"${SSH_CMD[@]}" "${VPS_USER}@${VPS_HOST}" "mkdir -p '${REMOTE_DIR}'"

echo ">> Site dosyaları rsync ile gönderiliyor (yalnızca index.html + assets)..."
rsync -az --delete \
  -e "$(printf '%q ' "${SSH_CMD[@]}")" \
  "${SITE_DIR}/index.html" "${SITE_DIR}/assets" \
  "${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/"

echo ">> Doğrulama..."
"${SSH_CMD[@]}" "${VPS_USER}@${VPS_HOST}" \
  "curl -s -o /dev/null -w 'GET /${SLUG}/ -> HTTP %{http_code}\n' http://localhost/${SLUG}/"

echo ">> Tamamlandı. Site: http://${VPS_HOST}/${SLUG}/"
