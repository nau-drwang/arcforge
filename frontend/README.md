# Frontend

Edit public pages and admin UI here.

- `src/` contains source HTML/CSS/JS.
- `public/` contains static assets copied directly into `dist/`.

Run `npm run build` from the repo root to regenerate `dist/`.


## CMS V5 MVP

Removed the misleading SESSION_SECRET configuration notice from the admin UI. The admin flow now relies on the backend session endpoint and goes directly to Owner setup, Login, or Dashboard.


## ArcForge CMS V5

CMS V5 is the first repairable CMS MVP. It keeps the one-repository Cloudflare Pages architecture, but fixes the prior admin setup loop. The admin backend now returns a setup state from `/api/admin/session`:

- `setup_required`: no admin user exists, so show Create Owner.
- `reset_allowed`: a previous unfinished setup created an admin user but no successful login has happened yet, so the Owner account can be safely recreated.
- `authenticated`: show Dashboard.
- otherwise: show Login.

No manual D1 migration is required. Do not set `ADMIN_USERNAME` or `ADMIN_PASSWORD`. Keep `SESSION_SECRET` as a Cloudflare Secret if it is already configured.
