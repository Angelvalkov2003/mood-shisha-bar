export type Category = {
  id: string;
  name_bg: string;
  name_en: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name_bg: string;
  name_en: string;
  description_bg: string | null;
  description_en: string | null;
  portion_value: string | null;
  portion_unit: "g" | "ml" | null;
  price: number;
  sort_number: number;
  is_featured: boolean;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  categories?: Pick<Category, "name_bg" | "name_en"> | null;
};

export type Poster = {
  id: string;
  image_bg: string;
  image_en: string;
  text_bg: string | null;
  text_en: string | null;
  link_bg: string | null;
  link_en: string | null;
  sort_order: number;
  created_at: string;
};
