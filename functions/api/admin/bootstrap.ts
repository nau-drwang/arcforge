import { countUsers, createAdminCookie, hashPassword, isConfigured, json } from '../auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isConfigured(env)) return json({ error: 'SESSION_SECRET is not configured in Cloudflare Pages Variables & Secrets.' }, 500);
  if (await countUsers(env) > 0) return json({ error: 'Initial admin user already exists.' }, 409);
  const body = await request.json().catch(() => null) as { username?: string; email?: string; password?: string; confirm_password?: string } | null;
  const username = (body?.username || 'admin').trim();
  const password = body?.password || '';
  if (!username || username.length < 3) return json({ error: 'username must be at least 3 characters' }, 400);
  if (password.length < 10) return json({ error: 'password must be at least 10 characters' }, 400);
  if (body?.confirm_password && body.confirm_password !== password) return json({ error: 'password confirmation does not match' }, 400);
  const hashed = await hashPassword(password);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO admin_users (id, username, email, role, password_hash, password_salt, password_iterations, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`).bind(id, username, body?.email || null, 'owner', hashed.hash, hashed.salt, hashed.iterations, now, now).run();
  const user = { id, username, email: body?.email || null, role: 'owner' };
  const cookie = await createAdminCookie(env, user);
  return json({ ok: true, user }, 201, { 'set-cookie': cookie });
};
