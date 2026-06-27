import { cp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");
const out = resolve(root, "pages-dist");

if (!existsSync(client) || !existsSync(server)) {
  throw new Error("Missing dist/client or dist/server. Run `npm run build` first.");
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// Copy static assets first.
await cp(client, out, { recursive: true });

// Copy the Worker bundle and its supporting server chunks into the Pages output.
await cp(server, out, { recursive: true, force: true });

// Cloudflare Pages advanced mode expects the Worker entry to be named _worker.js.
await cp(resolve(server, "index.js"), resolve(out, "_worker.js"));

console.log("Prepared Cloudflare Pages output in pages-dist/");
console.log("Use build command: npm install && npm run pages:build");
console.log("Use build output directory: pages-dist");
