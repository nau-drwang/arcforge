import { createAdminCookie, json, timingSafeEqual } from '../auth';
interface Env { ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD) return json({ error: 'ADMIN_PASSWORD is not configured in Cloudflare Pages environment variables.' }, 500);
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null;
  const expectedUser = env.ADMIN_USERNAME || 'admin';
  const username = body?.username || 'admin';
  if (!body?.password || !timingSafeEqual(username, expectedUser) || !timingSafeEqual(body.password, env.ADMIN_PASSWORD)) {
    return json({ error: 'Invalid admin username or password' }, 401);
  }
  const cookie = await createAdminCookie(env, username);
  return json({ ok: true, username }, 200, { 'set-cookie': cookie });
};
