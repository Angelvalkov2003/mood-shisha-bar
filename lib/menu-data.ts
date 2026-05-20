import { supabase } from "@/lib/supabase";
import type { Category, MenuItem } from "@/types/db";

export async function getMenuData() {
  const [cats, items] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: false }),
    supabase
      .from("menu_items")
      .select("*, categories(name_bg, name_en)")
      .order("sort_number", { ascending: false }),
  ]);

  const categories = (cats.data ?? []) as Category[];
  const allItems = (items.data ?? []) as MenuItem[];
  const menuItems = allItems.filter((i) => i.is_available !== false);
  const featured = menuItems.filter((i) => i.is_featured);

  const byCat = categories.map((c) => ({
    category: c,
    items: menuItems.filter((i) => i.category_id === c.id),
  }));

  return { categories, menuItems, featured, byCat };
}
