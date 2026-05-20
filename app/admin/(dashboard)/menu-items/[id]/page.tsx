import { notFound } from "next/navigation";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { supabaseAdmin } from "@/lib/supabase";
import type { Category, MenuItem } from "@/types/db";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = supabaseAdmin();
  const [cats, item] = await Promise.all([
    db.from("categories").select("*").order("sort_order", { ascending: false }),
    db.from("menu_items").select("*").eq("id", id).maybeSingle(),
  ]);

  if (!item.data) notFound();
  return (
    <MenuItemForm
      categories={(cats.data ?? []) as Category[]}
      initial={item.data as MenuItem}
    />
  );
}
