# SatışKolay — VPS Dağıtımı

Bu klasör, SatışKolay statik sitesini bir VPS üzerinde üretim ortamında yayınlamak için gereken dosyaları içerir. Site tamamen statiktir (HTML/CSS/JS); nginx ile sunulur.

## İçerik

| Dosya | Açıklama |
| --- | --- |
| `deploy-hub.sh` | Mevcut sunucuya (nginx "demo hub") alt klasör olarak yayınlar — **bu sunucu için önerilen** |
| `Dockerfile` | nginx tabanlı üretim imajı (bağımsız/standalone VPS için) |
| `nginx.conf` | gzip, önbellek ve güvenlik başlıkları içeren nginx yapılandırması |
| `docker-compose.yml` | Docker ile tek komutla çalıştırma |
| `deploy.sh` | Bağımsız VPS'e Docker ile otomatik dağıtım (rsync + SSH) |

## Bu sunucu nasıl çalışıyor?

Hedef VPS bir **nginx "demo hub"** sunucusudur (Docker yok): nginx `root /var/www/demos`
klasörünü sunar ve her alt klasör `http://SUNUCU/<slug>/` adresinden yayınlanır. SatışKolay
bu nedenle `http://SUNUCU/satiskolay/` altında yayındadır. Güncellemek için aşağıdaki
`deploy-hub.sh` yeterlidir; nginx yapılandırmasına dokunmak gerekmez.

## Yöntem 0 — Demo hub'a yayınla/güncelle (bu sunucu için)

SSH anahtarı ile:

```bash
cd satiskolay/deploy
VPS_HOST=SUNUCU VPS_USER=root ./deploy-hub.sh
```

Parola ile (yerelde `sshpass` gerekir):

```bash
cd satiskolay/deploy
VPS_HOST=SUNUCU VPS_USER=root VPS_SSH_PASSWORD='***' ./deploy-hub.sh
```

Betik yalnızca `index.html` ve `assets/` klasörünü `/var/www/demos/satiskolay/` altına
`rsync` ile senkronlar ve `http://localhost/satiskolay/` üzerinden HTTP 200 doğrulaması yapar.

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
