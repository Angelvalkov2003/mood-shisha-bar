import { notFound } from "next/navigation";
import { PosterForm } from "@/components/admin/poster-form";
import { supabaseAdmin } from "@/lib/supabase";
import type { Poster } from "@/types/db";

export default async function EditPosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await supabaseAdmin()
    .from("posters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  return <PosterForm initial={data as Poster} />;
}
