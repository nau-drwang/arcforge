import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const artworks = sqliteTable("artworks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("draft"),
  inventory: integer("inventory").notNull().default(1),
  material: text("material").notNull(),
  heightCm: real("height_cm"),
  description: text("description").notNull(),
  coverMediaKey: text("cover_media_key"),
  createdAt: text("created_at").notNull(),
});

export const artworkMedia = sqliteTable("artwork_media", {
  id: text("id").primaryKey(),
  artworkId: text("artwork_id")
    .notNull()
    .references(() => artworks.id),
  storageKey: text("storage_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  kind: text("kind").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: text("created_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  artworkId: text("artwork_id").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerName: text("buyer_name").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});
