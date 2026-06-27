CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY NOT NULL,
  value text NOT NULL,
  updated_at text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS artwork_media_artwork_id_idx ON artwork_media (artwork_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS artworks_status_sort_idx ON artworks (status, sort_order);
