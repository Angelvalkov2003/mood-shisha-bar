-- Run in Supabase SQL Editor if shishas table is not created yet.

CREATE TABLE IF NOT EXISTS shishas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  image_url text,
  all_flavors text[] NOT NULL DEFAULT '{}',
  available_flavors text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE shishas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_shishas' AND tablename = 'shishas'
  ) THEN
    CREATE POLICY "anon_read_shishas"
      ON shishas FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

GRANT SELECT ON shishas TO anon;
GRANT ALL ON shishas TO service_role;
