import { createAdminCookie, json } from '../auth';

interface Env { ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; }

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD) return json({ error: 'ADMIN_PASSWORD is not configured in Cloudflare Pages environment variables.' }, 500);
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || !timingSafeEqual(body.password, env.ADMIN_PASSWORD)) return json({ error: 'Invalid admin password' }, 401);
  const cookie = await createAdminCookie(env);
  return json({ ok: true }, 200, { 'set-cookie': cookie });
};
