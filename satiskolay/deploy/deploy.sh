#!/usr/bin/env bash
#
# SatışKolay statik sitesini uzak bir VPS'e dağıtır.
#
# Ön koşullar:
#   - Yerel makinede: bash, rsync, ssh
#   - VPS üzerinde: docker + docker compose eklentisi kurulu ve SSH erişimi
#
# Kullanım:
#   VPS_HOST=kullanici@1.2.3.4 ./deploy.sh
#
# İsteğe bağlı ortam değişkenleri:
#   VPS_PORT    SSH portu (varsayılan: 22)
#   REMOTE_DIR  VPS'te hedef klasör (varsayılan: /opt/satiskolay)
#   HOST_PORT   Sitenin yayınlanacağı dış port (varsayılan: 80)
#
set -euo pipefail

if [[ -z "${VPS_HOST:-}" ]]; then
  echo "HATA: VPS_HOST ayarlanmalı. Örn: VPS_HOST=kullanici@1.2.3.4 ./deploy.sh" >&2
  exit 1
fi

VPS_PORT="${VPS_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/satiskolay}"
HOST_PORT="${HOST_PORT:-80}"

# Bu betiğin bulunduğu klasör (deploy/) ve site kök klasörü (satiskolay/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo ">> Hedef: ${VPS_HOST}:${REMOTE_DIR} (SSH portu ${VPS_PORT}, dış port ${HOST_PORT})"

echo ">> Uzak klasör hazırlanıyor..."
ssh -p "${VPS_PORT}" "${VPS_HOST}" "mkdir -p '${REMOTE_DIR}'"

echo ">> Dosyalar rsync ile gönderiliyor..."
rsync -az --delete \
  -e "ssh -p ${VPS_PORT}" \
  --exclude '.git' \
  "${SITE_DIR}/" "${VPS_HOST}:${REMOTE_DIR}/"

echo ">> VPS üzerinde container derleniyor ve başlatılıyor..."
ssh -p "${VPS_PORT}" "${VPS_HOST}" \
  "cd '${REMOTE_DIR}/deploy' && HOST_PORT='${HOST_PORT}' docker compose up -d --build"

echo ">> Tamamlandı. Site http://<vps-ip>:${HOST_PORT}/ adresinde yayında."
