# ArcForge Backend

Canonical backend source lives in `backend/functions/`.

CMS v4 automatically initializes the required D1 tables at runtime through the admin/session and API helpers. The SQL files in `backend/migrations/` are kept for historical reference and developer documentation, but the site owner does not need to run them manually.

Required Cloudflare bindings:

```text
DB     D1 database
MEDIA  R2 bucket
```

Required secret:

```text
SESSION_SECRET
```

Do not use `ADMIN_USERNAME` or `ADMIN_PASSWORD` in CMS v4. Users are managed in the CMS and stored in D1 with salted password hashes.


### CMS v4 installer behavior

The browser does not read Cloudflare secrets. `/api/admin/session` is backend-driven and initializes D1 tables automatically. `SESSION_SECRET` is recommended; if it is unavailable, the backend creates a persistent internal session secret in the D1 `site_settings` table so the owner setup flow is not blocked.


## CMS V4.1 Fix

Removed the misleading SESSION_SECRET configuration notice from the admin UI. The admin flow now relies on the backend session endpoint and goes directly to Owner setup, Login, or Dashboard.
