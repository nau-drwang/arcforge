import { getCurrentUser, hashPassword, json, requireAdmin, verifyPassword } from '../auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
type UserRow = { id: string; username: string; email: string | null; role: string; is_active: number; created_at: string; updated_at: string; last_login_at: string | null };

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const { results = [] } = await env.DB.prepare('SELECT id, username, email, role, is_active, created_at, updated_at, last_login_at FROM admin_users ORDER BY created_at ASC').all<UserRow>();
  return json({ users: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const actor = await getCurrentUser(request, env);
  if (actor?.role !== 'owner') return json({ error: 'Only owner can create admin users' }, 403);
  const body = await request.json().catch(() => null) as { username?: string; email?: string; password?: string; role?: string } | null;
  if (!body?.username || body.username.trim().length < 3) return json({ error: 'username must be at least 3 characters' }, 400);
  if (!body?.password || body.password.length < 10) return json({ error: 'password must be at least 10 characters' }, 400);
  const username = body.username.trim();
  const existing = await env.DB.prepare('SELECT id FROM admin_users WHERE username = ?').bind(username).first<{ id: string }>().catch(() => null);
  if (existing?.id) return json({ error: 'Username already exists. Please choose another username.' }, 409);
  const hashed = await hashPassword(body.password);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO admin_users (id, username, email, role, password_hash, password_salt, password_iterations, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`).bind(id, username, body.email || null, body.role || 'editor', hashed.hash, hashed.salt, hashed.iterations, now, now).run();
  return json({ ok: true, user: { id, username, email: body.email || null, role: body.role || 'editor', is_active: 1 } }, 201);
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const denied = await requireAdmin(request, env); if (denied) return denied;
  const actor = await getCurrentUser(request, env);
  const body = await request.json().catch(() => null) as { action?: string; user_id?: string; current_password?: string; new_password?: string; username?: string; email?: string; role?: string; is_active?: number } | null;
  const now = new Date().toISOString();

  if (body?.action === 'change_own_password') {
    if (!actor) return json({ error: 'Admin login required' }, 401);
    if (!body.current_password || !body.new_password) return json({ error: 'current_password and new_password are required' }, 400);
    if (body.new_password.length < 10) return json({ error: 'new password must be at least 10 characters' }, 400);
    const fullUser = await env.DB.prepare('SELECT * FROM admin_users WHERE id = ? AND is_active = 1').bind(actor.id).first<any>();
    if (!fullUser || !(await verifyPassword(body.current_password, fullUser))) return json({ error: 'Current password is incorrect' }, 401);
    const hashed = await hashPassword(body.new_password);
    await env.DB.prepare('UPDATE admin_users SET password_hash = ?, password_salt = ?, password_iterations = ?, updated_at = ? WHERE id = ?')
      .bind(hashed.hash, hashed.salt, hashed.iterations, now, actor.id).run();
    return json({ ok: true });
  }

  if (actor?.role !== 'owner') return json({ error: 'Only owner can edit users' }, 403);
  if (!body?.user_id) return json({ error: 'user_id is required' }, 400);
  await env.DB.prepare('UPDATE admin_users SET username = COALESCE(?, username), email = ?, role = COALESCE(?, role), is_active = COALESCE(?, is_active), updated_at = ? WHERE id = ?')
    .bind(body.username || null, body.email ?? null, body.role || null, body.is_active ?? null, now, body.user_id).run();
  if (body.new_password) {
    if (body.new_password.length < 10) return json({ error: 'new password must be at least 10 characters' }, 400);
    const hashed = await hashPassword(body.new_password);
    await env.DB.prepare('UPDATE admin_users SET password_hash = ?, password_salt = ?, password_iterations = ?, updated_at = ? WHERE id = ?')
      .bind(hashed.hash, hashed.salt, hashed.iterations, now, body.user_id).run();
  }
  return json({ ok: true });
};
