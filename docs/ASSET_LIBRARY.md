# ArcForge Asset Library v1

This project now uses a data-driven artwork catalog.

## Source batch

- Source ZIP: `Image_20260622212428_43_83.zip`
- Original images: 18 high-resolution JPG files
- Optimized output: WebP gallery images and thumbnails

## Folder structure

```text
public/assets/images/
  arcforge-hero.webp
  manifest.json
  artworks/
    inferno-duel/
    orc-warband/
    crimson-sorceress/
    arcane-standard-bearer/
    ember-warlord/
    azure-paladin/
public/data/artworks.json
```

## Current artwork records

1. Inferno Duel / 熔火对决
2. Orc Warband / 兽人战队
3. Crimson Sorceress / 绯红术士
4. Arcane Standard Bearer / 秘法旗手
5. Ember Warlord / 余烬战王
6. Azure Paladin / 湛蓝圣骑士

## Data flow

- `/api/products` tries D1 first.
- If D1 is empty or not initialized, it returns the built-in seed artwork list.
- The browser also has a static fallback at `/data/artworks.json`.
- Uploaded media should continue to go to R2 through `/api/upload`.

## Naming convention

```text
<artwork-slug>-<view>.webp
<artwork-slug>-<view>-thumb.webp
```

Examples:

```text
inferno-duel-hero.webp
azure-paladin-white-hero.webp
orc-warband-front-line.webp
```
