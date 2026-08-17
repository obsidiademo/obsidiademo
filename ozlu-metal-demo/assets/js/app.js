/* Özlü Metal demo interactions + product catalog */
(function () {
  "use strict";

  const PHONE = "+902125829663";
  const WHATSAPP = "905301772205";
  const EMAIL = "info@ozlumetal.com";

  const CATEGORIES = [
    {
      id: "galvanizli",
      name: "Galvanizli Sac",
      count: "9 ürün",
      image: "assets/images/products/galvanizli-sac.webp",
      text: "Galvaniz rulo, levha, trapez, oluklu ve mahya çözümleri.",
    },
    {
      id: "boyali",
      name: "Boyalı Sac",
      count: "8 ürün",
      image: "assets/images/products/boyali-sac.webp",
      text: "Polyester boyalı saclar; çatı, cephe ve endüstriyel kullanım.",
    },
    {
      id: "beton",
      name: "Beton Altı Trapez",
      count: "2 ürün",
      image: "assets/images/products/beton-alti-trapez.webp",
      text: "Kompozit yapılarda kalıp görevi gören beton altı trapez saclar.",
    },
    {
      id: "oluk",
      name: "Eksiz Oluk Sistemleri",
      count: "2 ürün",
      image: "assets/images/products/eksiz-oluk.webp",
      text: "Tek parça uygulama, hava koşullarına direnç ve estetik görünüm.",
    },
    {
      id: "profil",
      name: "Profil",
      count: "1 ürün",
      image: "assets/images/products/antipasli-profil.webp",
      text: "Çatı konstrüksiyonları için antipaslı profil çözümleri.",
    },
    {
      id: "strafor",
      name: "Strafor",
      count: "1 ürün",
      image: "assets/images/products/galvaniz-trapez.webp",
      text: "Trapez altı ısı ve ses yalıtımı sağlayan strafor paneller.",
    },
    {
      id: "baglanti",
      name: "Bağlantı Elemanları",
      count: "2 ürün",
      image: "assets/images/products/vida.webp",
      text: "Vida ve semer ile güvenli montaj tamamlayıcıları.",
    },
  ];

  const PRODUCTS = [
    {
      id: "trapez-sac",
      name: "Trapez Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli", "trapez"],
      image: "assets/images/products/galvaniz-trapez.webp",
      short: "Çatı ve cephe kaplamalarında kullanılan dayanıklı çelik sac çözümü.",
      description:
        "Trapez sac, inşaat ve sanayi sektöründe çatı ve cephe kaplamalarında sıkça tercih edilen dayanıklı bir çelik sac türüdür. Özlü Metal, farklı ebat ve kalınlıklarda trapez sac seçenekleri sunar; kesim ve dilimleme hizmetleriyle projeye özel çözüm sağlar. Ürünler uzun ömürlü, pas ve korozyona dayanıklı yapısıyla çatı ve cephe uygulamalarını destekler.",
      features: [
        "Çatı ve cephe kaplamalarında kullanım",
        "Farklı ebat ve kalınlık seçenekleri",
        "Kesim ve dilimleme hizmetiyle projeye özel üretim",
        "Pas ve korozyona dayanıklı yapı",
      ],
      uses: ["Çatı kaplama", "Cephe kaplama", "Hangar ve endüstriyel yapılar"],
      search: "trapez sac galvanizli çatı cephe",
    },
    {
      id: "stor-sac",
      name: "Stor Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli"],
      image: "assets/images/products/galvaniz-stor.webp",
      short: "Tabela, reklam panosu ve dekoratif çatı uygulamaları için stor sac.",
      description:
        "Stor sac, tabela, reklam panoları ve dekoratif çatı uygulamalarında estetik ve dayanıklı bir malzeme olarak öne çıkar. Özlü Metal, farklı renk, ölçü ve yüzey seçenekleriyle stor sac sunar. Uzun ömürlü ve korozyona dayanıklı yapısı ile hem iç hem dış mekân uygulamalarında kullanılabilir.",
      features: [
        "Tabela ve reklam panosu uygulamaları",
        "Dekoratif çatı kullanımı",
        "Farklı renk, ölçü ve yüzey seçenekleri",
        "İç ve dış mekân için korozyon dayanımı",
      ],
      uses: ["Tabela", "Reklam panoları", "Dekoratif çatı"],
      search: "stor sac tabela reklam dekoratif",
    },
    {
      id: "rulo-sac",
      name: "Rulo Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli", "rulo"],
      image: "assets/images/products/rulo-dilme.webp",
      short: "Sanayi ve üretim hatları için işlenebilir rulo sac.",
      description:
        "Rulo sac, sanayi ve üretim sektöründe esnekliği ve işlenebilirliği ile öne çıkan bir çelik malzemedir. Özlü Metal, çeşitli kalınlık ve genişlik seçeneklerinde rulo sac sunar; ihtiyaca göre kesim ve dilimleme hizmetleriyle projeleri destekler. Yüksek mukavemet ve uzun ömürlü yapısıyla endüstriyel ve ticari uygulamalarda kullanılır.",
      features: [
        "Çeşitli kalınlık ve genişlik seçenekleri",
        "Kesim ve dilimleme hizmeti",
        "Yüksek mukavemet",
        "Endüstriyel üretime uygun işlenebilirlik",
      ],
      uses: ["Endüstriyel üretim", "Ticari uygulamalar", "Sac işleme hatları"],
      search: "rulo sac bobin kesim dilimleme",
    },
    {
      id: "oluklu-sac",
      name: "Oluklu Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli", "oluk"],
      image: "assets/images/products/oluklu-sac.webp",
      short: "Çatı, cephe ve hafif konstrüksiyon için oluklu sac.",
      description:
        "Oluklu sac, çatı kaplamaları, cephe uygulamaları ve hafif konstrüksiyon projelerinde kullanılan bir malzemedir. Özlü Metal, farklı ölçü ve kalınlıklarda oluklu sac sunar. Yüksek mukavemet ve uzun ömürlü yapısı ile her mevsim kullanılabilir.",
      features: [
        "Çatı ve cephe uygulamaları",
        "Hafif konstrüksiyon uyumu",
        "Farklı ölçü ve kalınlık",
        "Yüksek mukavemet",
      ],
      uses: ["Çatı kaplama", "Cephe", "Hafif konstrüksiyon"],
      search: "oluklu sac çatı cephe",
    },
    {
      id: "galvanizli-duz-sac",
      name: "Galvanizli Düz Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli"],
      image: "assets/images/products/galvaniz-duz-levha.webp",
      short: "0,30 mm – 3,00 mm kalınlık aralığında galvanizli düz sac.",
      description:
        "Galvanizli düz sac, çatı, cephe ve endüstriyel uygulamalarda güvenilir bir çözüm sunar. Özlü Metal, 0,30 mm ile 3,00 mm arasında değişen kalınlıklarda galvanizli düz sac seçenekleri sağlar. Korozyona karşı dayanıklı ve uzun ömürlü yapısıyla iç ve dış mekân uygulamalarında kullanılabilir.",
      features: [
        "0,30 mm – 3,00 mm kalınlık aralığı",
        "Çatı, cephe ve endüstriyel kullanım",
        "Korozyona karşı dayanım",
        "İç ve dış mekân uygulamaları",
      ],
      uses: ["Çatı", "Cephe", "Endüstriyel üretim"],
      search: "galvanizli düz sac levha 0.30 3.00",
    },
    {
      id: "galvanizli-trapez-mahya",
      name: "Galvanizli Trapez Mahya",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli", "trapez"],
      image: "assets/images/products/galvaniz-trapez-mahya.webp",
      short: "Çatı birleşim noktalarında sızdırmazlık sağlayan trapez mahya.",
      description:
        "Galvanizli trapez mahya, çatı birleşim noktalarında sızdırmazlık ve estetik çözüm sağlayan dayanıklı bir çelik malzemedir. Özlü Metal, farklı ebat ve kalınlıklarda galvanizli trapez mahya sunar. Korozyona dayanıklı ve mukavemetli yapısıyla çatı projelerinde tamamlayıcı çözümdür.",
      features: [
        "Çatı birleşim noktalarında sızdırmazlık",
        "Farklı ebat ve kalınlık",
        "Korozyona dayanım",
        "Estetik tamamlayıcı çözüm",
      ],
      uses: ["Çatı mahyası", "Trapez sac birleşimleri"],
      search: "galvanizli trapez mahya çatı",
    },
    {
      id: "galvanizli-oluklu-mahya",
      name: "Galvanizli Oluklu Mahya",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli", "oluk"],
      image: "assets/images/products/galvaniz-oluklu-mahya.webp",
      short: "Sabit ölçüde galvanizli oluklu mahya.",
      description:
        "Galvanizli oluklu mahya, çatı birleşim noktalarında sızdırmazlık ve dayanıklılık sağlayan özel bir çelik malzemedir. Özlü Metal, sabit ölçüde galvanizli oluklu mahya sunar. Korozyona dayanıklı ve uzun ömürlü yapısıyla çatıları hava koşullarına karşı korur.",
      features: [
        "Sabit ölçü",
        "Çatı birleşimlerinde sızdırmazlık",
        "Korozyona dayanım",
        "Hava koşullarına karşı koruma",
      ],
      uses: ["Oluklu sac çatı birleşimleri"],
      search: "galvanizli oluklu mahya",
    },
    {
      id: "galvanizli-dilimlenmis-rulo",
      name: "Galvanizli Dilimlenmiş Rulo Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli", "rulo"],
      image: "assets/images/products/galvaniz-dilimlenmis-rulo.webp",
      short: "İşlemeye hazır, önceden dilimlenmiş galvanizli rulo sac.",
      description:
        "Galvanizli dilimlenmiş rulo sac, endüstriyel üretim süreçlerinde hız ve kolaylık sağlayan bir malzemedir. Önceden dilimlenmiş yapısıyla işlemeye ve şekillendirmeye hazır sunulur. Yüksek korozyon direnci ve dayanıklılığı sayesinde üretim hatlarında kesintisiz kullanım sağlar.",
      features: [
        "Önceden dilimlenmiş, işlemeye hazır",
        "Zaman ve işçilik tasarrufu",
        "Yüksek korozyon direnci",
        "Üretim hatlarına uygun",
      ],
      uses: ["Endüstriyel üretim", "Şekil verme ve işleme"],
      search: "galvanizli dilimlenmiş rulo sac dilme",
    },
    {
      id: "galvaniz-kenar-mahya",
      name: "Galvaniz Kenar Mahya",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli"],
      image: "assets/images/products/galvaniz-kenar-mahya.webp",
      short: "Çatı kenarlarında suya karşı koruma ve bütünlük sağlayan mahya.",
      description:
        "Galvaniz kenar mahya, boyalı ve boyasız türlerde üretilen ve çatı kaplamada kullanılan bir malzemedir. Galvaniz saçtan üretilir; montaj ve taşıma açısından kolaylık sunar. İstenilen ebat ve formda üretilebilir. Paslanmaz yapısı ve korozyona dayanımıyla uzun süreli kullanım sağlar. Hafiftir, çatıya ekstra yük bindirmez ve pratik uygulanır. Çatı birleşimlerinde bütünlük sağlar, su alma riski bulunan bölgelerde koruma verir. Panel çatı kaplaması, alt maya elemanı ve taşıyıcı konstrüksiyon olarak da kullanılabilir.",
      features: [
        "Boyalı ve boyasız seçenekler",
        "İstenilen ebat ve formda üretim",
        "Hafif ve pratik montaj",
        "Su sızmasına karşı kenar koruması",
        "Panel çatı, alt maya ve taşıyıcı konstrüksiyon kullanımı",
      ],
      uses: ["Çatı kenarı", "Panel çatı kaplaması", "Taşıyıcı konstrüksiyon"],
      search: "galvaniz kenar mahya çatı su",
    },
    {
      id: "boyali-trapez-sac",
      name: "Boyalı Trapez Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali", "trapez"],
      image: "assets/images/products/boyali-trapez.webp",
      short: "Çatı ve dış cephe için renk seçenekli boyalı trapez sac.",
      description:
        "Boyalı trapez sac, kaliteli çelikten üretilen ve çatı ile dış cephe kaplamalarında tercih edilen bir kaplama malzemesidir. Farklı renk çeşitliliği ile estetik ihtiyaçları karşılar. Tek katlı yapılarda kolay montaj avantajı sunar. Hafif, esnek ve nem, yağmur, don ile güneşe karşı dayanıklıdır. Farklı boyut ve ebatlarda üretilir; siparişe uygun ebatlandırılabilir. Hangar ve depo alanlarında da kullanılır.",
      features: [
        "Farklı renk seçenekleri",
        "Hafif ve kolay montaj",
        "Esnek form, alana uygun şekillendirme",
        "Nem, yağmur, don ve güneşe dayanım",
        "Siparişe uygun ebatlandırma",
      ],
      uses: ["Çatı kaplama", "Dış cephe", "Hangar ve depo"],
      search: "boyalı trapez sac çatı cephe renk",
    },
    {
      id: "boyali-duz-sac",
      name: "Boyalı Düz Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali"],
      image: "assets/images/products/boyali-duz-sac.webp",
      short: "0,40 mm – 1,00 mm, koruyucu jelatin ile boyalı düz sac.",
      description:
        "Boyalı düz sac, endüstriyel ve çatı/cephe uygulamalarında hem estetik hem dayanıklı bir çözümdür. Özlü Metal ürünleri 0,40 mm – 1,00 mm kalınlık aralığında ve koruyucu jelatin ile paketlenmiş olarak teslim edilir. Böylece boya yüzeyi, son kullanıcıya ulaşana kadar korunur.",
      features: [
        "0,40 mm – 1,00 mm kalınlık aralığı",
        "Koruyucu jelatin ambalaj",
        "Çatı, cephe ve endüstriyel kullanım",
        "Boya yüzeyinin sevkiyatta korunması",
      ],
      uses: ["Çatı ve cephe", "Endüstriyel uygulamalar"],
      search: "boyalı düz sac jelatin 0.40 1.00",
    },
    {
      id: "boyali-stor-sac",
      name: "Boyalı Stor Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali"],
      image: "assets/images/products/boyali-stor.webp",
      short: "Tabela, pano ve dekoratif uygulamalar için boyalı stor sac.",
      description:
        "Boyalı stor sac, tabela, reklam panoları ve dekoratif çatı uygulamalarında görsellik ile dayanımı bir arada sunar. Özlü Metal, farklı renk, ölçü ve yüzey seçenekleriyle stor sac temin eder. Korozyona dayanıklı yapısı iç ve dış mekân kullanımlarına uygundur.",
      features: [
        "Tabela ve dekoratif uygulamalar",
        "Farklı renk ve ölçü seçenekleri",
        "İç ve dış mekân kullanımı",
        "Korozyona dayanım",
      ],
      uses: ["Tabela", "Reklam panosu", "Dekoratif çatı"],
      search: "boyalı stor sac tabela",
    },
    {
      id: "boyali-rulo-sac",
      name: "Boyalı Rulo Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali", "rulo"],
      image: "assets/images/products/boyali-rulo.webp",
      short: "Üretim hatlarına uyumlu, işlemeye hazır boyalı rulo sac.",
      description:
        "Boyalı rulo sac, endüstriyel projelerde işlemeye hazır ve estetik bir çözüm sunar. Üretim hatlarına uyum sağlayacak şekilde tasarlanmış, dayanıklı ve uzun ömürlü bir malzemedir.",
      features: [
        "İşlemeye hazır rulo form",
        "Üretim hatlarına uyum",
        "Estetik boyalı yüzey",
        "Uzun ömürlü kullanım",
      ],
      uses: ["Endüstriyel üretim", "Şekil verme hatları"],
      search: "boyalı rulo sac bobin",
    },
    {
      id: "boyali-oluklu-sac",
      name: "Boyalı Oluklu Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali", "oluk"],
      image: "assets/images/products/boyali-oluklu.webp",
      short: "Çatı ve cephede renkli, hafif ve dayanıklı oluklu sac.",
      description:
        "Boyalı oluklu sac, çatı ve cephelerde estetiği ön plana çıkarırken uzun ömürlü boyası ile kullanılır. Renk seçenekleri ve dayanıklılığıyla yapılara hem güvenlik hem görünüm kazandırır.",
      features: [
        "Çatı ve cephe estetiği",
        "Renk seçenekleri",
        "Hafif yapı",
        "Uzun ömürlü boya yüzeyi",
      ],
      uses: ["Çatı kaplama", "Cephe kaplama"],
      search: "boyalı oluklu sac çatı",
    },
    {
      id: "boyali-trapez-mahya",
      name: "Boyalı Trapez Mahya",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali", "trapez"],
      image: "assets/images/products/boyali-mahya.webp",
      short: "Renk uyumlu, sızdırmaz boyalı trapez mahya.",
      description:
        "Boyalı trapez mahya, çatı birleşim noktalarını kaplar ve estetik bir dokunuş katar. Projelere uyum sağlayacak renk seçenekleriyle uzun ömürlü görünüm sunar. Dayanıklı boyası sayesinde mahya hem sızdırmazlık sağlar hem de hava koşullarına karşı direnç gösterir.",
      features: [
        "Renk seçenekleri",
        "Sızdırmazlık",
        "Çatı birleşim noktaları",
        "Hava koşullarına direnç",
      ],
      uses: ["Boyalı trapez çatı mahyası"],
      search: "boyalı trapez mahya",
    },
    {
      id: "boyali-oluklu-mahya",
      name: "Boyalı Oluklu Mahya",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali", "oluk"],
      image: "assets/images/products/boyali-mahya.webp",
      short: "Sabit ölçülü, dayanıklı boyalı oluklu mahya.",
      description:
        "Boyalı oluklu mahya, çatı birleşim noktalarında güvenlik ve estetik sağlar. Sabit ölçüsü ve dayanıklı boyası sayesinde çatıya uzun ömürlü bir görünüm kazandırır. Zamana ve hava koşullarına karşı dirençli bir çözümdür.",
      features: [
        "Sabit ölçü",
        "Dayanıklı boya",
        "Çatı birleşim güvenliği",
        "Hava koşullarına direnç",
      ],
      uses: ["Boyalı oluklu çatı mahyası"],
      search: "boyalı oluklu mahya",
    },
    {
      id: "boyali-dilimlenmis-rulo",
      name: "Boyalı Dilimlenmiş Rulo Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali", "rulo"],
      image: "assets/images/products/boyali-dilimlenmis-rulo.webp",
      short: "Önceden dilimlenmiş, işlemeye hazır boyalı rulo sac.",
      description:
        "Boyalı dilimlenmiş rulo sac, endüstriyel üretim süreçlerinde hız ve estetiği bir araya getirir. Önceden dilimlenmiş yapısı ile işlemeye ve şekillendirmeye hazırdır; üretim hatlarında zaman ve işçilik tasarrufu sağlar. Dayanıklı boyası uzun ömürlü görünüm sunar.",
      features: [
        "Önceden dilimlenmiş form",
        "İşlemeye hazır",
        "Zaman ve işçilik tasarrufu",
        "Dayanıklı boyalı yüzey",
      ],
      uses: ["Endüstriyel üretim hatları"],
      search: "boyalı dilimlenmiş rulo sac",
    },
    {
      id: "beton-alti-trapez-sac",
      name: "Beton Altı Trapez Sac",
      category: "beton",
      categoryLabel: "Beton Altı Trapez Sac",
      filters: ["trapez"],
      image: "assets/images/products/beton-alti-trapez.webp",
      short: "Kompozit yapılarda kalıcı kalıp görevi gören trapez sac.",
      description:
        "Beton altı trapez sac, tekrar kalıp yapılmasına gerek bırakmayan zemin kalıplarıdır. Özellikle kompozit yapılarda çelik ve beton arasında bütünlük sağlamak için tercih edilir. Tek başına kalıp görevi görür; yapının daha dayanıklı olmasına katkı sağlar. 0,70 mm ile 3,00 mm arasında değişen kalınlıklarda üretilir. İstenilen ebatlarda üretilebilir ve daha az beton kullanımına yardımcı olur.",
      features: [
        "Kalıcı kalıp görevi — tekrar kalıp gerektirmez",
        "Kompozit yapılarda çelik-beton bütünlüğü",
        "0,70 mm – 3,00 mm kalınlık aralığı",
        "İstenilen ebatlarda üretim",
        "Daha az beton kullanımı",
        "Yangına karşı uzun süreli dayanım",
        "Hafif yapı, pratik montaj",
        "Kesilerek işlenebilir form",
        "Yapılara gerilme kuvveti kazandırma",
      ],
      uses: ["Kompozit döşeme", "Zemin kalıbı", "Çelik yapılarda beton altı uygulama"],
      search: "beton altı trapez sac kalıp kompozit 0.70 3.00",
    },
    {
      id: "aldeck-50-980",
      name: "50/980 Form Beton Altı Trapez",
      category: "beton",
      categoryLabel: "Beton Altı Trapez Sac",
      filters: ["trapez"],
      image: "assets/images/products/beton-alti-doseme.webp",
      short: "50 mm yükseklik, 980 mm kaplama genişliği ile betonaltı trapez.",
      description:
        "50/980 betonaltı trapez sac, inşaat sektöründe özellikle betonarme çatı ve döşeme sistemlerinde kullanılan özel bir çelik sac türüdür. Üzerine beton dökülerek dayanıklı zemin veya çatı plakaları oluşturulmasını sağlar. 50 mm trapez yüksekliği ve 980 mm kaplama genişliği ile yüksek taşıma kapasitesi sunar. Yük taşıma kapasitesini artırır ve inşaat sürecini hızlandırır.",
      features: [
        "50 mm trapez yüksekliği",
        "980 mm kaplama genişliği",
        "Betonarme çatı ve döşeme sistemleri",
        "Yüksek taşıma kapasitesi",
        "İnşaat sürecini hızlandıran uygulama",
      ],
      uses: ["Betonarme döşeme", "Çatı plakaları", "Kompozit döşeme sistemleri"],
      search: "50/980 form aldeck beton altı trapez 50 mm 980 mm",
    },
    {
      id: "eksiz-oluk-sistemleri",
      name: "Eksiz Oluk Sistemleri",
      category: "oluk",
      categoryLabel: "Eksiz Oluk Sistemleri",
      filters: ["oluk"],
      image: "assets/images/products/eksiz-oluk.webp",
      short: "Tek parça, dayanıklı ve farklı renk seçenekli eksiz oluk.",
      description:
        "Eksiz oluk sistemleri, çatı uygulamalarında estetik bir görünüm sunar. Dayanıklı ve uzun süreli kullanıma sahiptir; farklı renk ve model çeşitliliği bulunur. Yağmur, dolu, kar ve güneş ışınlarına karşı dirençlidir. Pratik monte edilir ve yağmur ile kar suyunun tahliyesini sağlar. Köşeden köşeye tek parça uygulanabilir. Ev, apartman, fabrika, cami, hastane, restoran, kafe ve alışveriş merkezlerinde kullanılabilir.",
      features: [
        "Köşeden köşeye tek parça uygulama",
        "Yağmur, dolu, kar ve güneşe direnç",
        "Paslanmaz kullanım",
        "Farklı renk ve model seçenekleri",
        "Kolay montaj, kısa işçilik süresi",
        "Estetik büküm alternatifleri",
      ],
      uses: ["Konut çatıları", "Ticari ve endüstriyel yapılar", "Yağmur suyu tahliyesi"],
      search: "eksiz oluk sistemleri çatı yağmur",
    },
    {
      id: "dilimlenmis-rulo",
      name: "Dilimlenmiş Rulo",
      category: "oluk",
      categoryLabel: "Eksiz Oluk Sistemleri",
      filters: ["rulo", "oluk"],
      image: "assets/images/products/boyali-dilimlenmis-rulo.webp",
      short: "Eksiz oluk uygulaması için boyalı veya galvanizli rulo sac.",
      description:
        "Eksiz oluk rulo sac, çatılarda eksiz oluk sistemlerini kuran uygulayıcılar için tasarlanmıştır. Boyalı veya galvanizli çelik yapısıyla işlemeye hazır ve uzun ömürlüdür. Özlü Metal, farklı kalınlık ve renk seçeneklerinde eksiz oluk rulo sac sunar. Su sızdırmazlığı ve uzun ömür isteyen uygulamalar için uygundur.",
      features: [
        "Boyalı veya galvanizli seçenek",
        "Eksiz oluk uygulamasına özel",
        "Farklı kalınlık ve renk",
        "İşlemeye hazır rulo form",
      ],
      uses: ["Eksiz oluk imalatı", "Çatı su tahliye sistemleri"],
      search: "dilimlenmiş rulo eksiz oluk",
    },
    {
      id: "antipasli-profil",
      name: "Antipaslı Profil",
      category: "profil",
      categoryLabel: "Profil",
      filters: ["diger"],
      image: "assets/images/products/antipasli-profil.webp",
      short: "Çatı konstrüksiyonları için paslanmaya karşı antipaslı profil.",
      description:
        "Antipaslı profil, çatılarda güven ve dayanıklılık arayan uygulayıcılar için bir çözümdür. Paslanmaya karşı geliştirilmiş yapısıyla uzun ömürlü ve sağlam bir çatı çözümü sunar; zorlu hava koşullarına karşı koruma sağlar. Özlü Metal, farklı ölçü ve kalınlıklarda antipaslı profil temin eder.",
      features: [
        "Paslanmaya karşı geliştirilmiş yapı",
        "Farklı ölçü ve kalınlık",
        "Çatı konstrüksiyonu kullanımı",
        "Zorlu hava koşullarına karşı koruma",
      ],
      uses: ["Çatı konstrüksiyonu", "Metal profil uygulamaları"],
      search: "antipaslı profil çatı metal profil",
    },
    {
      id: "trapez-alti-strafor",
      name: "Trapez Altı Strafor",
      category: "strafor",
      categoryLabel: "Strafor",
      filters: ["diger", "trapez"],
      image: "assets/images/products/galvaniz-trapez.webp",
      short: "Çatı altında ısı ve ses yalıtımı sağlayan strafor panel.",
      description:
        "Trapez altı strafor, çatılarda hem ısı hem ses yalıtımı sağlayan bir malzemedir. Çatı altına yerleştirilen paneller ısı kaybını azaltır, enerji tasarrufu sağlar ve gürültüyü düşürür. Özlü Metal, farklı kalınlıklarda trapez altı strafor sunar.",
      features: [
        "Isı yalıtımı",
        "Ses yalıtımı",
        "Farklı kalınlık seçenekleri",
        "Trapez sac altı uygulama",
      ],
      uses: ["Çatı yalıtımı", "Trapez altı uygulamalar"],
      search: "trapez altı strafor yalıtım",
    },
    {
      id: "vida",
      name: "Vida",
      category: "baglanti",
      categoryLabel: "Bağlantı Elemanları",
      filters: ["diger"],
      image: "assets/images/products/vida.webp",
      short: "Profil ve ahşap uygulamaları için vida çeşitleri.",
      description:
        "Vida, profil ve ahşap uygulamalarında güvenli bağlantı sağlayan çok yönlü bir çelik üründür. Profil vidaları çelik profillerin montajında; ahşap vidaları ahşap yapılarda kullanılır. Özlü Metal, farklı uzunluk ve tiplerde vida çeşitleri sunar.",
      features: [
        "Profil vidaları",
        "Ahşap vidaları",
        "Farklı uzunluk ve tip",
        "Çatı ve konstrüksiyon montajı",
      ],
      uses: ["Profil montajı", "Ahşap uygulamalar", "Çatı bağlantısı"],
      search: "vida profil ahşap bağlantı elemanları",
    },
    {
      id: "semer",
      name: "Semer",
      category: "baglanti",
      categoryLabel: "Bağlantı Elemanları",
      filters: ["diger"],
      image: "assets/images/products/semer.webp",
      short: "Trapez sac ve panel montajı için boyalı veya boyasız semer.",
      description:
        "Semer, trapez sac ve panel montajlarında güvenli ve dayanıklı bağlantı sağlar. Boyalı veya boyasız seçenekleri ile hem estetik hem sağlam montaj imkânı sunar. Çatılarda ve panel uygulamalarında yük taşıma ve uzun ömür arayan uygulamalar için kullanılır.",
      features: [
        "Trapez sac ve panel montajı",
        "Boyalı veya boyasız seçenek",
        "Güvenli bağlantı",
        "Çatı ve panel uygulamaları",
      ],
      uses: ["Trapez montajı", "Panel çatı"],
      search: "semer trapez panel bağlantı",
    },
    {
      id: "galvanizli-sac",
      name: "Galvanizli Sac",
      category: "galvanizli",
      categoryLabel: "Galvanizli Sac",
      filters: ["galvanizli"],
      image: "assets/images/products/galvanizli-sac.webp",
      short: "Galvaniz rulo, levha ve sac ihtiyaçları için ürün grubu.",
      description:
        "Özlü Metal, galvaniz rulo, levha, sac ve benzeri galvaniz malzemelerin temininde hizmet verir. Standart ve özel kalıplardan oluşan galvanizli saç ürünleri toptan ve perakende sunulur. Her ölçüde kalıp ayarlanabilir. Galvanizli sac, yassı sert çelik materyalin her iki yüzüne metalik kaplama uygulanmasıyla üretilir. Kullanım alanları arasında akaryakıt depo üretimi, beyaz eşya, profil üretimi, otomobil sektörü, kaplama işlemleri, iklimlendirme ve havalandırma tesisleri ile soba ve boru üretimi yer alır. Sıcak daldırma galvaniz kaplama, bulunduğu ortama göre uzun ömürlüdür ve kolay temizlenebilir.",
      features: [
        "Rulo, levha ve sac formları",
        "Standart ve özel kalıp",
        "Toptan ve perakende temin",
        "Beyaz eşya, otomotiv, iklimlendirme ve profil üretiminde kullanım",
      ],
      uses: ["Beyaz eşya", "Otomotiv", "Profil üretimi", "İklimlendirme"],
      search: "galvanizli sac rulo levha",
    },
    {
      id: "boyali-sac",
      name: "Boyalı Sac",
      category: "boyali",
      categoryLabel: "Boyalı Sac",
      filters: ["boyali"],
      image: "assets/images/products/boyali-sac.webp",
      short: "Galvaniz üzerine polyester boyalı sac çeşitleri.",
      description:
        "Boyalı sac, dayanıklı yapısının yanında estetik görünüm sunar. Soğuk haddeleme ile sac haline getirilir; galvanizle kaplanan malzeme polyester boyalar ile renklendirilir. Kar, rüzgâr, dolu, yağmur ve güneşe karşı dayanıklıdır. Farklı renk seçenekleri bulunur, montajda şekillenmesi kolaydır ve hafiftir. Çatı kaplaması, beyaz eşya, otomotiv ve elektronik sektöründe kullanılır.",
      features: [
        "Galvaniz üzerine polyester boya",
        "Farklı renk seçenekleri",
        "Hava koşullarına dayanım",
        "Hafif ve şekillendirilebilir yapı",
      ],
      uses: ["Çatı kaplaması", "Beyaz eşya", "Otomotiv", "Elektronik"],
      search: "boyalı sac polyester renk çatı",
    },
    {
      id: "baglanti-elemanlari",
      name: "Bağlantı Elemanları",
      category: "baglanti",
      categoryLabel: "Bağlantı Elemanları",
      filters: ["diger"],
      image: "assets/images/products/vida.webp",
      short: "Vida, semer ve montaj tamamlayıcıları.",
      description:
        "Bağlantı elemanları, ürünlerin ve parçaların birleştirilmesi için gerekli malzemelerdir. Cıvata, vida, somun ve rod gibi parçalardan oluşur. Çözülemeyen (lehim, kaynak, perçin) ve çözülebilen (vida, cıvata, pim, gijon) gruplara ayrılır. Çatı ve döşeme makas askıları, kiriş, panel ve metal bağlantı elemanları sık kullanılan ürünlerdendir. Ahşap, sac, metal veya kiremit gibi farklı yapılar için uygun tip seçilmelidir. Çatı kaplamalarında su geçirmez ve yüksek direnç özellikleri aranır.",
      features: [
        "Vida ve semer başta olmak üzere montaj ürünleri",
        "Çözülebilen ve çözülemeyen bağlantı türleri",
        "Çatı, panel ve metal uygulamaları",
        "Malzeme tipine göre seçim",
      ],
      uses: ["Çatı montajı", "Panel birleştirme", "Metal konstrüksiyon"],
      search: "bağlantı elemanları vida semer cıvata",
    },
  ];

  const SERVICES = [
    {
      id: "sac-kesim",
      name: "Sac Kesim",
      text: "Projenize özel ölçülerde hassas sac kesim. Kesme hattında 1,50–16,00 mm kalınlık ve 200–2000 mm genişlik aralığında üretim yapılır.",
      image: "assets/images/services/sac-kesim.webp",
    },
    {
      id: "sac-bukum",
      name: "Sac Büküm",
      text: "Çatı, cephe ve imalat parçaları için ölçüye uygun sac büküm çözümleri.",
      image: "assets/images/services/sac-bukum.webp",
    },
    {
      id: "rulo-boy-kesme",
      name: "Rulo Boy Kesme",
      text: "Rulo sacın istenen boyda levhaya dönüştürülmesi. Kesme hattında levha boyu en fazla 14.000 mm’ye kadar çıkar.",
      image: "assets/images/services/rulo-boy-kesme.webp",
    },
    {
      id: "rulo-dilme",
      name: "Rulo Dilme",
      text: "Dar şerit rulo üretimi. Dilme hattında 1,50–6,00 mm kalınlık ve 20–1600 mm genişlik aralığında dilimleme yapılır.",
      image: "assets/images/services/rulo-dilme.webp",
    },
    {
      id: "stor",
      name: "Stor",
      text: "Tabela, pano ve dekoratif uygulamalar için stor sac işleme.",
      image: "assets/images/services/stor.webp",
    },
    {
      id: "trapezleme",
      name: "Trapezleme",
      text: "Çatı, cephe ve beton altı uygulamaları için trapez form verme.",
      image: "assets/images/services/trapezleme.webp",
    },
  ];

  const FINDER = {
    "cati-kaplama": ["trapez-sac", "boyali-trapez-sac", "oluklu-sac", "boyali-oluklu-sac", "galvanizli-trapez-mahya", "galvaniz-kenar-mahya"],
    "cephe-kaplama": ["trapez-sac", "boyali-trapez-sac", "oluklu-sac", "boyali-oluklu-sac", "boyali-duz-sac"],
    "endustriyel": ["rulo-sac", "galvanizli-dilimlenmis-rulo", "boyali-rulo-sac", "galvanizli-duz-sac", "galvanizli-sac"],
    "beton-alti": ["beton-alti-trapez-sac", "aldeck-50-980"],
    "oluk-sistemi": ["eksiz-oluk-sistemleri", "dilimlenmis-rulo", "oluklu-sac"],
    "metal-profil": ["antipasli-profil"],
    "baglanti": ["vida", "semer", "baglanti-elemanlari"],
  };

  window.Ozlu = { PRODUCTS, CATEGORIES, SERVICES, FINDER, PHONE, WHATSAPP, EMAIL };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function asset(path) {
    if (!path) return path;
    const inSub = document.body.getAttribute("data-root") === "sub";
    if (path.startsWith("assets/") && inSub) return "../" + path;
    return path;
  }

  function toast(msg) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    setTimeout(() => el.classList.remove("is-on"), 3200);
  }

  function lockScroll(on) {
    document.body.classList.toggle("no-scroll", on);
  }

  function trapFocus(container) {
    const nodes = $$("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])", container)
      .filter((n) => !n.hasAttribute("disabled") && n.offsetParent !== null);
    if (!nodes.length) return () => {};
    nodes[0].focus();
    function onKey(e) {
      if (e.key !== "Tab") return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", onKey);
    return () => container.removeEventListener("keydown", onKey);
  }

  let releaseTrap = null;

  function openOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    lockScroll(true);
    releaseTrap = trapFocus(el);
  }

  function closeOverlay(id) {
    const el = id ? document.getElementById(id) : null;
    const list = el ? [el] : $$(".overlay.is-open, .search-overlay.is-open, .drawer.is-open, .drawer-backdrop.is-open");
    list.forEach((node) => {
      node.classList.remove("is-open");
      node.setAttribute("aria-hidden", "true");
    });
    if (!id) {
      const drawer = $("#mobile-drawer");
      const backdrop = $("#drawer-backdrop");
      const toggle = $("#menu-toggle");
      drawer && drawer.classList.remove("is-open");
      backdrop && backdrop.classList.remove("is-open");
      toggle && toggle.setAttribute("aria-expanded", "false");
    }
    if (!$(".overlay.is-open") && !$(".search-overlay.is-open") && !$(".drawer.is-open")) {
      lockScroll(false);
      if (releaseTrap) releaseTrap();
    }
  }

  function headerScroll() {
    const header = $(".site-header");
    if (!header) return;
    const on = window.scrollY > 12;
    header.classList.toggle("is-scrolled", on);
  }

  function bindHeader() {
    headerScroll();
    window.addEventListener("scroll", headerScroll, { passive: true });

    const toggle = $(".menu-toggle");
    const drawer = $(".mobile-drawer");
    const backdrop = $(".drawer-backdrop");
    if (toggle && drawer) {
      toggle.addEventListener("click", () => {
        const open = !drawer.classList.contains("is-open");
        drawer.classList.toggle("is-open", open);
        backdrop && backdrop.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        lockScroll(open);
      });
    }
    backdrop && backdrop.addEventListener("click", () => closeOverlay());
    $$("[data-close-drawer]").forEach((b) => b.addEventListener("click", () => closeOverlay()));

    $$(".drawer-acc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const acc = btn.closest(".drawer-acc");
        const open = !acc.classList.contains("open");
        $$(".drawer-acc").forEach((a) => a.classList.remove("open"));
        acc.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });

    $$("[data-open-search]").forEach((b) =>
      b.addEventListener("click", () => {
        openOverlay("search-overlay");
        const input = $("#search-input");
        if (input) setTimeout(() => input.focus(), 50);
      })
    );
    $$("[data-open-quote]").forEach((b) =>
      b.addEventListener("click", (e) => {
        const product = b.getAttribute("data-product");
        if (product) {
          const sel = $("#quote-product");
          if (sel) sel.value = product;
        }
        openOverlay("quote-overlay");
      })
    );
    $$("[data-close-overlay]").forEach((b) =>
      b.addEventListener("click", () => closeOverlay(b.getAttribute("data-close-overlay")))
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOverlay();
    });
  }

  function bindMega() {
    const cats = $$(".mega-cat");
    if (!cats.length) return;
    function show(id) {
      cats.forEach((c) => c.classList.toggle("is-active", c.dataset.cat === id));
      const cat = CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
      const items = PRODUCTS.filter((p) => p.category === id && !["galvanizli-sac", "boyali-sac", "baglanti-elemanlari"].includes(p.id));
      const list = $("#mega-products");
      const aside = $("#mega-aside");
      if (list) {
        list.innerHTML = items
          .map(
            (p) =>
              `<a href="product-detail.html?id=${p.id}">${p.name}<svg data-lucide="arrow-up-right"></svg></a>`
          )
          .join("");
      }
      if (aside) {
        aside.innerHTML = `<img src="${cat.image}" alt="${cat.name}" width="560" height="420"><div class="mega-copy"><h3>${cat.name}</h3><p>${cat.text}</p></div>`;
      }
      if (window.lucide) lucide.createIcons();
    }
    cats.forEach((c) => {
      c.addEventListener("mouseenter", () => show(c.dataset.cat));
      c.addEventListener("focus", () => show(c.dataset.cat));
      c.addEventListener("click", () => show(c.dataset.cat));
    });
    show("galvanizli");
  }

  function bindSearch() {
    const input = $("#search-input");
    const results = $("#search-results");
    if (!input || !results) return;
    const extras = [
      { name: "Trapezleme", type: "Hizmet", href: "index.html#hizmetler" },
      { name: "Sac Kesim", type: "Hizmet", href: "index.html#hizmetler" },
      { name: "Rulo Dilme", type: "Hizmet", href: "index.html#hizmetler" },
      { name: "Rulo Boy Kesme", type: "Hizmet", href: "index.html#hizmetler" },
    ];
    function run() {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = `<p class="lead">Trapez, rulo, oluk, mahya veya hizmet adı yazın.</p>`;
        return;
      }
      const hits = PRODUCTS.filter((p) => (p.name + " " + p.search + " " + p.short).toLowerCase().includes(q))
        .slice(0, 8)
        .map((p) => ({ name: p.name, type: p.categoryLabel, href: `product-detail.html?id=${p.id}` }));
      extras.forEach((e) => {
        if (e.name.toLowerCase().includes(q)) hits.push(e);
      });
      results.innerHTML = hits.length
        ? hits.map((h) => `<a href="${h.href}">${h.name}<span>${h.type}</span></a>`).join("")
        : `<p class="lead">Sonuç bulunamadı. Teklif formundan ihtiyacınızı iletebilirsiniz.</p>`;
    }
    input.addEventListener("input", run);
    run();
  }

  function renderFeatured(filter) {
    const grid = $("#featured-grid");
    if (!grid) return;
    const featuredIds = [
      "trapez-sac",
      "galvanizli-duz-sac",
      "boyali-duz-sac",
      "rulo-sac",
      "boyali-rulo-sac",
      "oluklu-sac",
      "beton-alti-trapez-sac",
      "antipasli-profil",
      "vida",
      "semer",
    ];
    let list = featuredIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
    if (filter && filter !== "tumu") list = list.filter((p) => p.filters.includes(filter) || p.category === filter);
    grid.innerHTML = list
      .map(
        (p) => `<article class="product-card" data-id="${p.id}">
          <a class="product-media" href="product-detail.html?id=${p.id}">
            <span class="tag">${p.categoryLabel}</span>
            <img src="${p.image}" alt="${p.name}" width="872" height="600" loading="lazy">
          </a>
          <div class="product-body">
            <h3>${p.name}</h3>
            <p>${p.short}</p>
            <div class="product-actions">
              <a class="btn btn-ghost" href="product-detail.html?id=${p.id}">Ürünü İncele <svg data-lucide="arrow-right"></svg></a>
              <button class="btn btn-primary" type="button" data-open-quote data-product="${p.name}">Teklif Al</button>
            </div>
          </div>
        </article>`
      )
      .join("");
    if (window.lucide) lucide.createIcons();
    $$("[data-open-quote]", grid).forEach((b) =>
      b.addEventListener("click", () => {
        const sel = $("#quote-product");
        if (sel) sel.value = b.getAttribute("data-product");
        openOverlay("quote-overlay");
      })
    );
  }

  function bindFilters() {
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderFeatured(btn.dataset.filter);
      });
    });
  }

  function bindServices() {
    const rows = $$(".service-row");
    const stageImg = $("#service-stage-img");
    const stageCap = $("#service-stage-cap");
    if (!rows.length) return;
    function activate(row) {
      rows.forEach((r) => r.classList.remove("is-active"));
      row.classList.add("is-active");
      const svc = SERVICES.find((s) => s.id === row.dataset.service);
      if (svc && stageImg) {
        stageImg.src = svc.image;
        stageImg.alt = svc.name + " üretim görseli";
      }
      if (svc && stageCap) stageCap.textContent = svc.name;
    }
    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => activate(row));
      row.addEventListener("focus", () => activate(row));
      row.addEventListener("click", () => activate(row));
    });
  }

  function bindFinder() {
    const opts = $$(".finder-opt");
    const box = $("#finder-results");
    if (!opts.length || !box) return;
    function show(key) {
      opts.forEach((o) => o.classList.toggle("is-active", o.dataset.need === key));
      const ids = FINDER[key] || [];
      const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
      box.innerHTML = `<div class="product-grid">${items
        .map(
          (p) => `<a class="product-card" href="product-detail.html?id=${p.id}">
            <div class="product-media"><img src="${p.image}" alt="${p.name}" width="872" height="600" loading="lazy"></div>
            <div class="product-body"><h3>${p.name}</h3><p>${p.short}</p></div>
          </a>`
        )
        .join("")}</div>`;
    }
    opts.forEach((o) => o.addEventListener("click", () => show(o.dataset.need)));
    show("cati-kaplama");
  }

  function bindValues() {
    $$(".value-acc button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const acc = btn.closest(".value-acc");
        const open = !acc.classList.contains("open");
        $$(".value-acc").forEach((a) => a.classList.remove("open"));
        acc.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function bindQuoteForm() {
    const form = $("#quote-form");
    if (!form) return;
    const sel = $("#quote-product");
    if (sel && !sel.options.length) {
      sel.innerHTML =
        `<option value="">Seçiniz</option>` +
        PRODUCTS.map((p) => `<option value="${p.name}">${p.name}</option>`).join("") +
        SERVICES.map((s) => `<option value="${s.name}">${s.name}</option>`).join("");
    }
    const fileInput = $("#quote-file");
    const fileName = $("#quote-file-name");
    if (fileInput && fileName) {
      fileInput.addEventListener("change", () => {
        fileName.textContent = fileInput.files[0] ? fileInput.files[0].name : "PDF, DWG, DXF, JPG veya PNG yükleyin";
      });
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      toast("Talebiniz başarıyla oluşturuldu.");
      form.reset();
      if (fileName) fileName.textContent = "PDF, DWG, DXF, JPG veya PNG yükleyin";
      closeOverlay("quote-overlay");
    });
  }

  function bindContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      toast("Mesajınız alındı. Ekibimiz sizinle iletişime geçecek.");
      form.reset();
    });
  }

  function renderProductPage() {
    const mount = $("#product-detail");
    if (!mount) return;
    const id = new URLSearchParams(location.search).get("id") || "trapez-sac";
    const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
    document.title = p.name + " | Özlü Metal";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", p.short);
    mount.innerHTML = `
      <div class="page-hero">
        <div class="container">
          <nav class="breadcrumb" aria-label="Sayfa yolu">
            <a href="index.html">Anasayfa</a><span>/</span>
            <a href="products.html">Ürünler</a><span>/</span>
            <span>${p.name}</span>
          </nav>
          <p class="eyebrow">${p.categoryLabel}</p>
          <h1 class="section-title" style="margin-top:12px">${p.name}</h1>
        </div>
      </div>
      <section class="section bg-main">
        <div class="container detail-grid">
          <div class="detail-gallery img-reveal">
            <img src="${p.image}" alt="${p.name}" width="872" height="600">
          </div>
          <div>
            <p class="lead">${p.description}</p>
            <h2 style="margin-top:28px;font-size:24px">Özellikler</h2>
            <div class="feature-grid">
              ${p.features.map((f) => `<div class="feature-item"><i data-lucide="check"></i><span>${f}</span></div>`).join("")}
            </div>
            <h2 style="margin-top:28px;font-size:24px">Kullanım alanları</h2>
            <p class="lead">${p.uses.join(" · ")}</p>
            <div class="hero-cta">
              <button class="btn btn-primary" type="button" data-open-quote data-product="${p.name}">Teklif İste <svg data-lucide="arrow-right"></svg></button>
              <a class="btn btn-ghost" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-white">
        <div class="container">
          <h2 class="section-title" style="font-size:clamp(28px,3vw,40px);margin-bottom:24px">İlgili ürünler</h2>
          <div class="related" id="related-grid"></div>
        </div>
      </section>`;
    const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
    const rel = $("#related-grid");
    if (rel) {
      rel.innerHTML = related
        .map(
          (r) => `<a class="product-card" href="product-detail.html?id=${r.id}">
            <div class="product-media"><img src="${r.image}" alt="${r.name}" width="872" height="600" loading="lazy"></div>
            <div class="product-body"><h3>${r.name}</h3><p>${r.short}</p></div>
          </a>`
        )
        .join("");
    }
    $$("[data-open-quote]", mount).forEach((b) =>
      b.addEventListener("click", () => {
        const sel = $("#quote-product");
        if (sel) sel.value = p.name;
        openOverlay("quote-overlay");
      })
    );
    if (window.lucide) lucide.createIcons();
  }

  function renderProductsPage() {
    const grid = $("#all-products");
    if (!grid) return;
    const order = ["galvanizli", "boyali", "beton", "oluk", "profil", "strafor", "baglanti"];
    const labels = {
      galvanizli: "Galvanizli Sac",
      boyali: "Boyalı Sac",
      beton: "Beton Altı Trapez Sac",
      oluk: "Eksiz Oluk Sistemleri",
      profil: "Profil",
      strafor: "Strafor",
      baglanti: "Bağlantı Elemanları",
    };
    grid.innerHTML = order
      .map((cat) => {
        const items = PRODUCTS.filter((p) => p.category === cat);
        const cards = items
          .map(
            (p) => `<article class="product-card">
          <a class="product-media" href="product-detail.html?id=${p.id}">
            <span class="tag">${p.categoryLabel}</span>
            <img src="${p.image}" alt="${p.name}" width="872" height="600" loading="lazy">
          </a>
          <div class="product-body">
            <h3>${p.name}</h3>
            <p>${p.short}</p>
            <div class="product-actions">
              <a class="btn btn-ghost" href="product-detail.html?id=${p.id}">Ürünü İncele</a>
              <button class="btn btn-primary" type="button" data-open-quote data-product="${p.name}">Teklif Al</button>
            </div>
          </div>
        </article>`
          )
          .join("");
        return `<div class="cat-block" id="${cat}" style="grid-column:1/-1"><h2 class="section-title" style="font-size:clamp(26px,3vw,40px);margin:12px 0 8px">${labels[cat]}</h2></div>${cards}`;
      })
      .join("");
    $$("[data-open-quote]", grid).forEach((b) =>
      b.addEventListener("click", () => {
        const sel = $("#quote-product");
        if (sel) sel.value = b.getAttribute("data-product");
        openOverlay("quote-overlay");
      })
    );
  }

  function bindTabs() {
    $$(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tab;
        $$(".tab-btn").forEach((b) => b.classList.remove("is-active"));
        $$(".tab-panel").forEach((p) => p.classList.remove("is-active"));
        btn.classList.add("is-active");
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("is-active");
      });
    });
  }

  function fillQuoteSelect() {
    const sel = $("#quote-product");
    if (!sel || sel.options.length > 1) return;
    sel.innerHTML =
      `<option value="">Seçiniz</option>` +
      PRODUCTS.map((p) => `<option value="${p.name}">${p.name}</option>`).join("") +
      `<optgroup label="Hizmetler">` +
      SERVICES.map((s) => `<option value="${s.name}">${s.name}</option>`).join("") +
      `</optgroup>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindHeader();
    bindMega();
    bindSearch();
    fillQuoteSelect();
    bindQuoteForm();
    bindContactForm();
    bindFilters();
    renderFeatured("tumu");
    bindServices();
    bindFinder();
    bindValues();
    bindTabs();
    renderProductPage();
    renderProductsPage();
    if (window.lucide) lucide.createIcons();
    const hash = (location.hash || "").replace("#", "");
    if (hash) {
      const map = { vizyon: "tab-vizyon", misyon: "tab-misyon", degerler: "tab-deger", deger: "tab-deger", hakkimizda: "tab-about" };
      const tabId = map[hash] || hash;
      const tabBtn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
      if (tabBtn) tabBtn.click();
    }
    if (window.lucide) lucide.createIcons();
    $$(".overlay").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el) closeOverlay(el.id);
      });
    });
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
    const schemaMount = $("#product-detail");
    if (schemaMount) {
      const id = new URLSearchParams(location.search).get("id") || "trapez-sac";
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.short,
          image: p.image,
          brand: { "@type": "Brand", name: "Özlü Metal" },
        });
        document.head.appendChild(s);
      }
    }
  });
})();
