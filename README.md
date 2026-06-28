# ArcForge Pages Full Stack - CMS v4

Cloudflare Pages full-stack site with one GitHub repository and separated frontend/backend structure.

## Structure

```text
frontend/                 Customer-facing pages and CMS UI
backend/functions/        Cloudflare Pages Functions API source
backend/migrations/       Historical D1 migrations for reference
functions/                Generated deployment mirror of backend/functions
data/seed/                Seed artwork data
docs/                     Deployment and asset documentation
dist/                     Generated frontend output for Cloudflare Pages
```

## CMS v4

Admin portal: `/admin.html`

CMS v4 includes an installer-style first run:

1. Deploy the project.
2. Set only `SESSION_SECRET` in Cloudflare Pages Variables & Secrets.
3. Open `/admin.html`.
4. The CMS automatically initializes the required D1 tables.
5. Create the first owner account.

No manual SQL migration is required for CMS v4.

Features:

- D1 users table with salted PBKDF2 password hashes
- secure HttpOnly session cookie
- first-time owner account installer
- dashboard
- artwork create/edit/delete
- English and Chinese artwork fields
- status control: published/draft/archived
- R2 media upload and media library
- D1-backed site settings
- public pages read published D1 artwork records

## Cloudflare variables

Set this in Cloudflare Pages -> Settings -> Variables and Secrets:

```text
SESSION_SECRET=use-a-long-random-string
```

Do not set `ADMIN_USERNAME` or `ADMIN_PASSWORD`. Admin accounts are created and managed inside the CMS.

Also keep your existing D1 and R2 bindings:

```text
DB
MEDIA
```

## Build

```bash
npm install
npm run build
```

Cloudflare Pages build command:

```bash
npm run build
```

Build output directory:

```text
dist
```


## ArcForge CMS v4

CMS v4 uses a backend-driven installer. The browser no longer tries to read Cloudflare secrets. On first visit to `/admin.html`, the backend initializes required D1 tables and opens the owner-account setup flow. `SESSION_SECRET` is recommended as a Cloudflare Secret, but if it is missing or not propagated, CMS v4 creates a persistent internal session secret in D1 so setup is not blocked.


## ArcForge CMS v4 Installer Release

This release replaces the v3 configuration gate. Admin setup is now backend-driven: `/api/admin/session` initializes D1 tables and returns setup state. The frontend never tries to read `SESSION_SECRET`. Set `SESSION_SECRET` as a Cloudflare Secret if available; if not, CMS v4 creates a persistent internal session secret in D1.


## CMS V4.1 Fix

Removed the misleading SESSION_SECRET configuration notice from the admin UI. The admin flow now relies on the backend session endpoint and goes directly to Owner setup, Login, or Dashboard.
