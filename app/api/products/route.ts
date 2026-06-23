import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";

type RuntimeEnv = {
  DB?: D1Database;
  MEDIA?: R2Bucket;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const runtime = env as RuntimeEnv;

  if (!runtime.DB || !runtime.MEDIA) {
    return NextResponse.json(
      { error: "D1 or R2 binding is not configured." },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const price = Number(form.get("price") ?? 0);
  const material = String(form.get("material") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const inventory = Number(form.get("inventory") ?? 1);
  const files = form.getAll("media").filter((item): item is File => item instanceof File);

  if (!title || !price || !material || !description) {
    return NextResponse.json({ error: "Missing required artwork fields." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const artworkId = crypto.randomUUID();
  const slug = slugify(title) || artworkId;
  const uploaded = [];

  for (const file of files) {
    const mediaId = crypto.randomUUID();
    const kind = file.type.startsWith("video/") ? "video" : "image";
    const storageKey = `artworks/${artworkId}/${mediaId}-${file.name}`;
    await runtime.MEDIA.put(storageKey, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    await runtime.DB.prepare(
      "INSERT INTO artwork_media (id, artwork_id, storage_key, filename, content_type, kind, size_bytes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(mediaId, artworkId, storageKey, file.name, file.type, kind, file.size, now)
      .run();

    uploaded.push({ id: mediaId, storageKey, kind });
  }

  await runtime.DB.prepare(
    "INSERT INTO artworks (id, title, slug, price_cents, currency, status, inventory, material, description, cover_media_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      artworkId,
      title,
      slug,
      Math.round(price * 100),
      "USD",
      "draft",
      inventory,
      material,
      description,
      uploaded[0]?.storageKey ?? null,
      now,
    )
    .run();

  return NextResponse.json({ artworkId, uploaded });
}
