# Obsidia demo VPS layout

## Host

- IP: `2.24.109.139`
- OS: Ubuntu 24.04 LTS
- Web server: nginx
- Demo document root: `/var/www/demos`
- Hub page: `http://2.24.109.139/`
- Per-demo URL: `http://2.24.109.139/<slug>/`

## Nginx

- Site file: `/etc/nginx/sites-available/demos`
- Enabled link: `/etc/nginx/sites-enabled/demos`
- Default site disabled

Useful checks:

```bash
nginx -t
systemctl status nginx --no-pager
curl -sI http://127.0.0.1/
```

## Directory convention

```text
/var/www/demos/
  index.html          # hub
  <slug>/
    index.html
    assets/...
```

## Recovery bootstrap (if nginx missing)

```bash
apt-get update
apt-get install -y nginx
mkdir -p /var/www/demos
# restore sites-available/demos as in skill setup history
systemctl enable --now nginx
```

## Credentials

Use Cursor Runtime Secrets only:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_PASSWORD`
