import { countUsers, getCurrentUser, json } from '../auth';
interface Env { DB: D1Database; SESSION_SECRET?: string; ADMIN_SESSION_SECRET?: string; }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const configured = true;
  const users = await countUsers(env);
  const user = await getCurrentUser(request, env);
  // Setup is only allowed when there are no admin users.
  // Once any admin user exists, logout must always return to Login, not Setup.
  return json({ configured, setup_required: users === 0, reset_allowed: false, authenticated: Boolean(user), user });
};
