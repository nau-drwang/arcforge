# Backend

Canonical backend source lives in `backend/functions/`.

`scripts/build.mjs` mirrors this folder to root-level `functions/` because Cloudflare Pages expects the deployment Functions directory at the repository root.

## Main API

- `GET /api/products` - public published artwork data
- `GET /api/products?admin=1` - all artwork records, requires admin login
- `POST /api/products` - create artwork, requires admin login
- `PUT /api/products` - update artwork, requires admin login
- `DELETE /api/products?id=...` - delete artwork, requires admin login
- `POST /api/upload` - upload media to R2, requires admin login
- `GET /api/media` - list media, requires admin login
- `DELETE /api/media?key=...` - delete media, requires admin login
- `POST /api/admin/login` - login
- `POST /api/admin/logout` - logout
- `GET /api/admin/session` - check session
- `GET/PUT /api/settings` - D1 site settings, requires admin login
