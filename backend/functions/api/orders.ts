import { ensureCmsSchema } from './auth';
interface Env { DB: D1Database; }
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } }); }

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  await ensureCmsSchema(env as any);
  const body = await request.json().catch(() => null) as { artwork_id?: string; buyer_email?: string; buyer_name?: string } | null;
  if (!body?.artwork_id || !body?.buyer_email || !body?.buyer_name) return json({ error: 'artwork_id, buyer_email, and buyer_name are required' }, 400);

  const artwork = await env.DB.prepare('SELECT id, price_cents, currency FROM artworks WHERE id = ?').bind(body.artwork_id).first<{ id: string; price_cents: number; currency: string }>();
  if (!artwork) return json({ error: 'artwork not found' }, 404);

  const id = crypto.randomUUID();
  await env.DB.prepare(`INSERT INTO orders (id, artwork_id, buyer_email, buyer_name, amount_cents, currency, payment_status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, artwork.id, body.buyer_email, body.buyer_name, artwork.price_cents, artwork.currency, 'pending', new Date().toISOString())
    .run();
  return json({ order_id: id, payment_status: 'pending' }, 201);
};
