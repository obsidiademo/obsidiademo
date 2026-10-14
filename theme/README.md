# EVORA — Premium housewares theme

Shopify Online Store 2.0 theme customized for a **premium home appliances / household goods** (“ev gereçleri”) storefront.

## Notes on source

The uploaded Discovery theme backup zip
(`___discovery_backup_20261014_134200*.zip`) was **not available** in this
environment. This package starts from [Shopify Dawn](https://github.com/Shopify/dawn)
(OS 2.0 architecture) and applies the EVORA housewares redesign.

If the original Discovery backup becomes available, merge these EVORA sections /
CSS / font wiring onto that theme’s skeletons.

## Design

- Brand: **EVORA**
- Primary UI font: **Quicksand** (Google Fonts + CSS variable override)
- Palette: porcelain mist, soft sage accent, steel neutrals (no purple / cream-terracotta / dark-default)
- Homepage: brand-first full-bleed hero → categories → material story → featured products
- Motions: hero rise-in copy, subtle ken-burns media, category image zoom

## Key files

| Path | Role |
|------|------|
| `layout/theme.liquid` | Quicksand + premium CSS wiring |
| `assets/housewares-premium.css` | Visual system + hero/category/story |
| `sections/housewares-hero.liquid` | Brand-first full-bleed hero |
| `sections/housewares-categories.liquid` | Category links |
| `sections/housewares-story.liquid` | Material story band |
| `templates/index.json` | Homepage composition |
| `config/settings_data.json` | EVORA color schemes |

## Static preview

A Liquid-free homepage mock for local demo lives at `../preview/index.html`.

```bash
cd preview && python3 -m http.server 4173
```

## Install on Shopify

Upload this `theme/` folder (or zip it) via **Online Store → Themes → Add theme → Upload**.
Then assign hero / category images in the theme editor.
