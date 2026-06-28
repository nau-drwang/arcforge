CREATE TABLE IF NOT EXISTS admin_users (
  id text PRIMARY KEY NOT NULL,
  username text NOT NULL UNIQUE,
  email text,
  role text NOT NULL DEFAULT 'owner',
  password_hash text NOT NULL,
  password_salt text NOT NULL,
  password_iterations integer NOT NULL DEFAULT 100000,
  is_active integer NOT NULL DEFAULT 1,
  last_login_at text,
  created_at text NOT NULL,
  updated_at text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS admin_users_username_idx ON admin_users (username);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS admin_users_active_idx ON admin_users (is_active);
