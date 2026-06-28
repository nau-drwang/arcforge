export interface CmsEnv { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }

export type AdminUser = {
  id: string;
  username: string;
  email?: string | null;
  role: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
};

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
}


let schemaPromise: Promise<void> | null = null;

async function runSchemaStatement(env: CmsEnv, sql: string) {
  await env.DB.prepare(sql).run().catch(() => undefined);
}

export async function ensureCmsSchema(env: CmsEnv) {
  if (schemaPromise) return schemaPromise;
  schemaPromise = (async () => {
    await runSchemaStatement(env, `CREATE TABLE IF NOT EXISTS artworks (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      slug text NOT NULL,
      price_cents integer NOT NULL DEFAULT 0,
      currency text DEFAULT 'USD' NOT NULL,
      status text DEFAULT 'draft' NOT NULL,
      inventory integer DEFAULT 1 NOT NULL,
      material text NOT NULL DEFAULT '',
      height_cm real,
      description text NOT NULL DEFAULT '',
      cover_media_key text,
      created_at text NOT NULL
    )`);
    await runSchemaStatement(env, `CREATE UNIQUE INDEX IF NOT EXISTS artworks_slug_unique ON artworks (slug)`);
    await runSchemaStatement(env, `ALTER TABLE artworks ADD COLUMN title_zh text`);
    await runSchemaStatement(env, `ALTER TABLE artworks ADD COLUMN category text`);
    await runSchemaStatement(env, `ALTER TABLE artworks ADD COLUMN gallery_json text`);
    await runSchemaStatement(env, `ALTER TABLE artworks ADD COLUMN alt text`);
    await runSchemaStatement(env, `ALTER TABLE artworks ADD COLUMN sort_order integer DEFAULT 0 NOT NULL`);
    await runSchemaStatement(env, `CREATE INDEX IF NOT EXISTS artworks_status_sort_idx ON artworks (status, sort_order)`);

    await runSchemaStatement(env, `CREATE TABLE IF NOT EXISTS artwork_media (
      id text PRIMARY KEY NOT NULL,
      artwork_id text NOT NULL,
      storage_key text NOT NULL,
      filename text NOT NULL,
      content_type text NOT NULL,
      kind text NOT NULL,
      size_bytes integer NOT NULL,
      created_at text NOT NULL
    )`);
    await runSchemaStatement(env, `CREATE INDEX IF NOT EXISTS artwork_media_artwork_id_idx ON artwork_media (artwork_id)`);

    await runSchemaStatement(env, `CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY NOT NULL,
      artwork_id text NOT NULL,
      buyer_email text NOT NULL,
      buyer_name text NOT NULL,
      amount_cents integer NOT NULL,
      currency text DEFAULT 'USD' NOT NULL,
      payment_status text DEFAULT 'pending' NOT NULL,
      created_at text NOT NULL
    )`);

    await runSchemaStatement(env, `CREATE TABLE IF NOT EXISTS site_settings (
      key text PRIMARY KEY NOT NULL,
      value text NOT NULL,
      updated_at text NOT NULL
    )`);

    await runSchemaStatement(env, `CREATE TABLE IF NOT EXISTS admin_users (
      id text PRIMARY KEY NOT NULL,
      username text NOT NULL UNIQUE,
      email text,
      role text NOT NULL DEFAULT 'owner',
      password_hash text NOT NULL,
      password_salt text NOT NULL,
      password_iterations integer NOT NULL DEFAULT 100000,
      is_active integer NOT NULL DEFAULT 1,
      last_login_at text,
      created_at text NOT NULL,
      updated_at text NOT NULL
    )`);
    await runSchemaStatement(env, `CREATE INDEX IF NOT EXISTS admin_users_username_idx ON admin_users (username)`);
    await runSchemaStatement(env, `CREATE INDEX IF NOT EXISTS admin_users_active_idx ON admin_users (is_active)`);
  })();
  return schemaPromise;
}


