# ArcForge Pages Full Stack

ArcForge is a Cloudflare Pages Full Stack project using Pages + Functions + D1 + R2.

This repository is intentionally kept as **one GitHub repo**, but the code is now separated by responsibility:

```text
arcforge/
  frontend/          # Public website and admin UI source files
    src/             # HTML, CSS, JS source files
    public/          # Static assets copied into dist/

  backend/           # Cloudflare backend source files
    functions/       # Pages Functions API source
    migrations/      # D1 SQL migrations

  data/              # Seed data and structured content
    seed/artworks.json

  docs/              # Deployment notes and asset library documentation
  scripts/           # Build scripts
  dist/              # Generated frontend output
  functions/         # Generated deployment mirror of backend/functions
```

## How updates work

- Frontend changes: edit files in `frontend/src/` or `frontend/public/`.
- Backend/API changes: edit files in `backend/functions/`.
- Database schema changes: add SQL files under `backend/migrations/`.
- Artwork seed data: update `data/seed/artworks.json` and/or `frontend/public/data/artworks.json`.

Cloudflare Pages still deploys from this single repo. The build command is:

```bash
npm run build
```

The build script copies:

- `frontend/public/` + `frontend/src/` into `dist/`
- `backend/functions/` into root `functions/` for Cloudflare Pages deployment

## Admin portal

The admin portal is available at `/admin.html`.

Required Cloudflare Pages environment variable:

- `ADMIN_PASSWORD` - password used to log into the admin portal

Optional:

- `ADMIN_SESSION_SECRET` - separate signing secret for admin session cookies. If omitted, `ADMIN_PASSWORD` is used for signing.

Admin capabilities:

- Log in / log out
- Import the initial static artwork seed into D1
- Create new artwork records
- Edit product names, Chinese names, categories, descriptions, material, price/inquiry status, inventory, cover image, gallery images, and alt text
- Delete artwork records
- Upload images/videos to R2 and attach media keys to artwork records

Public visitors can read `/api/products`, but create/update/delete/upload actions require admin login.

Deployment notes are in `docs/CLOUDFLARE_PAGES_DEPLOY.md`.
