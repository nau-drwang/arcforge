export interface AdminEnv { ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; }

function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
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

async function sign(message: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function createAdminCookie(env: AdminEnv) {
  const secret = env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured');
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const message = String(expiresAt);
  const signature = await sign(message, secret);
  const value = `${message}.${signature}`;
  return `af_admin=${value}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Lax`;
}

export async function isAdmin(request: Request, env: AdminEnv) {
  const secret = env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) return false;
  const cookie = getCookie(request, 'af_admin');
  const [expiresAt, signature] = cookie.split('.');
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
  const expected = await sign(expiresAt, secret);
  return timingSafeEqual(signature, expected);
}

export async function requireAdmin(request: Request, env: AdminEnv) {
  if (await isAdmin(request, env)) return null;
  return json({ error: 'Admin login required' }, 401);
}

export function clearAdminCookie() {
  return 'af_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';
}

export { json };
