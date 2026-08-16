# SatışKolay

Yeni nesil araç alım-satım platformu — frontend demo prototipi.

## Çalıştırma

```bash
# Klasörden herhangi bir statik sunucu
npx serve .
# veya
python3 -m http.server 8080
```

Tarayıcıda `index.html` açın.

## VPS'e Dağıtım

Üretim (nginx + Docker) dağıtımı için: [`deploy/README.md`](deploy/README.md)

```bash
cd deploy
VPS_HOST=kullanici@SUNUCU_IP ./deploy.sh
```

## Özellikler

- Kolay360™ 3D araç deneyimi (Three.js)
- KolaySkor™ / KolayFiyat™ / KolayCheck™
- SatışKolay AI danışman
- Gelişmiş arama, karşılaştırma, favoriler
- Galeri paneli (dashboard + ilan wizard)
- Finansman hesaplayıcı, ekspertiz, test sürüşü

Backend yok; tüm veriler `assets/js/data.js` içinde mock.
