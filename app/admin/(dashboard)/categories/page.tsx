import { Suspense } from "react";
import { CategoryCrud } from "@/components/admin/category-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Category } from "@/types/db";

export default async function CategoriesPage() {
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: false });

  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <CategoryCrud rows={(data ?? []) as Category[]} />
    </Suspense>
  );
}
