import { isAdmin, json } from '../auth';
interface Env { ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return json({ authenticated: await isAdmin(request, env), configured: Boolean(env.ADMIN_PASSWORD) });
};
