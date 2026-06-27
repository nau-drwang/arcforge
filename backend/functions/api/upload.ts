import { requireAdmin } from './auth';
interface Env { DB: D1Database; MEDIA: R2Bucket; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; }
function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } }); }
function safeName(name: string) { return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-'); }

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const form = await request.formData();
  const file = form.get('file');
  const artworkId = String(form.get('artwork_id') || 'unassigned');
  if (!(file instanceof File)) return json({ error: 'file is required' }, 400);

  const kind = file.type.startsWith('video/') ? 'video' : 'image';
  const key = `products/${artworkId}/${crypto.randomUUID()}-${safeName(file.name)}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await env.DB.prepare(`INSERT INTO artwork_media (id, artwork_id, storage_key, filename, content_type, kind, size_bytes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, artworkId, key, file.name, file.type || 'application/octet-stream', kind, file.size, now)
      .run();
    if (kind === 'image' && artworkId !== 'unassigned') {
      await env.DB.prepare('UPDATE artworks SET cover_media_key = COALESCE(cover_media_key, ?) WHERE id = ?').bind(key, artworkId).run();
    }
  } catch (_error) {
    // File upload still succeeds if the DB has not been initialized yet.
  }

  return json({ id, key, url: `/media/${key}`, filename: file.name, content_type: file.type, kind, size_bytes: file.size }, 201);
};
