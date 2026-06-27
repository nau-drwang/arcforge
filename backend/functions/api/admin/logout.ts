import { clearAdminCookie, json } from '../auth';
interface Env {}
export const onRequestPost: PagesFunction<Env> = async () => json({ ok: true }, 200, { 'set-cookie': clearAdminCookie() });
