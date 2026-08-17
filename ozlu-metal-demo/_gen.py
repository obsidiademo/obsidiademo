#!/usr/bin/env python3
"""Generate Özlü Metal demo HTML pages."""
from pathlib import Path

ROOT = Path(__file__).parent

HEAD = '''<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical}">
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="{ogtype}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="assets/images/products/boyali-rulo.webp">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Özlü Metal">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="assets/images/products/boyali-rulo.webp">
  <link rel="icon" type="image/png" href="assets/icons/favicon.png">
  <link rel="apple-touch-icon" href="assets/icons/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap">
  <link rel="stylesheet" href="assets/css/style.css">
  {extra_head}
</head>
'''

SCHEMA_ORG = '''
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": "https://ozlumetal.com/#organization",
        "name": "Özlü Metal Sanayi ve Ticaret Ltd. Şti.",
        "alternateName": "Özlü Metal",
        "url": "https://ozlumetal.com/",
        "logo": "assets/images/corporate/logo.png",
        "image": "assets/images/corporate/logo.png",
        "email": "info@ozlumetal.com",
        "telephone": ["+90 212 582 96 63", "+90 530 177 22 05"],
        "faxNumber": "+90 212 547 35 64",
        "foundingDate": "1983",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Demirciler Sitesi, 9. Yol, No: 68-70-72-74-77",
          "addressLocality": "Zeytinburnu",
          "addressRegion": "İstanbul",
          "addressCountry": "TR"
        },
        "areaServed": "TR",
        "sameAs": [
          "https://www.facebook.com/ozlumetal",
          "https://www.instagram.com/ozlu_metal/",
          "https://www.youtube.com/ozlumetal"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://ozlumetal.com/#website",
        "url": "https://ozlumetal.com/",
        "name": "Özlü Metal",
        "publisher": { "@id": "https://ozlumetal.com/#organization" },
        "inLanguage": "tr-TR",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "index.html#search",
          "query-input": "required name=search_term_string"
        }
      }
      {breadcrumb}
    ]
  }
  </script>
'''

def breadcrumb(items):
    els = []
    for i, (name, url) in enumerate(items, 1):
        els.append('{"@type":"ListItem","position":%d,"name":"%s","item":"%s"}' % (i, name, url))
    joined = ",".join(els)
    return ',\n      {"@type":"BreadcrumbList","itemListElement":[%s]}' % joined


HEADER = '''
<body class="has-bottom-cta">
  <a class="skip-link" href="#icerik">İçeriğe geç</a>
  <div class="topbar">
    <div class="container-wide topbar-inner">
      <div class="topbar-links">
        <a href="tel:+902125829663"><i data-lucide="phone"></i> 0212 582 96 63</a>
        <a href="mailto:info@ozlumetal.com"><i data-lucide="mail"></i> info@ozlumetal.com</a>
        <span>Zeytinburnu / İstanbul · Çelik Servis Merkezi: Düzce OSB</span>
      </div>
      <div class="topbar-social">
        <a href="https://www.instagram.com/ozlu_metal/" target="_blank" rel="noopener" aria-label="Instagram"><i data-lucide="instagram"></i></a>
        <a href="https://www.facebook.com/ozlumetal" target="_blank" rel="noopener" aria-label="Facebook"><i data-lucide="facebook"></i></a>
        <a href="https://www.youtube.com/ozlumetal" target="_blank" rel="noopener" aria-label="YouTube"><i data-lucide="youtube"></i></a>
      </div>
    </div>
  </div>

  <header class="site-header" id="site-header">
    <div class="container-wide header-inner">
      <a class="logo" href="index.html" aria-label="Özlü Metal anasayfa">
        <img src="assets/images/corporate/logo.png" alt="Özlü Metal Sanayi ve Ticaret Ltd. Şti." width="350" height="108">
      </a>
      <nav class="nav-desktop" aria-label="Ana menü">
        <ul class="nav-list">
          <li><a href="index.html" class="{active_home}">Anasayfa</a></li>
          <li><a href="corporate.html" class="{active_corp}">Kurumsal</a></li>
          <li class="has-mega">
            <a href="products.html" class="{active_prod}" aria-haspopup="true">Ürünler</a>
          </li>
          <li><a href="index.html#hizmetler">Hizmetler</a></li>
          <li><a href="manufacturing.html" class="{active_man}">İmalat</a></li>
          <li><a href="documents.html" class="{active_doc}">Belgelerimiz</a></li>
          <li><a href="contact.html" class="{active_con}">İletişim</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button class="btn-icon" type="button" data-open-search aria-label="Ürün ara"><i data-lucide="search"></i></button>
        <a class="btn-icon" href="tel:+902125829663" aria-label="Telefonla ara"><i data-lucide="phone"></i></a>
        <a class="btn-icon" href="https://wa.me/905301772205" target="_blank" rel="noopener" aria-label="WhatsApp"><i data-lucide="message-circle"></i></a>
        <button class="btn btn-primary header-cta" type="button" data-open-quote>Teklif Al <i data-lucide="arrow-right"></i></button>
        <button class="menu-toggle" type="button" id="menu-toggle" aria-label="Menüyü aç" aria-expanded="false" aria-controls="mobile-drawer"><i data-lucide="menu"></i></button>
      </div>
    </div>
    <div class="mega" id="mega-menu">
      <div class="mega-panel">
        <div class="mega-cats" role="tablist" aria-label="Ürün kategorileri">
          <button class="mega-cat is-active" type="button" data-cat="galvanizli">Galvanizli Sac <i data-lucide="chevron-right"></i></button>
          <button class="mega-cat" type="button" data-cat="boyali">Boyalı Sac <i data-lucide="chevron-right"></i></button>
          <button class="mega-cat" type="button" data-cat="beton">Beton Altı Trapez <i data-lucide="chevron-right"></i></button>
          <button class="mega-cat" type="button" data-cat="oluk">Eksiz Oluk Sistemleri <i data-lucide="chevron-right"></i></button>
          <button class="mega-cat" type="button" data-cat="profil">Profil <i data-lucide="chevron-right"></i></button>
          <button class="mega-cat" type="button" data-cat="strafor">Strafor <i data-lucide="chevron-right"></i></button>
          <button class="mega-cat" type="button" data-cat="baglanti">Bağlantı Elemanları <i data-lucide="chevron-right"></i></button>
        </div>
        <div class="mega-products" id="mega-products"></div>
        <aside class="mega-aside" id="mega-aside"></aside>
      </div>
    </div>
  </header>

  <div class="drawer-backdrop" id="drawer-backdrop"></div>
  <aside class="drawer" id="mobile-drawer" aria-hidden="true" aria-label="Mobil menü">
    <div class="drawer-head">
      <strong>Menü</strong>
      <button class="btn-icon" type="button" data-close-drawer aria-label="Menüyü kapat"><i data-lucide="x"></i></button>
    </div>
    <nav class="drawer-nav">
      <a href="index.html">Anasayfa</a>
      <div class="drawer-acc">
        <button class="drawer-acc-btn" type="button" aria-expanded="false">Kurumsal <i data-lucide="plus"></i></button>
        <div class="drawer-panel">
          <a href="corporate.html">Hakkımızda</a>
          <a href="corporate.html#vizyon">Vizyon</a>
          <a href="corporate.html#misyon">Misyon</a>
          <a href="corporate.html#degerler">Değerlerimiz</a>
        </div>
      </div>
      <div class="drawer-acc">
        <button class="drawer-acc-btn" type="button" aria-expanded="false">Ürünler <i data-lucide="plus"></i></button>
        <div class="drawer-panel">
          <a href="products.html">Tüm ürünler</a>
          <a href="products.html#galvanizli">Galvanizli Sac</a>
          <a href="products.html#boyali">Boyalı Sac</a>
          <a href="product-detail.html?id=beton-alti-trapez-sac">Beton Altı Trapez</a>
          <a href="product-detail.html?id=eksiz-oluk-sistemleri">Eksiz Oluk</a>
          <a href="product-detail.html?id=antipasli-profil">Profil</a>
          <a href="product-detail.html?id=vida">Bağlantı Elemanları</a>
        </div>
      </div>
      <div class="drawer-acc">
        <button class="drawer-acc-btn" type="button" aria-expanded="false">Hizmetler <i data-lucide="plus"></i></button>
        <div class="drawer-panel">
          <a href="index.html#hizmetler">Sac Kesim</a>
          <a href="index.html#hizmetler">Sac Büküm</a>
          <a href="index.html#hizmetler">Rulo Boy Kesme</a>
          <a href="index.html#hizmetler">Rulo Dilme</a>
          <a href="index.html#hizmetler">Stor</a>
          <a href="index.html#hizmetler">Trapezleme</a>
        </div>
      </div>
      <a href="manufacturing.html">İmalat</a>
      <a href="documents.html">Belgeler</a>
      <a href="contact.html">İletişim</a>
    </nav>
    <div class="drawer-foot">
      <button class="btn btn-primary" type="button" data-open-quote>Teklif Al</button>
      <div class="drawer-quick">
        <a class="btn btn-ghost" href="tel:+902125829663">Ara</a>
        <a class="btn btn-ghost" href="https://wa.me/905301772205" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </aside>
'''

