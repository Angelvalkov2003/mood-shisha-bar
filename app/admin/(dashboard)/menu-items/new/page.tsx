import { MenuItemForm } from "@/components/admin/menu-item-form";
import { supabaseAdmin } from "@/lib/supabase";
import type { Category } from "@/types/db";

export default async function NewMenuItemPage() {
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: false });

  return <MenuItemForm categories={(data ?? []) as Category[]} />;
}
