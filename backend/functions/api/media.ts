import { requireAdmin, json } from './auth';
interface Env { DB: D1Database; MEDIA: R2Bucket; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; }
type MediaRow = { id: string; artwork_id: string; storage_key: string; filename: string; content_type: string; kind: string; size_bytes: number; created_at: string };
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const url = new URL(request.url);
  const artworkId = url.searchParams.get('artwork_id');
  const stmt = artworkId ? env.DB.prepare('SELECT * FROM artwork_media WHERE artwork_id = ? ORDER BY created_at DESC').bind(artworkId) : env.DB.prepare('SELECT * FROM artwork_media ORDER BY created_at DESC LIMIT 200');
  const { results = [] } = await stmt.all<MediaRow>();
  return json({ media: results.map(m => ({ ...m, url: `/media/${m.storage_key}` })) });
};
export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key) return json({ error: 'key is required' }, 400);
  await env.MEDIA.delete(key).catch(() => undefined);
  await env.DB.prepare('DELETE FROM artwork_media WHERE storage_key = ?').bind(key).run().catch(() => undefined);
  return json({ ok: true, key });
};