FOOTER = '''
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="logo" href="index.html"><img src="assets/images/corporate/logo.png" alt="Özlü Metal" width="350" height="108"></a>
        <p>Çelikte Güven.<br>Üretimde Hassasiyet.</p>
      </div>
      <div>
        <h3>Kurumsal</h3>
        <ul>
          <li><a href="corporate.html">Hakkımızda</a></li>
          <li><a href="corporate.html#vizyon">Vizyon</a></li>
          <li><a href="corporate.html#misyon">Misyon</a></li>
          <li><a href="corporate.html#degerler">Değerlerimiz</a></li>
          <li><a href="documents.html">Belgelerimiz</a></li>
          <li><a href="manufacturing.html">İmalat</a></li>
        </ul>
      </div>
      <div>
        <h3>Ürünler</h3>
        <ul>
          <li><a href="products.html#galvanizli">Galvanizli Sac</a></li>
          <li><a href="products.html#boyali">Boyalı Sac</a></li>
          <li><a href="product-detail.html?id=beton-alti-trapez-sac">Beton Altı Trapez</a></li>
          <li><a href="product-detail.html?id=eksiz-oluk-sistemleri">Eksiz Oluk Sistemleri</a></li>
          <li><a href="product-detail.html?id=antipasli-profil">Profil</a></li>
          <li><a href="product-detail.html?id=vida">Bağlantı Elemanları</a></li>
        </ul>
      </div>
      <div>
        <h3>Hizmetler & İletişim</h3>
        <ul>
          <li><a href="index.html#hizmetler">Sac Kesim</a></li>
          <li><a href="index.html#hizmetler">Rulo Boy Kesme</a></li>
          <li><a href="index.html#hizmetler">Rulo Dilme</a></li>
          <li><a href="index.html#hizmetler">Trapezleme</a></li>
          <li><a href="tel:+902125829663">0212 582 96 63</a></li>
          <li><a href="mailto:info@ozlumetal.com">info@ozlumetal.com</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span id="year">2026</span> Özlü Metal Sanayi ve Ticaret Ltd. Şti. Tüm hakları saklıdır.</p>
      <div class="socials">
        <a href="https://www.instagram.com/ozlu_metal/" target="_blank" rel="noopener" aria-label="Instagram"><i data-lucide="instagram"></i></a>
        <a href="https://www.facebook.com/ozlumetal" target="_blank" rel="noopener" aria-label="Facebook"><i data-lucide="facebook"></i></a>
        <a href="https://www.youtube.com/ozlumetal" target="_blank" rel="noopener" aria-label="YouTube"><i data-lucide="youtube"></i></a>
        <a href="https://wa.me/905301772205" target="_blank" rel="noopener" aria-label="WhatsApp"><i data-lucide="message-circle"></i></a>
      </div>
    </div>
  </footer>

  <a class="wa-float" href="https://wa.me/905301772205" target="_blank" rel="noopener">
    <span class="wa-ico"><i data-lucide="message-circle"></i></span>
    <span>WhatsApp'tan Teklif Al</span>
  </a>
  <nav class="mobile-cta" aria-label="Hızlı iletişim">
    <a href="tel:+902125829663"><i data-lucide="phone"></i>Ara</a>
    <a href="https://wa.me/905301772205" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>WhatsApp</a>
    <button class="is-main" type="button" data-open-quote><i data-lucide="file-text"></i>Teklif Al</button>
  </nav>

  <div class="search-overlay" id="search-overlay" aria-hidden="true" role="dialog" aria-label="Ürün arama">
    <div class="search-box">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <p class="eyebrow">Arama</p>
        <button class="btn-icon" type="button" data-close-overlay="search-overlay" aria-label="Aramayı kapat"><i data-lucide="x"></i></button>
      </div>
      <label>Ürün veya hizmet ara...
        <input id="search-input" type="search" placeholder="Ürün veya hizmet ara..." autocomplete="off">
      </label>
      <div class="search-results" id="search-results"></div>
    </div>
  </div>

  <div class="overlay" id="quote-overlay" aria-hidden="true" role="dialog" aria-labelledby="quote-title">
    <div class="modal" role="document">
      <div class="modal-head">
        <div>
          <p class="eyebrow">B2B talep</p>
          <h2 id="quote-title">Teklif Talebi</h2>
        </div>
        <button class="btn-icon" type="button" data-close-overlay="quote-overlay" aria-label="Kapat"><i data-lucide="x"></i></button>
      </div>
      <form id="quote-form" class="form-grid">
        <div class="form-row two">
          <label>Ad Soyad<input name="name" required autocomplete="name"></label>
          <label>Firma<input name="company" required autocomplete="organization"></label>
        </div>
        <div class="form-row two">
          <label>Telefon<input name="phone" type="tel" required autocomplete="tel"></label>
          <label>E-posta<input name="email" type="email" required autocomplete="email"></label>
        </div>
        <label>Ürün / Hizmet
          <select id="quote-product" name="product" required></select>
        </label>
        <label>Talep edilen ürün / açıklama
          <input name="item" placeholder="Örn. boyalı trapez sac, RAL rengi">
        </label>
        <div class="form-row two">
          <label>Kalınlık<input name="thickness" placeholder="mm"></label>
          <label>Genişlik<input name="width" placeholder="mm"></label>
        </div>
        <div class="form-row two">
          <label>Uzunluk<input name="length" placeholder="mm"></label>
          <label>Miktar<input name="qty" placeholder="adet / ton"></label>
        </div>
        <label>Not<textarea name="note" placeholder="Proje ve teslimat notunuz"></textarea></label>
        <label class="file-box">
          Dosya / teknik çizim yükle
          <input id="quote-file" name="file" type="file" accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png">
          <small id="quote-file-name">PDF, DWG, DXF, JPG veya PNG yükleyin</small>
          <div class="file-types"><span>PDF</span><span>DWG</span><span>DXF</span><span>JPG</span><span>PNG</span></div>
        </label>
        <button class="btn btn-primary" type="submit">Teklif Talebini Gönder</button>
      </form>
    </div>
  </div>

  <script src="assets/js/lucide.min.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
'''

