import { ShishaCrud } from "@/components/admin/shisha-crud";
import { supabaseAdmin } from "@/lib/supabase";
import type { Shisha } from "@/types/db";

export default async function ShishasPage() {
  const { data } = await supabaseAdmin()
    .from("shishas")
    .select("*")
    .order("sort_order", { ascending: false });

  return <ShishaCrud rows={(data ?? []) as Shisha[]} />;
}
