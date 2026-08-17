# Akıllı Okul — Online Kurs Platformu

Profesyonel Udemy/Coursera mantığında online eğitim platformu demosu.

## Özellikler

- Landing page, kurs listesi, kurs detay, video player
- Öğrenci, Eğitmen, Admin ve Finans panelleri
- Sepet, checkout, kupon (AKILLI50, HOSGELDIN20)
- Canlı Zoom ders simülasyonu
- Quiz, sertifika, mesajlaşma, AI asistan
- Chart.js analitik grafikleri
- Dark mode, çoklu dil (TR/EN)
- 30 kurs, 12 kategori, 10 eğitmen demo verisi

## Başlatma

```bash
# Herhangi bir statik sunucu ile
python3 -m http.server 8080
# veya
npx serve .
```

Tarayıcıda: `http://localhost:8080`

## Demo Hesapları

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@akilliokul.com | 123456 |
| Eğitmen | egitmen@akilliokul.com | 123456 |
| Öğrenci | ogrenci@akilliokul.com | 123456 |
| Finans | finans@akilliokul.com | 123456 |

## Dosya Yapısı

```
/index.html          — Ana SPA
/login.html          — Giriş sayfası
/assets/css/style.css
/assets/js/data.js   — Demo veriler
/assets/js/storage.js
/assets/js/components.js
/assets/js/views.js
/assets/js/router.js
/assets/js/app.js
/assets/images/logo.svg
```

## Teknolojiler

HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Chart.js, Font Awesome, Google Fonts (Quicksand)