INDEX = r'''
<main id="icerik">
  <section class="hero grid-lines" aria-labelledby="hero-title">
    <div class="hero-bg" aria-hidden="true">
      <img src="assets/images/products/boyali-rulo.webp" alt="" width="872" height="600">
      <div class="hero-fade"></div>
    </div>
    <div class="container-wide hero-grid">
      <div class="hero-copy">
        <div class="hero-badge reveal d1"><span class="badge-dot"><i data-lucide="factory"></i></span> 1983'ten beri çeliğe değer katıyoruz</div>
        <h1 id="hero-title" class="reveal d2">Çeliği işliyor,<span>projelere güç katıyoruz.</span></h1>
        <p class="hero-lead reveal d3">Galvanizli ve boyalı sac çözümlerinden özel ölçü kesim, dilimleme ve trapezleme hizmetlerine kadar projenize özel çelik servisi.</p>
        <div class="hero-cta reveal d4">
          <a class="btn btn-primary" href="products.html">Ürünleri İncele <i data-lucide="arrow-right"></i></a>
          <button class="btn btn-ghost" type="button" data-open-quote>Teklif Al <i data-lucide="arrow-up-right"></i></button>
        </div>
      </div>
      <div class="hero-visual reveal d5 img-reveal">
        <div class="hero-frame">
          <img src="assets/images/products/rulo-dilme.webp" alt="Özlü Metal dilimlenmiş galvanizli rulo saclar" width="872" height="600">
        </div>
        <div class="hero-chip c1"><strong>Çelik Servis Merkezi</strong><span>Düzce Organize Sanayi Bölgesi</span></div>
        <div class="hero-chip c2"><strong>1983</strong><span>Eminönü Uzun Çarşı’da kuruluş</span></div>
      </div>
    </div>
  </section>

  <section class="trust" aria-label="Kurumsal özet">
    <div class="container trust-grid">
      <div class="trust-item"><div class="trust-ico"><i data-lucide="hourglass"></i></div><div><b>40+ yıllık tecrübe</b><span>1983’ten bu yana galvaniz sektörü</span></div></div>
      <div class="trust-item"><div class="trust-ico"><i data-lucide="factory"></i></div><div><b>Çelik servis merkezi</b><span>Düzce OSB üretim hatları</span></div></div>
      <div class="trust-item"><div class="trust-ico"><i data-lucide="layers"></i></div><div><b>Geniş ürün yelpazesi</b><span>Sac, mahya, profil ve bağlantı</span></div></div>
      <div class="trust-item"><div class="trust-ico"><i data-lucide="ruler"></i></div><div><b>Projeye özel üretim</b><span>Kesim, dilme, trapez ve stor</span></div></div>
    </div>
  </section>

  <section class="section bg-soft" id="hakkimizda" aria-labelledby="about-title">
    <div class="container about-grid">
      <div class="about-media img-reveal">
        <img src="assets/images/factory/sac-grubu.webp" alt="Özlü Metal sac grubu: oluklu sac, düz sac ve rulo" width="1600" height="626">
        <div class="about-year"><b>1983</b><span>Eminönü Uzun Çarşı kuruluşu</span></div>
      </div>
      <div>
        <p class="eyebrow">Özlü Metal hakkında</p>
        <h2 id="about-title" class="section-title">Dört on yılı aşan<br>çelik tecrübesi.</h2>
        <p class="lead">Özlü Metal Sanayi ve Ticaret Ltd. Şti., galvaniz sektöründe 40 yılı aşkın tecrübeyle faaliyet gösterir. 1983 yılında Eminönü Uzun Çarşı’da kurulan firma, Türkiye sac ve çelik sektöründe çözüm odaklı ürün ve hizmet sunar.</p>
        <p class="lead">Düzce Organize Sanayi Bölgesi’ndeki Çelik Servis Merkezi’nde oluk, trapez, boy kesme ve dilimleme hatlarıyla çalışır. Toplam Kalite felsefesiyle müşteri ayrımı yapmadan, teknolojinin olanaklarını kullanarak ürün yelpazesini geliştirir.</p>
        <ul class="value-list">
          <li><i data-lucide="check"></i><span>Müşteri memnuniyetini temel politika olarak benimser.</span></li>
          <li><i data-lucide="check"></i><span>Hızlı, kesin ve kaliteli çözümler sunmayı amaçlar.</span></li>
          <li><i data-lucide="check"></i><span>Zeytinburnu Demirciler Sitesi’nde İstanbul ofisi bulunur.</span></li>
        </ul>
        <div class="hero-cta"><a class="btn btn-primary" href="corporate.html">Hakkımızda <i data-lucide="arrow-right"></i></a></div>
      </div>
    </div>
  </section>

  <section class="section bg-white" id="urunler" aria-labelledby="cat-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Ürün gruplarımız</p>
        <h2 id="cat-title" class="section-title">Çelik ihtiyaçlarına<br>tek noktadan çözüm.</h2>
      </div>
      <div class="cat-grid">
        <a class="cat-card" href="products.html#galvanizli">
          <img src="assets/images/products/galvanizli-sac.webp" alt="Galvanizli sac ruloları" width="800" height="800" loading="lazy">
          <div class="cat-card-body"><div><h3>Galvanizli Sac</h3><p>9 alt ürün · trapez, rulo, mahya</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
        <a class="cat-card" href="products.html#boyali">
          <img src="assets/images/products/boyali-trapez.webp" alt="Boyalı trapez sac" width="872" height="600" loading="lazy">
          <div class="cat-card-body"><div><h3>Boyalı Sac</h3><p>8 alt ürün · renkli çatı ve cephe</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
        <a class="cat-card" href="product-detail.html?id=beton-alti-trapez-sac">
          <img src="assets/images/products/beton-alti-trapez.webp" alt="Beton altı trapez sac" width="872" height="600" loading="lazy">
          <div class="cat-card-body"><div><h3>Beton Altı Trapez</h3><p>2 ürün · kompozit döşeme</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
        <a class="cat-card" href="product-detail.html?id=eksiz-oluk-sistemleri">
          <img src="assets/images/products/eksiz-oluk.webp" alt="Eksiz oluk sistemleri" width="872" height="600" loading="lazy">
          <div class="cat-card-body"><div><h3>Eksiz Oluk Sistemleri</h3><p>2 ürün · tek parça uygulama</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
        <a class="cat-card" href="product-detail.html?id=antipasli-profil">
          <img src="assets/images/products/antipasli-profil.webp" alt="Antipaslı profil" width="872" height="600" loading="lazy">
          <div class="cat-card-body"><div><h3>Profil</h3><p>Antipaslı profil</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
        <a class="cat-card" href="product-detail.html?id=trapez-alti-strafor">
          <img src="assets/images/products/galvaniz-trapez.webp" alt="Trapez sac üzerinde yalıtım uygulaması bağlamı" width="872" height="600" loading="lazy">
          <div class="cat-card-body"><div><h3>Strafor</h3><p>Trapez altı strafor</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
        <a class="cat-card" href="product-detail.html?id=baglanti-elemanlari">
          <img src="assets/images/products/vida.webp" alt="Bağlantı elemanları vida" width="872" height="600" loading="lazy">
          <div class="cat-card-body"><div><h3>Bağlantı Elemanları</h3><p>Vida ve semer</p></div><span class="cat-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span></div>
        </a>
      </div>
    </div>
  </section>

  <section class="section bg-main" id="one-cikan" aria-labelledby="feat-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Öne çıkan ürünler</p>
        <h2 id="feat-title" class="section-title">Projeye göre<br>seçilmiş sac çözümleri.</h2>
      </div>
      <div class="filters" role="tablist" aria-label="Ürün filtresi">
        <button class="filter-btn is-active" type="button" data-filter="tumu">Tümü</button>
        <button class="filter-btn" type="button" data-filter="galvanizli">Galvanizli</button>
        <button class="filter-btn" type="button" data-filter="boyali">Boyalı</button>
        <button class="filter-btn" type="button" data-filter="trapez">Trapez</button>
        <button class="filter-btn" type="button" data-filter="rulo">Rulo</button>
        <button class="filter-btn" type="button" data-filter="oluk">Oluk</button>
        <button class="filter-btn" type="button" data-filter="diger">Diğer</button>
      </div>
      <div class="product-grid" id="featured-grid"></div>
    </div>
  </section>

  <section class="section bg-metal" id="celik-servis" aria-labelledby="ssc-title">
    <div class="container ssc">
      <div>
        <p class="eyebrow">Çelik servis merkezi</p>
        <h2 id="ssc-title" class="section-title">Üretimin merkezinde<br>hassasiyet var.</h2>
        <p class="lead">Düzce Organize Sanayi Bölgesi’ndeki Çelik Servis Merkezi’nde oluk, trapez, boy kesme ve dilimleme hatları ile sac işlenir. Sıcak ve RP saca kesim ve dilme işlemleri, müşteri beklentileri doğrultusunda ISO 9001:2000 kalite yönetim standardına uygun yürütülür.</p>
        <div class="ssc-visual img-reveal" style="margin-top:24px">
          <img src="assets/images/factory/boyali-sac-hat.webp" alt="Özlü Metal boyalı sac rulo stoğu ve üretim alanı" width="1600" height="626">
          <div class="hotspot" style="left:8%;top:18%"><b>01</b><span>Boy Kesme</span></div>
          <div class="hotspot" style="left:38%;top:58%"><b>02</b><span>Dilimleme</span></div>
          <div class="hotspot" style="right:18%;top:28%"><b>03</b><span>Trapez</span></div>
          <div class="hotspot" style="right:8%;bottom:16%"><b>04</b><span>Oluk</span></div>
        </div>
      </div>
      <div class="ssc-specs">
        <article class="spec-card">
          <h3>Dilme makinesi</h3>
          <dl>
            <div><dt>Üretim kapasitesi</dt><dd>100.000 ton / yıl</dd></div>
            <div><dt>Sac kalınlığı</dt><dd>1,50 – 6,00 mm</dd></div>
            <div><dt>Sac genişliği</dt><dd>20 – 1600 mm</dd></div>
            <div><dt>Giriş bobin ağırlığı</dt><dd>30 ton</dd></div>
          </dl>
        </article>
        <article class="spec-card">
          <h3>Kesme makinesi</h3>
          <p class="lead" style="margin-bottom:10px">3 adet makine</p>
          <dl>
            <div><dt>Üretim kapasitesi</dt><dd>400.000 ton / yıl</dd></div>
            <div><dt>Sac kalınlığı</dt><dd>1,50 – 16,00 mm</dd></div>
            <div><dt>Sac genişliği</dt><dd>200 – 2000 mm</dd></div>
            <div><dt>Levha boyu (max)</dt><dd>14.000 mm</dd></div>
          </dl>
        </article>
        <a class="btn btn-ghost" href="manufacturing.html">İmalat detayları <i data-lucide="arrow-right"></i></a>
      </div>
    </div>
  </section>

  <section class="section bg-white" id="hizmetler" aria-labelledby="svc-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Hizmetlerimiz</p>
        <h2 id="svc-title" class="section-title">Sac işleme,<br>hat üzerinde netlik.</h2>
      </div>
      <div class="service-list">
        <article class="service-row is-active" tabindex="0" data-service="sac-kesim">
          <div class="service-num">01</div>
          <h3>Sac Kesim</h3>
          <p>Projenize özel ölçülerde hassas sac işleme. Kesme hattı 1,50–16,00 mm kalınlık aralığında çalışır.</p>
          <div class="service-thumb"><img src="assets/images/services/sac-kesim.webp" alt="" width="200" height="140"></div>
        </article>
        <article class="service-row" tabindex="0" data-service="sac-bukum">
          <div class="service-num">02</div>
          <h3>Sac Büküm</h3>
          <p>Çatı, cephe ve imalat parçaları için ölçüye uygun büküm.</p>
          <div class="service-thumb"><img src="assets/images/services/sac-bukum.webp" alt="" width="200" height="140"></div>
        </article>
        <article class="service-row" tabindex="0" data-service="rulo-boy-kesme">
          <div class="service-num">03</div>
          <h3>Rulo Boy Kesme</h3>
          <p>Rulodan levhaya. Levha boyu en fazla 14.000 mm.</p>
          <div class="service-thumb"><img src="assets/images/services/rulo-boy-kesme.webp" alt="" width="200" height="140"></div>
        </article>
        <article class="service-row" tabindex="0" data-service="rulo-dilme">
          <div class="service-num">04</div>
          <h3>Rulo Dilme</h3>
          <p>1,50–6,00 mm kalınlık, 20–1600 mm genişlikte dilimleme.</p>
          <div class="service-thumb"><img src="assets/images/services/rulo-dilme.webp" alt="" width="200" height="140"></div>
        </article>
        <article class="service-row" tabindex="0" data-service="stor">
          <div class="service-num">05</div>
          <h3>Stor</h3>
          <p>Tabela, pano ve dekoratif uygulamalar için stor sac işleme.</p>
          <div class="service-thumb"><img src="assets/images/services/stor.webp" alt="" width="200" height="140"></div>
        </article>
        <article class="service-row" tabindex="0" data-service="trapezleme">
          <div class="service-num">06</div>
          <h3>Trapezleme</h3>
          <p>Çatı, cephe ve beton altı için trapez form.</p>
          <div class="service-thumb"><img src="assets/images/services/trapezleme.webp" alt="" width="200" height="140"></div>
        </article>
      </div>
      <figure class="service-stage">
        <img id="service-stage-img" src="assets/images/services/sac-kesim.webp" alt="Sac kesim üretim görseli" width="1200" height="600">
        <figcaption id="service-stage-cap">Sac Kesim</figcaption>
      </figure>
    </div>
  </section>

  <section class="section bg-soft" id="imalat" aria-labelledby="gal-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">İmalat</p>
        <h2 id="gal-title" class="section-title">Üretimden<br>sahaya giden çelik.</h2>
      </div>
      <div class="gallery-grid">
        <figure class="gallery-item lg img-reveal"><img src="assets/images/factory/sac-grubu.webp" alt="Galvanizli oluklu sac, düz sac ve rulo stok görünümü" width="1600" height="626" loading="lazy"></figure>
        <figure class="gallery-item img-reveal"><img src="assets/images/products/galvaniz-trapez.webp" alt="Galvanizli trapez sac istif" width="872" height="600" loading="lazy"></figure>
        <figure class="gallery-item img-reveal"><img src="assets/images/products/boyali-rulo.webp" alt="Boyalı sac ruloları" width="872" height="600" loading="lazy"></figure>
      </div>
      <div class="hero-cta" style="margin-top:22px"><a class="btn btn-ghost" href="manufacturing.html">İmalat sayfası <i data-lucide="arrow-right"></i></a></div>
    </div>
  </section>

  <section class="section bg-white" id="cozum" aria-labelledby="find-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Projeye göre çözüm</p>
        <h2 id="find-title" class="section-title">Hangi ürüne<br>ihtiyacınız var?</h2>
        <p class="lead">Uygulama türünü seçin; ilgili ürün gruplarını öne çıkaralım. Bu bir yönlendirme aracıdır, teklif yerine geçmez.</p>
      </div>
      <div class="finder-grid">
        <button class="finder-opt is-active" type="button" data-need="cati-kaplama">Çatı Kaplama</button>
        <button class="finder-opt" type="button" data-need="cephe-kaplama">Cephe Kaplama</button>
        <button class="finder-opt" type="button" data-need="endustriyel">Endüstriyel Üretim</button>
        <button class="finder-opt" type="button" data-need="beton-alti">Beton Altı Uygulama</button>
        <button class="finder-opt" type="button" data-need="oluk-sistemi">Oluk Sistemi</button>
        <button class="finder-opt" type="button" data-need="metal-profil">Metal Profil</button>
        <button class="finder-opt" type="button" data-need="baglanti">Bağlantı Elemanları</button>
      </div>
      <div class="finder-results" id="finder-results"></div>
    </div>
  </section>

  <section class="section bg-main" id="degerler" aria-labelledby="val-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Değerlerimiz</p>
        <h2 id="val-title" class="section-title">İşi tutan ilkeler.</h2>
      </div>
      <div class="values-list">
        <div class="value-acc open">
          <button type="button" aria-expanded="true"><span>01</span><span>Güvenilirlik</span><i data-lucide="plus"></i></button>
          <div class="panel">Tüm ilişkilerimizde dürüst, şeffaf ve güvene dayalı bir yaklaşım sergileriz.</div>
        </div>
        <div class="value-acc">
          <button type="button" aria-expanded="false"><span>02</span><span>Kalite</span><i data-lucide="plus"></i></button>
          <div class="panel">Her ürün ve hizmette mükemmelliği hedefleriz.</div>
        </div>
        <div class="value-acc">
          <button type="button" aria-expanded="false"><span>03</span><span>Yenilik</span><i data-lucide="plus"></i></button>
          <div class="panel">Sürekli gelişim ve teknolojik yenilikleri takip ederiz.</div>
        </div>
        <div class="value-acc">
          <button type="button" aria-expanded="false"><span>04</span><span>Müşteri Odaklılık</span><i data-lucide="plus"></i></button>
          <div class="panel">Müşteri ihtiyaçlarını merkeze alır, beklentilerin ötesinde çözümler sunarız.</div>
        </div>
        <div class="value-acc">
          <button type="button" aria-expanded="false"><span>05</span><span>Sürdürülebilirlik</span><i data-lucide="plus"></i></button>
          <div class="panel">Çevreye ve topluma duyarlı üretim anlayışını benimseriz.</div>
        </div>
        <div class="value-acc">
          <button type="button" aria-expanded="false"><span>06</span><span>Ekip Ruhu</span><i data-lucide="plus"></i></button>
          <div class="panel">Başarının temelinin güçlü bir ekipten geçtiğine inanırız.</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section bg-white" id="belgeler" aria-labelledby="doc-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Belgelerimiz</p>
        <h2 id="doc-title" class="section-title">Kurumsal kayıt<br>ve denetim.</h2>
        <p class="lead">Sitede yayımlanan belgeler aşağıdadır. Üretim süreçleri ISO 9001:2000 kalite yönetim standardına atıfla imalat sayfasında açıklanır.</p>
      </div>
      <article class="doc-card">
        <div class="doc-thumb"><img src="assets/images/documents/denetci.webp" alt="Bağımsız denetçi belgesi görseli" width="860" height="860" loading="lazy"></div>
        <div>
          <h3>Bağımsız Denetçi Belgesi</h3>
          <p>Dönem 01.01.2026 – 31.12.2026 · Can Bağımsız Denetim ve YMM A.Ş · Sicil No 432564</p>
        </div>
        <a class="btn btn-ghost" href="assets/images/documents/denetci.jpg" target="_blank" rel="noopener">Görüntüle</a>
      </article>
      <div class="hero-cta" style="margin-top:18px"><a class="btn btn-ghost" href="documents.html">Tüm belgeler <i data-lucide="arrow-right"></i></a></div>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="cta-title">
    <div class="container">
      <p class="eyebrow">Teklif</p>
      <h2 id="cta-title" class="section-title">Projeniz için<br>doğru çelik çözümünü birlikte belirleyelim.</h2>
      <p class="lead">Ürün, ölçü ve uygulama detaylarınızı paylaşın. Ekibimiz ihtiyacınıza uygun çözüm için sizinle iletişime geçsin.</p>
      <div class="cta-actions">
        <button class="btn btn-primary" type="button" data-open-quote>Teklif Al</button>
        <a class="btn btn-ghost" href="tel:+902125829663">Bizi Arayın</a>
      </div>
    </div>
  </section>

  <section class="section bg-white" id="iletisim" aria-labelledby="contact-title">
    <div class="container contact-grid">
      <div class="contact-card">
        <p class="eyebrow">İletişim</p>
        <h2 id="contact-title" class="section-title" style="font-size:clamp(28px,3vw,44px)">Bize ulaşın</h2>
        <p class="lead">Özlü Metal kimdir, hangi ürünleri sağlar ve teklif nasıl alınır sorularının pratik yanıtı: İstanbul ofisinden veya WhatsApp hattından ölçülerinizi iletmeniz yeterlidir.</p>
        <div class="contact-row"><i data-lucide="phone"></i><div><span>Telefon</span><a href="tel:+902125829663">0212 582 96 63 PBX</a></div></div>
        <div class="contact-row"><i data-lucide="message-circle"></i><div><span>WhatsApp</span><a href="https://wa.me/905301772205" target="_blank" rel="noopener">0530 177 22 05</a></div></div>
        <div class="contact-row"><i data-lucide="mail"></i><div><span>E-posta</span><a href="mailto:info@ozlumetal.com">info@ozlumetal.com</a></div></div>
        <div class="contact-row"><i data-lucide="printer"></i><div><span>Faks</span><p>0212 547 35 64</p></div></div>
        <div class="contact-row"><i data-lucide="map-pin"></i><div><span>Adres</span><p>Demirciler Sitesi, 9. Yol, No: 68-70-72-74-77<br>Zeytinburnu / İstanbul</p></div></div>
      </div>
      <div class="form-card">
        <h3 style="margin-bottom:14px">Mesaj gönderin</h3>
        <form id="contact-form" class="form-grid">
          <label>Ad Soyad<input name="name" required autocomplete="name"></label>
          <div class="form-row two">
            <label>Telefon<input name="phone" type="tel" required></label>
            <label>E-posta<input name="email" type="email" required></label>
          </div>
          <label>Konu<input name="subject" required></label>
          <label>Mesaj<textarea name="message" required></textarea></label>
          <button class="btn btn-primary" type="submit">Gönder</button>
        </form>
      </div>
    </div>
    <div class="container map-wrap">
      <iframe title="Özlü Metal Zeytinburnu haritası" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Demirciler%20Sitesi%209.%20Yol%20Zeytinburnu%20Istanbul&output=embed&z=16"></iframe>
    </div>
  </section>

  <section class="brand-moment" aria-hidden="false">
    <div class="container">
      <p>40+ yıllık<br>tecrübe.<span>Tek bir hedef:</span><em>Güvenilir çelik.</em></p>
    </div>
  </section>
</main>
'''

