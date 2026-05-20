import { PosterCrud } from "@/components/admin/poster-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Poster } from "@/types/db";

export default async function PostersPage() {
  const { data } = await supabaseAdmin()
    .from("posters")
    .select("*")
    .order("sort_order", { ascending: false });

  return <PosterCrud rows={(data ?? []) as Poster[]} />;
}
