# ArcForge Pages Full Stack - CMS v1

Cloudflare Pages full-stack site with a single GitHub repository and separated frontend/backend structure.

## Structure

```text
frontend/                 Customer-facing pages and CMS UI
backend/functions/        Cloudflare Pages Functions API source
backend/migrations/       D1 migrations
functions/                Generated deployment mirror of backend/functions
data/seed/                Seed artwork data
docs/                     Deployment and asset documentation
dist/                     Generated frontend output for Cloudflare Pages
```

## CMS v1

Admin portal: `/admin.html`

Features:
- username/password login with HttpOnly session cookie
- dashboard
- artwork create/edit/delete
- English and Chinese artwork fields
- status control: published/draft/archived
- R2 media upload and media library
- D1-backed site settings
- public pages read published D1 artwork records

## Cloudflare variables

Set these in Cloudflare Pages -> Settings -> Variables and Secrets:

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=optional-long-random-secret
```

Also keep your existing D1 binding and R2 binding:

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
