# ArcForge Backend

Canonical backend source lives in `backend/functions/`.

CMS v3 automatically initializes the required D1 tables at runtime through the admin/session and API helpers. The SQL files in `backend/migrations/` are kept for historical reference and developer documentation, but the site owner does not need to run them manually.

Required Cloudflare bindings:

```text
DB     D1 database
MEDIA  R2 bucket
```

Required secret:

```text
SESSION_SECRET
```

Do not use `ADMIN_USERNAME` or `ADMIN_PASSWORD` in CMS v3. Users are managed in the CMS and stored in D1 with salted password hashes.
