import { Suspense } from "react";
import { PosterCrud } from "@/components/admin/poster-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Poster } from "@/types/db";

export default async function PostersPage() {
  const { data } = await supabaseAdmin()
    .from("posters")
    .select("*")
    .order("sort_order", { ascending: false });

  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <PosterCrud rows={(data ?? []) as Poster[]} />
    </Suspense>
  );
}
