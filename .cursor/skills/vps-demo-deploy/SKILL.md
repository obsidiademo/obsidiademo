---
name: vps-demo-deploy
description: Obsidia müşteri demo sitelerini VPS'e otomatik deploy et. Use when the user says VPS'e kaydet, demo yayınla, sunucuya yükle, paylaşılabilir demo linki ver, or asks to deploy a demo site to the VPS.
---

# Obsidia VPS Demo Deploy

Müşteriye gösterilecek demo siteleri bu VPS üzerinde alt klasör olarak yayınlanır. Kullanıcı **"VPS'e kaydet"**, **"demo yayınla"**, **"sunucuya yükle"** veya benzeri dediğinde bu skill'i uygula; ekstra onay beklemeden deploy et.

## Connection (non-secret)

| Item | Value |
| --- | --- |
| Host | `2.24.109.139` |
| User | `root` |
| Web root | `/var/www/demos` |
| Public base URL | `http://2.24.109.139` |
| Nginx site | `/etc/nginx/sites-available/demos` |

## Secrets (required)

Credentials live in Cursor **Runtime Secrets**, never in git or this skill body:

| Secret | Expected value |
| --- | --- |
| `VPS_HOST` | `2.24.109.139` |
| `VPS_USER` | `root` |
| `VPS_SSH_PASSWORD` | SSH password |

Read them from the environment. Prefer:

```bash
HOST="${VPS_HOST:-2.24.109.139}"
USER_NAME="${VPS_USER:-root}"
PASS="${VPS_SSH_PASSWORD:?VPS_SSH_PASSWORD secret missing}"
```

If `VPS_SSH_PASSWORD` is missing, stop and ask the user to add Runtime Secrets. Do **not** invent passwords and do **not** commit secrets.

## When to run

Trigger automatically for:

- "VPS'e kaydet"
- "demo'yu yayınla / paylaş"
- "müşteriye link ver"
- "bunu sunucuya at"

Default: create/update a slug subdirectory under `/var/www/demos/<slug>/` and return the public URL.

## Slug rules

1. Prefer an explicit name from the user (`acme`, `satiskolay`).
2. Else derive from project/folder/brand: lowercase ASCII, hyphens only, `[a-z0-9-]+`.
3. Never deploy to web root `/` itself; always use a subdirectory.
4. Redeploying the same slug overwrites that folder (idempotent sync).

## Deploy workflow

1. Build or prepare static output locally (e.g. `dist/`, `out/`, `build/`, or plain HTML).
2. Ensure `sshpass` is available; add host key once.
3. Run the helper (or equivalent rsync/scp):

```bash
./.cursor/skills/vps-demo-deploy/scripts/deploy-demo.sh <slug> <local-dir>
```

4. Verify:

```bash
curl -sI "http://${HOST}/<slug>/" | head -5
```

5. Reply to the user with exactly one primary link:

`http://2.24.109.139/<slug>/`

Optional: also list what was uploaded (file count / build note). Keep the response short.

## Manual SSH pattern

```bash
export SSHPASS="$VPS_SSH_PASSWORD"
sshpass -e ssh -o StrictHostKeyChecking=accept-new "${VPS_USER}@${VPS_HOST}" 'command'
sshpass -e rsync -avz --delete ./dist/ "${VPS_USER}@${VPS_HOST}:/var/www/demos/<slug>/"
```

If `rsync` is missing remotely or locally, fall back to:

```bash
sshpass -e ssh "$USER_NAME@$HOST" "mkdir -p /var/www/demos/<slug>"
sshpass -e scp -r ./dist/. "$USER_NAME@$HOST:/var/www/demos/<slug>/"
```

After upload, fix permissions:

```bash
sshpass -e ssh "$USER_NAME@$HOST" 'chown -R www-data:www-data /var/www/demos && find /var/www/demos -type d -exec chmod 755 {} \; && find /var/www/demos -type f -exec chmod 644 {} \;'
```

## SPA / base path notes

- Static multi-page or assets with relative paths: upload as-is into `/var/www/demos/<slug>/`.
- Vite/Next static export served from a subpath: build with base `/<slug>/` when the framework requires it (e.g. Vite `base: '/<slug>/'`), then deploy the build output.
- Ensure there is an `index.html` at the slug root.

## Server facts

See [references/server.md](references/server.md) for nginx layout and recovery steps.

## Safety

- Do not store or print the password in commits, PR bodies, or skill updates.
- Do not expose unrelated server files.
- Do not change SSH password or firewall unless the user explicitly asks.
- Prefer overwriting only `/var/www/demos/<slug>/`.
