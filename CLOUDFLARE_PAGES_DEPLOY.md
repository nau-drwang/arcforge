# Cloudflare Pages Deployment

This project has been prepared for Cloudflare Pages so it can use a free `*.pages.dev` URL.

## Cloudflare resources

- D1 database name: `arcforge-database`
- D1 binding name: `DB`
- D1 database ID: `dcc74346-0345-4c64-a790-556dcc38840b`
- R2 bucket name: `arcforge-media`
- R2 binding name: `MEDIA`

## Pages build settings

Create a new Cloudflare Pages project from GitHub.

Use these settings:

```txt
Framework preset: None
Build command: npm install && npm run pages:build
Build output directory: pages-dist
Root directory: leave blank
Node.js version: 22
```

Do not use `npx wrangler deploy` as the deploy command for Pages. That command creates a Workers URL.

## Pages bindings

In the Pages project settings, add these bindings for both Production and Preview if available:

```txt
D1 database binding
Variable name: DB
Database: arcforge-database
```

```txt
R2 bucket binding
Variable name: MEDIA
Bucket: arcforge-media
```

Also set compatibility:

```txt
Compatibility date: 2026-05-15 or newer
Compatibility flags: nodejs_compat
```

## Database initialization

Run the SQL in:

```txt
drizzle/0000_groovy_mongu.sql
```

Cloudflare path:

```txt
Storage & databases -> D1 SQLite Database -> arcforge-database -> Console
```

## Free URL

If the Pages project name is `arcforge`, the free URL will be:

```txt
https://arcforge.pages.dev
```

`https://arcforge.dev` is only possible if you buy and bind the custom domain `arcforge.dev`.
