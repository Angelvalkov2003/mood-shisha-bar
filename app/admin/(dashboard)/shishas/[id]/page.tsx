import { notFound } from "next/navigation";
import { ShishaForm } from "@/components/admin/shisha-form";
import { supabaseAdmin } from "@/lib/supabase";
import type { Shisha } from "@/types/db";

export default async function EditShishaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await supabaseAdmin()
    .from("shishas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  return <ShishaForm initial={data as Shisha} />;
}
