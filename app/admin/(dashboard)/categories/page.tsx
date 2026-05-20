import { CategoryCrud } from "@/components/admin/category-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Category } from "@/types/db";

export default async function CategoriesPage() {
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: false });

  return <CategoryCrud rows={(data ?? []) as Category[]} />;
}
