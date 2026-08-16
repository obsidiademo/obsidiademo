#!/usr/bin/env bash
# Idempotent Cloud Agent install: SSH/rsync tools for Hostinger VPS deploys.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -qq
sudo apt-get install -y -qq openssh-client sshpass rsync
if [[ -f scripts/vps-deploy.sh ]]; then
  chmod +x scripts/vps-deploy.sh
  sudo install -m 0755 scripts/vps-deploy.sh /usr/local/bin/vps-deploy
fi
