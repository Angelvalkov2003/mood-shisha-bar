import { supabase } from "@/lib/supabase";
import type { Category, MenuItem } from "@/types/db";

export async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: false });
  return (data ?? []) as Category[];
}

export async function getCategoryPage(slug: string) {
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!category) return null;

  const { data: raw } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category_id", category.id)
    .order("sort_number", { ascending: false });

  const items = ((raw ?? []) as MenuItem[]).filter(
    (i) => i.is_available !== false,
  );

  return { category: category as Category, items };
}
