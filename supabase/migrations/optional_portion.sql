-- Portion (g/ml) is optional on menu items.
UPDATE menu_items
SET portion_unit = NULL
WHERE portion_value IS NULL OR trim(portion_value) = '';

UPDATE menu_items
SET portion_value = NULL
WHERE portion_unit IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_portion_unit_check'
  ) THEN
    ALTER TABLE menu_items DROP CONSTRAINT menu_items_portion_unit_check;
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_portion_unit_check
      CHECK (portion_unit IS NULL OR portion_unit IN ('g', 'ml'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'menu_items_portion_pair_check'
  ) THEN
    ALTER TABLE menu_items
      ADD CONSTRAINT menu_items_portion_pair_check
      CHECK (
        (portion_value IS NULL AND portion_unit IS NULL)
        OR (
          portion_value IS NOT NULL
          AND trim(portion_value) <> ''
          AND portion_unit IS NOT NULL
        )
      );
  END IF;
END $$;
