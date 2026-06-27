import { requireAdmin, json } from './auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
type Setting = { key: string; value: string; updated_at: string };
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const { results = [] } = await env.DB.prepare('SELECT key, value, updated_at FROM site_settings ORDER BY key').all<Setting>().catch(() => ({ results: [] as Setting[] }));
  return json({ settings: Object.fromEntries(results.map(r => [r.key, r.value])), rows: results });
};
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const body = await request.json().catch(() => ({})) as Record<string,string>;
  const now = new Date().toISOString();
  for (const [key, value] of Object.entries(body)) {
    await env.DB.prepare('INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at')
      .bind(key, String(value ?? ''), now).run();
  }
  return json({ ok: true });
};
