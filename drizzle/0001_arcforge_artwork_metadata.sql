ALTER TABLE artworks ADD COLUMN title_zh text;
--> statement-breakpoint
ALTER TABLE artworks ADD COLUMN category text;
--> statement-breakpoint
ALTER TABLE artworks ADD COLUMN gallery_json text;
--> statement-breakpoint
ALTER TABLE artworks ADD COLUMN alt text;
--> statement-breakpoint
ALTER TABLE artworks ADD COLUMN sort_order integer DEFAULT 0 NOT NULL;
