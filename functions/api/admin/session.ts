import { countUsers, getCurrentUser, isConfigured, json } from '../auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const configured = isConfigured(env);
  const users = configured ? await countUsers(env) : 0;
  const user = configured ? await getCurrentUser(request, env) : null;
  return json({ configured, setup_required: configured && users === 0, authenticated: Boolean(user), user });
};
