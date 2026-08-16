# SatışKolay statik sitesi için üretim imajı (nginx).
# Derleme bağlamı (build context) `satiskolay/` klasörüdür.
FROM nginx:1.27-alpine

# nginx yapılandırması
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Statik site dosyaları
COPY index.html /usr/share/nginx/html/index.html
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost/ || exit 1