CORPORATE = r'''
<main id="icerik">
  <div class="page-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Sayfa yolu"><a href="index.html">Anasayfa</a><span>/</span><span>Kurumsal</span></nav>
      <p class="eyebrow">Kurumsal</p>
      <h1 class="section-title">Özlü Metal kimdir?</h1>
      <p class="lead">1983’te Eminönü Uzun Çarşı’da kurulan, Düzce OSB’de çelik servis merkezi işleten sac ve çelik firması.</p>
    </div>
  </div>
  <section class="section bg-main">
    <div class="container">
      <div class="tabs" role="tablist">
        <button class="tab-btn is-active" type="button" data-tab="tab-about">Hakkımızda</button>
        <button class="tab-btn" type="button" data-tab="tab-vizyon">Vizyon</button>
        <button class="tab-btn" type="button" data-tab="tab-misyon">Misyon</button>
        <button class="tab-btn" type="button" data-tab="tab-deger">Değerlerimiz</button>
      </div>
      <article id="tab-about" class="tab-panel is-active">
        <div class="about-grid">
          <div class="about-media"><img src="assets/images/factory/coils.webp" alt="Dilimlenmiş rulo sac paleti" width="872" height="600"></div>
          <div>
            <h2 class="section-title" style="font-size:clamp(28px,3vw,48px)">Köklü geçmiş,<br>süregelen üretim.</h2>
            <p class="lead">Özlü Metal Sanayi ve Ticaret Ltd. Şti., galvaniz sektöründe 40 yılı aşkın tecrübeyle faaliyet göstermektedir. 1983 yılında Eminönü Uzun Çarşı’da kurulan firmamız, Türkiye’nin sac ve çelik sektöründe çözüm üreten markalarından biri haline gelmiştir.</p>
            <p class="lead">Kurulduğumuz günden bu yana müşteri memnuniyetini temel politika olarak benimseyerek Türkiye genelinde güvenilir bir marka konumuna ulaştık. Düzce Organize Sanayi Bölgesi’nde bulunan Çelik Servis Merkezimizde oluk, trapez, boy kesme ve dilimleme hatlarımızla hizmet vermekteyiz.</p>
            <p class="lead">Toplam Kalite Felsefesini benimseyen Özlü Metal, müşteri ayrımı yapmadan çözüm odaklı ürün ve hizmetler sunmakta, teknolojinin tüm olanaklarını kullanarak faaliyetlerine devam etmektedir.</p>
          </div>
        </div>
      </article>
      <article id="tab-vizyon" class="tab-panel">
        <h2 class="section-title" id="vizyon">Vizyon</h2>
        <p class="lead" style="max-width:52ch;margin-top:18px">Köklerimizden aldığımız güç, tecrübemiz ve yenilikçi yaklaşımımızla; çelik sektöründe kapsamlı çözümler sunan, güvenilir ve öncü bir marka olmayı hedefliyoruz.</p>
      </article>
      <article id="tab-misyon" class="tab-panel">
        <h2 class="section-title" id="misyon">Misyon</h2>
        <p class="lead" style="max-width:52ch;margin-top:18px">Tüm paydaşlarımıza değer katarak, kaliteden ödün vermeden ve sürekli gelişim anlayışıyla; güvenilir, sürdürülebilir ve çözüm odaklı hizmetler sunmak.</p>
      </article>
      <article id="tab-deger" class="tab-panel">
        <h2 class="section-title" id="degerler">Değerlerimiz</h2>
        <div class="values-list" style="margin-top:24px">
          <div class="value-acc open"><button type="button"><span>01</span><span>Güvenilirlik</span><i data-lucide="plus"></i></button><div class="panel">Tüm ilişkilerimizde dürüst, şeffaf ve güvene dayalı bir yaklaşım sergileriz.</div></div>
          <div class="value-acc"><button type="button"><span>02</span><span>Kalite</span><i data-lucide="plus"></i></button><div class="panel">Her ürün ve hizmette mükemmelliği hedefleriz.</div></div>
          <div class="value-acc"><button type="button"><span>03</span><span>Yenilik</span><i data-lucide="plus"></i></button><div class="panel">Sürekli gelişim ve teknolojik yenilikleri takip ederiz.</div></div>
          <div class="value-acc"><button type="button"><span>04</span><span>Müşteri Odaklılık</span><i data-lucide="plus"></i></button><div class="panel">Müşteri ihtiyaçlarını merkeze alır, beklentilerin ötesinde çözümler sunarız.</div></div>
          <div class="value-acc"><button type="button"><span>05</span><span>Sürdürülebilirlik</span><i data-lucide="plus"></i></button><div class="panel">Çevreye ve topluma duyarlı üretim anlayışını benimseriz.</div></div>
          <div class="value-acc"><button type="button"><span>06</span><span>Ekip Ruhu</span><i data-lucide="plus"></i></button><div class="panel">Başarının temelinin güçlü bir ekipten geçtiğine inanırız.</div></div>
        </div>
      </article>
    </div>
  </section>
</main>
'''

