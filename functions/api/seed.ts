import { requireAdmin, json } from './auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
export const seedArtworks = [
  {
    id: 'af-001-inferno-duel', title: 'Inferno Duel', title_zh: '熔火对决', slug: 'inferno-duel', category: 'Fantasy Battle Diorama', price_cents: 0, currency: 'USD', status: 'published', inventory: 1, material: 'Hand-painted resin, scenic base, flame-effect finish', height_cm: null, description: 'A dramatic two-character battle scene staged across a cracked lava base, combining dynamic motion, armor detail, and theatrical contrast.', cover_media_key: '/assets/images/artworks/inferno-duel/inferno-duel-hero.webp', gallery: ['/assets/images/artworks/inferno-duel/inferno-duel-hero.webp','/assets/images/artworks/inferno-duel/inferno-duel-wide-angle.webp','/assets/images/artworks/inferno-duel/inferno-duel-front.webp','/assets/images/artworks/inferno-duel/inferno-duel-side.webp'], alt: 'Hand-painted fantasy battle diorama with lava base', created_at: '2026-06-27T00:00:00.000Z'
  },
  {
    id: 'af-002-orc-warband', title: 'Orc Warband', title_zh: '兽人战队', slug: 'orc-warband', category: 'Fantasy Miniature Group', price_cents: 0, currency: 'USD', status: 'published', inventory: 1, material: 'Hand-painted resin miniatures and textured scenic base', height_cm: null, description: 'A compact group composition featuring multiple warrior figures, layered weapons, banners, and terrain details for a tabletop display effect.', cover_media_key: '/assets/images/artworks/orc-warband/orc-warband-overview.webp', gallery: ['/assets/images/artworks/orc-warband/orc-warband-overview.webp','/assets/images/artworks/orc-warband/orc-warband-front-line.webp','/assets/images/artworks/orc-warband/orc-warband-battle-scene.webp'], alt: 'Hand-painted fantasy orc warband miniature group', created_at: '2026-06-27T00:00:00.000Z'
  },
  {
    id: 'af-003-crimson-sorceress', title: 'Crimson Sorceress', title_zh: '绯红术士', slug: 'crimson-sorceress', category: 'Character Sculpture', price_cents: 0, currency: 'USD', status: 'published', inventory: 1, material: 'Hand-painted resin with high-contrast armor and base accents', height_cm: null, description: 'A striking single-character figure built around sharp silhouettes, saturated red armor, and a supernatural display base.', cover_media_key: '/assets/images/artworks/crimson-sorceress/crimson-sorceress-hero.webp', gallery: ['/assets/images/artworks/crimson-sorceress/crimson-sorceress-hero.webp'], alt: 'Crimson fantasy sorceress character sculpture', created_at: '2026-06-27T00:00:00.000Z'
  },
  {
    id: 'af-004-arcane-standard-bearer', title: 'Arcane Standard Bearer', title_zh: '秘法旗手', slug: 'arcane-standard-bearer', category: 'Character Sculpture', price_cents: 0, currency: 'USD', status: 'published', inventory: 1, material: 'Hand-painted resin, ornate base, metallic and neon accents', height_cm: null, description: 'A ceremonial fantasy figure with a vertical composition, elaborate armor, and luminous green base details.', cover_media_key: '/assets/images/artworks/arcane-standard-bearer/arcane-standard-bearer-hero.webp', gallery: ['/assets/images/artworks/arcane-standard-bearer/arcane-standard-bearer-hero.webp'], alt: 'Fantasy standard bearer sculpture with glowing green base', created_at: '2026-06-27T00:00:00.000Z'
  },
  {
    id: 'af-005-ember-warlord', title: 'Ember Warlord', title_zh: '余烬战王', slug: 'ember-warlord', category: 'Character Sculpture', price_cents: 0, currency: 'USD', status: 'published', inventory: 1, material: 'Hand-painted resin with leather, metal, and battle-worn textures', height_cm: null, description: 'A heavy armored warrior figure with warm skin tones, dark metalwork, and a compact collector-display silhouette.', cover_media_key: '/assets/images/artworks/ember-warlord/ember-warlord-hero.webp', gallery: ['/assets/images/artworks/ember-warlord/ember-warlord-hero.webp','/assets/images/artworks/ember-warlord/ember-warlord-front.webp','/assets/images/artworks/ember-warlord/ember-warlord-three-quarter.webp'], alt: 'Hand-painted armored fantasy warlord sculpture', created_at: '2026-06-27T00:00:00.000Z'
  },
  {
    id: 'af-006-azure-paladin', title: 'Azure Paladin', title_zh: '湛蓝圣骑士', slug: 'azure-paladin', category: 'Character Sculpture', price_cents: 0, currency: 'USD', status: 'published', inventory: 1, material: 'Hand-painted resin with blue cloak, ice-effect base, and metallic armor', height_cm: null, description: 'A heroic sword-bearing figure defined by a sweeping blue cloak, icy basework, and polished armor highlights.', cover_media_key: '/assets/images/artworks/azure-paladin/azure-paladin-white-hero.webp', gallery: ['/assets/images/artworks/azure-paladin/azure-paladin-white-hero.webp','/assets/images/artworks/azure-paladin/azure-paladin-black-hero.webp','/assets/images/artworks/azure-paladin/azure-paladin-black-front.webp','/assets/images/artworks/azure-paladin/azure-paladin-back.webp'], alt: 'Blue cloaked fantasy paladin sculpture with ice base', created_at: '2026-06-27T00:00:00.000Z'
  }
];

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  let inserted = 0;
  let updated = 0;
  for (const item of seedArtworks) {
    const existing = await env.DB.prepare('SELECT id FROM artworks WHERE id = ?').bind(item.id).first<{ id: string }>();
    const galleryJson = JSON.stringify(item.gallery || []);
    if (existing) {
      await env.DB.prepare(`UPDATE artworks SET title = ?, slug = ?, price_cents = ?, currency = ?, status = ?, inventory = ?, material = ?, height_cm = ?, description = ?, cover_media_key = ?, title_zh = ?, category = ?, gallery_json = ?, alt = ?, sort_order = ? WHERE id = ?`)
        .bind(item.title, item.slug, item.price_cents, item.currency, item.status, item.inventory, item.material, item.height_cm, item.description, item.cover_media_key, item.title_zh, item.category, galleryJson, item.alt, 0, item.id)
        .run();
      updated++;
    } else {
      await env.DB.prepare(`INSERT INTO artworks (id, title, slug, price_cents, currency, status, inventory, material, height_cm, description, cover_media_key, title_zh, category, gallery_json, alt, sort_order, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(item.id, item.title, item.slug, item.price_cents, item.currency, item.status, item.inventory, item.material, item.height_cm, item.description, item.cover_media_key, item.title_zh, item.category, galleryJson, item.alt, 0, item.created_at).run();
      inserted++;
    }
  }
  return json({ ok: true, inserted, updated });
};
