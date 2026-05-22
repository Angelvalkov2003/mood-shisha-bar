import { Suspense } from "react";
import { MenuItemCrud } from "@/components/admin/menu-item-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Category, MenuItem } from "@/types/db";

export default async function MenuItemsPage() {
  const db = supabaseAdmin();
  const [items, cats] = await Promise.all([
    db.from("menu_items").select("*").order("sort_number", { ascending: false }),
    db.from("categories").select("*").order("sort_order", { ascending: false }),
  ]);

  return (
    <Suspense
      fallback={
        <div className="text-sm text-zinc-500">Loading menu items…</div>
      }
    >
      <MenuItemCrud
        rows={(items.data ?? []) as MenuItem[]}
        categories={(cats.data ?? []) as Category[]}
      />
    </Suspense>
  );
}