PRODUCTS_PAGE = r'''
<main id="icerik">
  <div class="page-hero">
    <div class="container">
      <nav class="breadcrumb"><a href="index.html">Anasayfa</a><span>/</span><span>Ürünler</span></nav>
      <p class="eyebrow">Ürünler</p>
      <h1 class="section-title">Hangi ürünleri sağlarız?</h1>
      <p class="lead">Galvanizli ve boyalı sac, beton altı trapez, eksiz oluk, profil, strafor ve bağlantı elemanları. Çatı kaplama, cephe, endüstriyel üretim ve montaj ihtiyaçları tek katalogda.</p>
    </div>
  </div>
  <section class="section bg-main">
    <div class="container">
      <p id="galvanizli" class="eyebrow">Katalog</p>
      <div class="product-grid" id="all-products"></div>
    </div>
  </section>
</main>
'''

DETAIL = r'''
<main id="icerik">
  <div id="product-detail"></div>
</main>
'''

MANUFACTURING = r'''
<main id="icerik">
  <div class="page-hero">
    <div class="container">
      <nav class="breadcrumb"><a href="index.html">Anasayfa</a><span>/</span><span>İmalat</span></nav>
      <p class="eyebrow">İmalat</p>
      <h1 class="section-title">Nerede ve nasıl üretiriz?</h1>
      <p class="lead">Düzce Organize Sanayi Bölgesi Çelik Servis Merkezi’nde oluk, trapez, boy kesme ve dilimleme hatları.</p>
    </div>
  </div>
  <section class="section bg-main">
    <div class="container about-grid">
      <div class="about-media"><img src="assets/images/factory/trapez.webp" alt="Galvanizli trapez sac üretim istifleri" width="872" height="600"></div>
      <div>
        <h2 class="section-title" style="font-size:clamp(28px,3vw,48px)">Kesim ve dilme,<br>ölçüye göre.</h2>
        <p class="lead">Sıcak ve RP saca kesim ve dilme işlemleri müşteri beklentileri doğrultusunda ISO 9001:2000 KYS standardına uygun olarak gerçekleştirilmektedir.</p>
        <p class="lead">Hizmet hatları: sac kesim, sac büküm, rulo boy kesme, rulo dilme, stor ve trapezleme.</p>
      </div>
    </div>
    <div class="container" style="margin-top:40px">
      <div class="ssc-specs two">
        <article class="spec-card">
          <h3>Dilme makinesi teknik özellikleri</h3>
          <dl>
            <div><dt>Üretim kapasitesi</dt><dd>100.000 ton / yıl</dd></div>
            <div><dt>Üretilebilen sac kalınlığı</dt><dd>1,50 – 6,00 mm</dd></div>
            <div><dt>Üretilebilen sac genişliği</dt><dd>20 – 1600 mm</dd></div>
            <div><dt>Giriş bobin iç çapı</dt><dd>500 – 610 mm</dd></div>
            <div><dt>Giriş bobin dış çap (max)</dt><dd>2100 mm</dd></div>
            <div><dt>Çıkış bobin iç çapı</dt><dd>510 mm</dd></div>
            <div><dt>Çıkış bobin dış çapı</dt><dd>1600 mm</dd></div>
            <div><dt>Giriş bobin ağırlığı</dt><dd>30 ton</dd></div>
            <div><dt>Çıkış bobin ağırlığı</dt><dd>18 ton</dd></div>
          </dl>
        </article>
        <article class="spec-card">
          <h3>Kesme makinesi teknik özellikleri</h3>
          <p>3 adet makine</p>
          <dl>
            <div><dt>Üretim kapasitesi</dt><dd>400.000 ton / yıl</dd></div>
            <div><dt>Üretilebilen sac kalınlığı</dt><dd>1,50 – 16,00 mm</dd></div>
            <div><dt>Üretilebilen sac genişliği</dt><dd>200 – 2000 mm</dd></div>
            <div><dt>Üretilebilen levha boyu (max)</dt><dd>14.000 mm</dd></div>
            <div><dt>Giriş bobin iç çapı</dt><dd>500 – 800 mm</dd></div>
            <div><dt>Giriş bobin dış çapı</dt><dd>2000 mm</dd></div>
            <div><dt>Giriş bobin ağırlığı</dt><dd>30 ton</dd></div>
          </dl>
        </article>
      </div>
    </div>
  </section>
  <section class="section bg-soft">
    <div class="container gallery-grid">
      <figure class="gallery-item lg"><img src="assets/images/factory/boyali-sac-hat.webp" alt="Boyalı sac rulo üretim alanı" width="1600" height="626"></figure>
      <figure class="gallery-item"><img src="assets/images/factory/oluk.webp" alt="Eksiz oluk sistemi" width="872" height="600"></figure>
      <figure class="gallery-item"><img src="assets/images/products/rulo-dilme.webp" alt="Dilimlenmiş rulo sac paleti" width="872" height="600"></figure>
    </div>
  </section>
</main>
'''