async function getSessionSecret(env: CmsEnv) {
  const configured = env.SESSION_SECRET || env.ADMIN_SESSION_SECRET;
  if (configured) return configured;
  // CMS v4 fallback: create a persistent internal session secret in D1.
  // This prevents the admin installer from being blocked by Cloudflare variable propagation
  // while still avoiding a hard-coded shared secret.
  await ensureCmsSchema(env);
  const existing = await env.DB.prepare("SELECT value FROM site_settings WHERE key = 'cms_internal_session_secret'").first<{ value: string }>().catch(() => null);
  if (existing?.value) return existing.value;
  const value = `${crypto.randomUUID()}.${crypto.randomUUID()}.${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await env.DB.prepare('INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)')
    .bind('cms_internal_session_secret', value, now).run();
  return value;
}

export function isConfigured(_env: CmsEnv) {
  return true;
}

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get('cookie') || '';
  return cookie.split(';').map(v => v.trim()).find(v => v.startsWith(`${name}=`))?.slice(name.length + 1) || '';
}

function toBase64Url(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function sign(message: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toBase64Url(signature);
}

export function timingSafeEqual(a = '', b = '') {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function hashPassword(password: string, saltBase64Url?: string, iterations = 100000) {
  const salt = saltBase64Url ? new Uint8Array(fromBase64Url(saltBase64Url)) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, keyMaterial, 256);
  return { hash: toBase64Url(bits), salt: toBase64Url(salt.buffer), iterations };
}

export async function verifyPassword(password: string, user: Pick<AdminUser, 'password_hash' | 'password_salt' | 'password_iterations'>) {
  const candidate = await hashPassword(password, user.password_salt, user.password_iterations || 100000);
  return timingSafeEqual(candidate.hash, user.password_hash);
}

export async function countUsers(env: CmsEnv) {
  await ensureCmsSchema(env);
  const row = await env.DB.prepare('SELECT COUNT(*) as total FROM admin_users').first<{ total: number }>().catch(() => ({ total: 0 }));
  return Number(row?.total || 0);
}


export async function canResetOwner(env: CmsEnv) {
  await ensureCmsSchema(env);
  const row = await env.DB.prepare('SELECT COUNT(*) as total FROM admin_users WHERE last_login_at IS NOT NULL').first<{ total: number }>().catch(() => ({ total: 0 }));
  return Number(row?.total || 0) === 0;
}

export async function createAdminCookie(env: CmsEnv, user: Pick<AdminUser, 'id' | 'username' | 'role'>) {
  const secret = await getSessionSecret(env);
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `${expiresAt}.${user.id}.${user.username}.${user.role}`;
  const signature = await sign(payload, secret);
  const value = `${payload}.${signature}`;
  return `af_admin=${value}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax`;
}

export async function getCurrentUser(request: Request, env: CmsEnv) {
  await ensureCmsSchema(env);
  const secret = await getSessionSecret(env);
  const cookie = getCookie(request, 'af_admin');
  const [expiresAt, userId, username, role, signature] = cookie.split('.');
  if (!expiresAt || !userId || !username || !role || !signature || Number(expiresAt) < Date.now()) return null;
  const expected = await sign(`${expiresAt}.${userId}.${username}.${role}`, secret);
  if (!timingSafeEqual(signature, expected)) return null;
  const user = await env.DB.prepare('SELECT id, username, email, role, is_active, last_login_at, created_at, updated_at FROM admin_users WHERE id = ? AND is_active = 1')
    .bind(userId).first<Omit<AdminUser, 'password_hash' | 'password_salt' | 'password_iterations'>>().catch(() => null);
  return user || null;
}

export async function isAdmin(request: Request, env: CmsEnv) {
  return Boolean(await getCurrentUser(request, env));
}

export async function requireAdmin(request: Request, env: CmsEnv) {
  if (await isAdmin(request, env)) return null;
  return json({ error: 'Admin login required' }, 401);
}

export function clearAdminCookie() {
  return 'af_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';
}
