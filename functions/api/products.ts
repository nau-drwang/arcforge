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
  created_at: string;
};

const sampleProducts = [
  { id: 'sample-ash-waraxe-lord', title: '灰烬战斧领主', slug: 'ash-waraxe-lord', price_cents: 42000, currency: 'USD', status: 'published', inventory: 1, material: '手绘树脂 / 金属旧化', height_cm: 32, description: '重甲、披风和岩石底座做旧处理，适合收藏柜中央陈列。', cover_media_key: null, created_at: new Date().toISOString() },
  { id: 'sample-mooncrystal-mage', title: '月晶秘法师', slug: 'mooncrystal-mage', price_cents: 36000, currency: 'USD', status: 'published', inventory: 1, material: '半透明树脂 / 冷光漆', height_cm: 28, description: '法杖和晶体以低饱和蓝绿呈现，强调手工笔触和层次。', cover_media_key: null, created_at: new Date().toISOString() },
  { id: 'sample-wing-oath-guardian', title: '翼誓守卫', slug: 'wing-oath-guardian', price_cents: 51000, currency: 'USD', status: 'published', inventory: 3, material: '树脂 / 仿石底座', height_cm: 35, description: '展开翼片和长枪形成竖向轮廓，适合高柜或独立展台。', cover_media_key: null, created_at: new Date().toISOString() }
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '') || `artwork-${Date.now()}`;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const { results = [] } = await env.DB.prepare('SELECT * FROM artworks ORDER BY created_at DESC').all<ArtworkRow>();
    return json({ products: results.length ? results : sampleProducts, source: results.length ? 'd1' : 'sample' });
  } catch (error) {
    return json({ products: sampleProducts, source: 'sample', warning: 'D1 not initialized yet' });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json().catch(() => null) as Partial<ArtworkRow> & { price?: number } | null;
  if (!body?.title) return json({ error: 'title is required' }, 400);

  const id = crypto.randomUUID();
  const slug = body.slug || slugify(body.title);
  const priceCents = typeof body.price_cents === 'number' ? body.price_cents : Math.round(Number(body.price || 0) * 100);
  const now = new Date().toISOString();

  await env.DB.prepare(`INSERT INTO artworks (id, title, slug, price_cents, currency, status, inventory, material, height_cm, description, cover_media_key, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, body.title, slug, priceCents, body.currency || 'USD', body.status || 'published', body.inventory ?? 1, body.material || '手绘树脂', body.height_cm ?? null, body.description || '', body.cover_media_key || null, now)
    .run();

  const product = await env.DB.prepare('SELECT * FROM artworks WHERE id = ?').bind(id).first<ArtworkRow>();
  return json({ product }, 201);
};
