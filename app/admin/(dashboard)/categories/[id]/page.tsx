import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { supabaseAdmin } from "@/lib/supabase";
import type { Category } from "@/types/db";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  return <CategoryForm initial={data as Category} />;
}