DOCUMENTS = r'''
<main id="icerik">
  <div class="page-hero">
    <div class="container">
      <nav class="breadcrumb"><a href="index.html">Anasayfa</a><span>/</span><span>Belgelerimiz</span></nav>
      <p class="eyebrow">Belgelerimiz</p>
      <h1 class="section-title">Yayımlanan kurumsal belgeler</h1>
      <p class="lead">Aşağıdaki belge mevcut Özlü Metal sitesinde yer alan kayıttır. Başka bir sertifika listelenmemiştir.</p>
    </div>
  </div>
  <section class="section bg-main">
    <div class="container" style="display:grid;gap:16px;max-width:820px">
      <article class="doc-card">
        <div class="doc-thumb"><img src="assets/images/documents/denetci.webp" alt="Denetçi belgesi" width="860" height="860"></div>
        <div>
          <h3>Bağımsız Denetçi Belgesi</h3>
          <p>Belge tipi: Denetçi kaydı<br>Dönem: 01.01.2026 – 31.12.2026<br>Unvan: Can Bağımsız Denetim ve YMM A.Ş<br>Sicil No: 432564</p>
        </div>
        <a class="btn btn-ghost" href="assets/images/documents/denetci.jpg" target="_blank" rel="noopener">PDF / Görüntüle</a>
      </article>
      <p class="lead">İmalat süreçleri için ISO 9001:2000 kalite yönetim standardına uygun kesim ve dilme uygulaması imalat sayfasında belirtilmiştir; ayrı bir sertifika görseli yayımlanmamıştır.</p>
    </div>
  </section>
</main>
'''

