# Güneş Bahçesi Anaokulu — HTML demosu

Kadıköy temalı, statik bir anaokulu sitesi. Sunucu gerekmez.

## Sayfalar

- `index.html` — ana sayfa
- `hakkimizda.html` — hikâye, değerler, gün akışı
- `programlar.html` — yaş grupları ve demo ücretler
- `ogretmenler.html` — kadro
- `galeri.html` — filtreli galeri
- `iletisim.html` — iletişim formu
- `kayit.html` — ön kayıt formu

Formlar tarayıcıda kalır; veri gönderilmez.

## Canlı demo

VPS üzerinde nginx ile yayınlandı:

- http://srv1894749.hstgr.cloud/anaokulu/
- Demo hub: http://srv1894749.hstgr.cloud/

## Yerelde nasıl açılır

`index.html` dosyasını tarayıcıda açın veya klasörde:

```bash
python3 -m http.server 8080
```

Sonra <http://localhost:8080> adresine gidin.
