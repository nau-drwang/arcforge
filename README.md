# Arcforge Pages Full Stack

基于旧版 Arcforge Worker 外观重新整理的 Cloudflare Pages Full Stack 项目。

部署请看 `CLOUDFLARE_PAGES_DEPLOY.md`。

## Admin portal

ArcForge now includes a password-protected admin portal at `/admin.html`.

Required Cloudflare Pages environment variable:

- `ADMIN_PASSWORD` - password used to log into the admin portal.

Optional:

- `ADMIN_SESSION_SECRET` - separate signing secret for admin session cookies. If omitted, `ADMIN_PASSWORD` is used for signing.

Admin capabilities:

- Log in / log out
- Import the initial static artwork seed into D1
- Create new artwork records
- Edit product names, Chinese names, categories, descriptions, material, price/inquiry status, inventory, cover image, gallery images, and alt text
- Delete artwork records
- Upload images/videos to R2 and attach media keys to artwork records

Public visitors can still read `/api/products`, but create/update/delete/upload actions require admin login.
