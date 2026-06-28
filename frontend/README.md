# Frontend

Edit public pages and admin UI here.

- `src/` contains source HTML/CSS/JS.
- `public/` contains static assets copied directly into `dist/`.

Run `npm run build` from the repo root to regenerate `dist/`.


## CMS V4.1 Fix

Removed the misleading SESSION_SECRET configuration notice from the admin UI. The admin flow now relies on the backend session endpoint and goes directly to Owner setup, Login, or Dashboard.
