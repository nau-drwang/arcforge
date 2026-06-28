import { createAdminCookie, ensureCmsSchema, json, verifyPassword } from '../auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  await ensureCmsSchema(env);
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null;
  if (!body?.username || !body?.password) return json({ error: 'username and password are required' }, 400);
  const user = await env.DB.prepare('SELECT * FROM admin_users WHERE username = ? AND is_active = 1').bind(body.username).first<any>().catch(() => null);
  if (!user || !(await verifyPassword(body.password, user))) return json({ error: 'Invalid username or password' }, 401);
  const now = new Date().toISOString();
  await env.DB.prepare('UPDATE admin_users SET last_login_at = ?, updated_at = ? WHERE id = ?').bind(now, now, user.id).run();
  const cookie = await createAdminCookie(env, user);
  return json({ ok: true, user: { id: user.id, username: user.username, email: user.email, role: user.role } }, 200, { 'set-cookie': cookie });
};
