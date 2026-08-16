# SatışKolay — VPS Dağıtımı

Bu klasör, SatışKolay statik sitesini bir VPS üzerinde üretim ortamında yayınlamak için gereken dosyaları içerir. Site tamamen statiktir (HTML/CSS/JS); nginx ile sunulur.

## İçerik

| Dosya | Açıklama |
| --- | --- |
| `Dockerfile` | nginx tabanlı üretim imajı |
| `nginx.conf` | gzip, önbellek ve güvenlik başlıkları içeren nginx yapılandırması |
| `docker-compose.yml` | Tek komutla çalıştırma |
| `deploy.sh` | Yerelden uzak VPS'e otomatik dağıtım (rsync + SSH) |

## Yöntem 1 — Yerelden otomatik dağıtım (önerilen)

Yerel makinenizde `rsync` ve `ssh`, VPS üzerinde `docker` ve `docker compose` kurulu olmalıdır.

```bash
cd satiskolay/deploy
VPS_HOST=kullanici@SUNUCU_IP ./deploy.sh
```

İsteğe bağlı değişkenler:

```bash
VPS_HOST=kullanici@SUNUCU_IP \
VPS_PORT=22 \
REMOTE_DIR=/opt/satiskolay \
HOST_PORT=80 \
./deploy.sh
```

Betik; dosyaları VPS'e kopyalar, imajı derler ve container'ı `unless-stopped` politikasıyla başlatır. Site `http://SUNUCU_IP:HOST_PORT/` adresinde yayına girer.

## Yöntem 2 — VPS üzerinde elle çalıştırma

Depoyu (veya `satiskolay/` klasörünü) VPS'e kopyaladıktan sonra:

```bash
cd satiskolay/deploy
docker compose up -d --build
# Farklı port için:
HOST_PORT=8080 docker compose up -d --build
```

Durum ve loglar:

```bash
docker compose ps
docker compose logs -f
```

Durdurma / kaldırma:

```bash
docker compose down
```

## Yöntem 3 — Docker'sız (bare-metal nginx)

VPS'te nginx doğrudan kuruluysa:

1. Site dosyalarını kopyalayın:
   ```bash
   sudo mkdir -p /var/www/satiskolay
   sudo cp -r satiskolay/index.html satiskolay/assets /var/www/satiskolay/
   ```
2. `nginx.conf` içindeki `server { ... }` bloğunu bir site yapılandırması olarak ekleyin
   (`root` değerini `/var/www/satiskolay` yapın), etkinleştirin ve nginx'i yeniden yükleyin:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

## HTTPS (öneri)

Alan adınızı VPS IP'sine yönlendirdikten sonra HTTPS için en pratik yol, önüne bir ters
vekil (Caddy veya Traefik) koymak ya da bare-metal nginx'te Certbot kullanmaktır:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alanadi.com -d www.alanadi.com
```

## Notlar

- Uygulama; Three.js, Font Awesome ve Google Fonts kaynaklarını CDN üzerinden yükler, bu
  nedenle VPS'in dışa internet erişimi olmalıdır.
- 80/443 portlarının VPS güvenlik duvarında açık olduğundan emin olun.
