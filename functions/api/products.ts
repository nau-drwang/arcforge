import { seedArtworks } from './seed';

interface Env { DB: D1Database; MEDIA: R2Bucket; }

type ArtworkRow = {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  currency: string;
  status: string;
  inventory: number;
  material: string;
  height_cm: number | null;
  description: string;
  cover_media_key: string | null;
  title_zh?: string | null;
  category?: string | null;
  gallery_json?: string | null;
  gallery?: string[];
  alt?: string | null;
  sort_order?: number;
  created_at: string;
};

const sampleProducts = seedArtworks;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '') || `artwork-${Date.now()}`;
}

function normalizeArtwork(row: ArtworkRow) {
  let gallery: string[] = [];
  try { gallery = row.gallery_json ? JSON.parse(row.gallery_json) : []; } catch (_error) { gallery = []; }
  return { ...row, gallery };
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const { results = [] } = await env.DB.prepare('SELECT * FROM artworks ORDER BY sort_order ASC, created_at DESC').all<ArtworkRow>();
    const products = results.map(normalizeArtwork);
    return json({ products: products.length ? products : sampleProducts, source: products.length ? 'd1' : 'seed' });
  } catch (error) {
    return json({ products: sampleProducts, source: 'seed', warning: 'D1 not initialized yet' });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as Partial<ArtworkRow> & { price?: number; gallery?: string[] } | null;
  if (!body?.title) return json({ error: 'title is required' }, 400);

  const id = crypto.randomUUID();
  const slug = body.slug || slugify(body.title);
  const priceCents = typeof body.price_cents === 'number' ? body.price_cents : Math.round(Number(body.price || 0) * 100);
  const now = new Date().toISOString();

  const galleryJson = Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : null;

  await env.DB.prepare(`INSERT INTO artworks (id, title, slug, price_cents, currency, status, inventory, material, height_cm, description, cover_media_key, title_zh, category, gallery_json, alt, sort_order, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, body.title, slug, priceCents, body.currency || 'USD', body.status || 'published', body.inventory ?? 1, body.material || 'Hand-painted resin', body.height_cm ?? null, body.description || '', body.cover_media_key || null, body.title_zh || null, body.category || null, galleryJson, body.alt || null, body.sort_order ?? 0, now)
    .run();

  const product = await env.DB.prepare('SELECT * FROM artworks WHERE id = ?').bind(id).first<ArtworkRow>();
  return json({ product }, 201);
};
