-- Restaurant menu template schema
-- Paste into Supabase SQL Editor and run once.

-- Categories (menu sections)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bg text NOT NULL,
  name_en text NOT NULL,
  slug text NOT NULL,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE categories IS 'Menu sections; sort_order controls display order in admin lists.';
COMMENT ON COLUMN categories.name_bg IS 'Bulgarian display name';
COMMENT ON COLUMN categories.name_en IS 'English display name';
COMMENT ON COLUMN categories.slug IS 'URL slug from name_bg (latin, lowercase, no spaces)';

-- Menu items (dishes)
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_bg text NOT NULL,
  name_en text NOT NULL,
  description_bg text,
  description_en text,
  portion_value text,
  portion_unit text CHECK (portion_unit IN ('g', 'ml')),
  price numeric(10, 2) NOT NULL,
  sort_number int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE menu_items IS 'Dishes; sort_number DESC = shown first on public menu.';
COMMENT ON COLUMN menu_items.is_featured IS 'Shown in homepage featured section when true';
COMMENT ON COLUMN menu_items.is_available IS 'When false, hidden from public menu but visible in admin';
COMMENT ON COLUMN menu_items.portion_value IS 'Optional portion amount, e.g. 250; NULL = not shown on menu';
COMMENT ON COLUMN menu_items.portion_unit IS 'Optional unit g or ml; must be NULL when portion_value is NULL';

-- Posters (homepage promo banners)
CREATE TABLE IF NOT EXISTS posters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_bg text NOT NULL,
  image_en text NOT NULL,
  text_bg text,
  text_en text,
  link_bg text,
  link_en text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE posters IS 'Homepage posters with per-locale image, text and link.';
COMMENT ON COLUMN posters.sort_order IS 'Higher values are shown first.';

-- Shisha brands (tobacco brands + flavor catalog)
CREATE TABLE IF NOT EXISTS shishas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  image_url text,
  all_flavors text[] NOT NULL DEFAULT '{}',
  available_flavors text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE shishas IS 'Shisha tobacco brands; available_flavors is a subset of all_flavors shown on the site.';
COMMENT ON COLUMN shishas.brand IS 'Brand name (e.g. Al Fakher)';
COMMENT ON COLUMN shishas.all_flavors IS 'Full flavor catalog for this brand';
COMMENT ON COLUMN shishas.available_flavors IS 'Checked flavors visible to customers';

-- Safe migration for existing projects that already created menu_items
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS portion_value text;

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS portion_unit text;

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS is_available boolean NOT NULL DEFAULT true;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'menu_items_portion_unit_check'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_portion_unit_check
      CHECK (
        portion_unit IS NULL
        OR portion_unit IN ('g', 'ml')
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'menu_items_portion_pair_check'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_portion_pair_check
      CHECK (
        (portion_value IS NULL AND portion_unit IS NULL)
        OR (
          portion_value IS NOT NULL
          AND portion_value <> ''
          AND portion_unit IS NOT NULL
        )
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS menu_items_featured_idx ON menu_items(is_featured) WHERE is_featured = true;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE shishas ENABLE ROW LEVEL SECURITY;

-- Public read (anon key on site)
CREATE POLICY "anon_read_categories"
  ON categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_read_menu_items"
  ON menu_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_read_posters"
  ON posters FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_read_shishas"
  ON shishas FOR SELECT
  TO anon
  USING (true);

-- service_role bypasses RLS; server admin uses SUPABASE_SERVICE_ROLE_KEY for CRUD

GRANT SELECT ON categories TO anon;
GRANT SELECT ON menu_items TO anon;
GRANT SELECT ON posters TO anon;
GRANT SELECT ON shishas TO anon;
GRANT ALL ON categories TO service_role;
GRANT ALL ON menu_items TO service_role;
GRANT ALL ON posters TO service_role;
GRANT ALL ON shishas TO service_role;
