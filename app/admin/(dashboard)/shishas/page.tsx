import { Suspense } from "react";
import { ShishaCrud } from "@/components/admin/shisha-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Shisha } from "@/types/db";

export default async function ShishasPage() {
  const { data } = await supabaseAdmin()
    .from("shishas")
    .select("*")
    .order("sort_order", { ascending: false });

  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <ShishaCrud rows={(data ?? []) as Shisha[]} />
    </Suspense>
  );
}
