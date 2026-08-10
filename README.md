# obsidiademo

Obsidia müşteri demo sitelerini VPS üzerinde paylaşmak için kullanılan repo.

## VPS demo hub

- Public hub: http://2.24.109.139/
- Demo URL pattern: `http://2.24.109.139/<slug>/`
- Web root on server: `/var/www/demos/<slug>/`

## Agent skill

Deploy prosedürü: [`.cursor/skills/vps-demo-deploy/SKILL.md`](.cursor/skills/vps-demo-deploy/SKILL.md)

Kullanıcı "VPS'e kaydet" dediğinde agent bu skill ile alt klasör açıp siteyi yayınlar.

## Required secrets

Cursor Cloud → Runtime Secrets:

| Name | Value |
| --- | --- |
| `VPS_HOST` | `2.24.109.139` |
| `VPS_USER` | `root` |
| `VPS_SSH_PASSWORD` | (SSH password) |

## Manual deploy

```bash
export VPS_SSH_PASSWORD='...'
./.cursor/skills/vps-demo-deploy/scripts/deploy-demo.sh my-demo ./dist
```
