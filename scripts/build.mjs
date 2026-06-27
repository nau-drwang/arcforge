import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const frontendRoot = path.join(root, 'frontend');
const backendRoot = path.join(root, 'backend');
const dist = path.join(root, 'dist');
const functionsOut = path.join(root, 'functions');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, item.name);
    const to = path.join(dest, item.name);
    if (item.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

copyDir(path.join(frontendRoot, 'public'), dist);
for (const file of fs.readdirSync(path.join(frontendRoot, 'src'))) {
  const from = path.join(frontendRoot, 'src', file);
  const to = path.join(dist, file);
  if (fs.statSync(from).isFile()) fs.copyFileSync(from, to);
}

// Cloudflare Pages expects a root-level functions directory.
// backend/functions is the canonical source; this mirror is generated for deployment.
fs.rmSync(functionsOut, { recursive: true, force: true });
copyDir(path.join(backendRoot, 'functions'), functionsOut);

console.log('Built frontend to dist/ and synced backend/functions to functions/');