CONTACT = r'''
<main id="icerik">
  <div class="page-hero">
    <div class="container">
      <nav class="breadcrumb"><a href="index.html">Anasayfa</a><span>/</span><span>İletişim</span></nav>
      <p class="eyebrow">İletişim</p>
      <h1 class="section-title">Teklif nasıl alınır?</h1>
      <p class="lead">Telefon, WhatsApp veya form üzerinden ürün, ölçü ve miktar bilgisi paylaşın. Profesyonel müşteri temsilcileri ihtiyaca göre dönüş yapar.</p>
    </div>
  </div>
  <section class="section bg-main">
    <div class="container contact-grid">
      <div class="contact-card">
        <h2>Bize Ulaşın</h2>
        <div class="contact-row"><i data-lucide="phone"></i><div><span>Telefon</span><a href="tel:+902125829663">0212 582 96 63 PBX</a></div></div>
        <div class="contact-row"><i data-lucide="message-circle"></i><div><span>WhatsApp</span><a href="https://wa.me/905301772205" target="_blank" rel="noopener">0530 177 22 05</a></div></div>
        <div class="contact-row"><i data-lucide="mail"></i><div><span>E-posta</span><a href="mailto:info@ozlumetal.com">info@ozlumetal.com</a></div></div>
        <div class="contact-row"><i data-lucide="printer"></i><div><span>Faks</span><p>0212 547 35 64</p></div></div>
        <div class="contact-row"><i data-lucide="map-pin"></i><div><span>Adres</span><p>Demirciler Sitesi, 9. Yol, No: 68-70-72-74-77<br>Zeytinburnu / İstanbul</p></div></div>
        <div class="contact-row"><i data-lucide="factory"></i><div><span>Üretim</span><p>Düzce Organize Sanayi Bölgesi<br>Çelik Servis Merkezi</p></div></div>
        <div class="socials" style="margin-top:18px">
          <a href="https://www.instagram.com/ozlu_metal/" target="_blank" rel="noopener" aria-label="Instagram" style="border-color:var(--border);color:var(--navy)"><i data-lucide="instagram"></i></a>
          <a href="https://www.facebook.com/ozlumetal" target="_blank" rel="noopener" aria-label="Facebook" style="border-color:var(--border);color:var(--navy)"><i data-lucide="facebook"></i></a>
          <a href="https://www.youtube.com/ozlumetal" target="_blank" rel="noopener" aria-label="YouTube" style="border-color:var(--border);color:var(--navy)"><i data-lucide="youtube"></i></a>
        </div>
      </div>
      <div class="form-card">
        <form id="contact-form" class="form-grid">
          <label>Ad Soyad<input name="name" required></label>
          <label>Telefon<input name="phone" type="tel" required></label>
          <label>E-posta<input name="email" type="email" required></label>
          <label>Konu<input name="subject" required></label>
          <label>Mesaj<textarea name="message" required></textarea></label>
          <button class="btn btn-primary" type="submit">Gönder</button>
        </form>
      </div>
    </div>
    <div class="container map-wrap">
      <iframe title="Özlü Metal konumu" loading="lazy" src="https://maps.google.com/maps?q=Demirciler%20Sitesi%209.%20Yol%20No%2068%20Zeytinburnu%20Istanbul&output=embed&z=16"></iframe>
    </div>
  </section>
</main>
'''

