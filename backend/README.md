# ArcForge Backend

Canonical backend source lives in `backend/functions/`.

CMS v5.2 automatically initializes the required D1 tables at runtime through the admin/session and API helpers. The SQL files in `backend/migrations/` are kept for historical reference and developer documentation, but the site owner does not need to run them manually.

Required Cloudflare bindings:

```text
DB     D1 database
MEDIA  R2 bucket
```

Required secret:

```text
SESSION_SECRET
```

Do not use `ADMIN_USERNAME` or `ADMIN_PASSWORD` in CMS v5.2. Users are managed in the CMS and stored in D1 with salted password hashes.


### CMS v5.2 installer behavior

The browser does not read Cloudflare secrets. `/api/admin/session` is backend-driven and initializes D1 tables automatically. `SESSION_SECRET` is recommended; if it is unavailable, the backend creates a persistent internal session secret in the D1 `site_settings` table so the owner setup flow is not blocked.


## CMS V5.2 MVP

Removed the misleading SESSION_SECRET configuration notice from the admin UI. The admin flow now relies on the backend session endpoint and goes directly to Owner setup, Login, or Dashboard.


## ArcForge CMS V5.2

CMS V5.2 is the first repairable CMS MVP. It keeps the one-repository Cloudflare Pages architecture, but fixes the prior admin setup loop. The admin backend now returns a setup state from `/api/admin/session`:

- `setup_required`: no admin user exists, so show Create Owner.
- `reset_allowed`: a previous unfinished setup created an admin user but no successful login has happened yet, so the Owner account can be safely recreated.
- `authenticated`: show Dashboard.
- otherwise: show Login.

No manual D1 migration is required. Do not set `ADMIN_USERNAME` or `ADMIN_PASSWORD`. Keep `SESSION_SECRET` as a Cloudflare Secret if it is already configured.
