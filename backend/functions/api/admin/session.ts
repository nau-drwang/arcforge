import { countUsers, getCurrentUser, json } from '../auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const configured = true;
  const users = await countUsers(env);
  const user = await getCurrentUser(request, env);
  return json({ configured, setup_required: users === 0, authenticated: Boolean(user), user });
};