PRODUCT_SCHEMA = '''
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Özlü Metal Ürünleri",
    "itemListElement": [
      {"@type":"Product","name":"Trapez Sac","description":"Çatı ve cephe kaplamalarında kullanılan dayanıklı çelik sac.","brand":{"@type":"Brand","name":"Özlü Metal"}},
      {"@type":"Product","name":"Galvanizli Düz Sac","description":"0,30 mm ile 3,00 mm kalınlık aralığında galvanizli düz sac.","brand":{"@type":"Brand","name":"Özlü Metal"}},
      {"@type":"Product","name":"Boyalı Trapez Sac","description":"Çatı ve dış cephe için boyalı trapez sac.","brand":{"@type":"Brand","name":"Özlü Metal"}},
      {"@type":"Product","name":"Beton Altı Trapez Sac","description":"Kompozit yapılarda kalıp görevi gören beton altı trapez.","brand":{"@type":"Brand","name":"Özlü Metal"}},
      {"@type":"Product","name":"Eksiz Oluk Sistemleri","description":"Tek parça çatı oluk sistemleri.","brand":{"@type":"Brand","name":"Özlü Metal"}}
    ]
  }
  </script>
'''


def page(filename, title, description, body, active=None, extra="", crumbs=None):
    act = {
        "active_home": "is-active" if active == "home" else "",
        "active_corp": "is-active" if active == "corp" else "",
        "active_prod": "is-active" if active == "prod" else "",
        "active_man": "is-active" if active == "man" else "",
        "active_doc": "is-active" if active == "doc" else "",
        "active_con": "is-active" if active == "con" else "",
    }
    bc = breadcrumb(crumbs or [("Anasayfa", "index.html")])
    html = (
        HEAD.format(title=title, description=description, canonical=filename, ogtype="website", extra_head=extra)
        + SCHEMA_ORG.replace("{breadcrumb}", bc)
        + HEADER.format(**act)
        + body
        + FOOTER
    )
    (ROOT / filename).write_text(html, encoding="utf-8")
    print("wrote", filename, "bytes", len(html))


def main():
    page(
        "index.html",
        "Özlü Metal | Galvanizli ve Boyalı Sac · Çelik Servis Merkezi",
        "Özlü Metal, 1983’ten beri galvanizli ve boyalı sac, trapez, oluk, kesim ve dilimleme hizmetleri sunan çelik servis merkezidir. Düzce OSB üretim, Zeytinburnu İstanbul ofis.",
        INDEX,
        active="home",
        extra=PRODUCT_SCHEMA,
        crumbs=[("Anasayfa", "index.html")],
    )
    page(
        "corporate.html",
        "Kurumsal | Özlü Metal Hakkımızda, Vizyon ve Misyon",
        "Özlü Metal 1983’te Eminönü Uzun Çarşı’da kuruldu. 40 yılı aşkın galvaniz tecrübesi, Düzce OSB çelik servis merkezi, vizyon, misyon ve değerler.",
        CORPORATE,
        active="corp",
        crumbs=[("Anasayfa", "index.html"), ("Kurumsal", "corporate.html")],
    )
    page(
        "products.html",
        "Ürünler | Galvanizli Sac, Boyalı Sac, Trapez, Oluk | Özlü Metal",
        "Özlü Metal ürünleri: galvanizli sac, boyalı sac, beton altı trapez, eksiz oluk sistemleri, antipaslı profil, trapez altı strafor, vida ve semer.",
        PRODUCTS_PAGE,
        active="prod",
        extra=PRODUCT_SCHEMA,
        crumbs=[("Anasayfa", "index.html"), ("Ürünler", "products.html")],
    )
    page(
        "product-detail.html",
        "Ürün Detayı | Özlü Metal",
        "Özlü Metal ürün detayı: özellikler, kullanım alanları ve teklif talebi.",
        DETAIL,
        active="prod",
        crumbs=[("Anasayfa", "index.html"), ("Ürünler", "products.html"), ("Ürün", "product-detail.html")],
    )
    page(
        "manufacturing.html",
        "İmalat | Çelik Servis Merkezi Düzce OSB | Özlü Metal",
        "Düzce OSB çelik servis merkezinde dilme ve kesme hatları. Dilme 100.000 ton/yıl, kesme 400.000 ton/yıl. ISO 9001:2000’e uygun kesim ve dilme.",
        MANUFACTURING,
        active="man",
        crumbs=[("Anasayfa", "index.html"), ("İmalat", "manufacturing.html")],
    )
    page(
        "documents.html",
        "Belgelerimiz | Özlü Metal",
        "Özlü Metal yayımlanan belgeler: 2026 dönemi bağımsız denetçi kaydı, Can Bağımsız Denetim ve YMM A.Ş.",
        DOCUMENTS,
        active="doc",
        crumbs=[("Anasayfa", "index.html"), ("Belgelerimiz", "documents.html")],
    )
    page(
        "contact.html",
        "İletişim | Özlü Metal Zeytinburnu İstanbul",
        "Özlü Metal iletişim: 0212 582 96 63, WhatsApp 0530 177 22 05, info@ozlumetal.com, Demirciler Sitesi 9. Yol Zeytinburnu İstanbul.",
        CONTACT,
        active="con",
        crumbs=[("Anasayfa", "index.html"), ("İletişim", "contact.html")],
    )


if __name__ == "__main__":
    main()
