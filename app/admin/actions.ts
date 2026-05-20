"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { slugFromBg } from "@/lib/slug";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/bg");
  revalidatePath("/en");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/menu-items");
  revalidatePath("/admin/posters");
}

export async function saveCategory(data: {
  id?: string;
  name_bg: string;
  name_en: string;
  image_url: string | null;
  sort_order: number;
  slug?: string;
}) {
  await assertAdmin();
  const db = supabaseAdmin();
  const slug = slugFromBg(data.slug || data.name_bg);
  const row = {
    name_bg: data.name_bg,
    name_en: data.name_en,
    slug,
    image_url: data.image_url,
    sort_order: data.sort_order,
  };
  if (data.id) {
    const { error } = await db.from("categories").update(row).eq("id", data.id);
    if (error) throw error;
  } else {
    const { error } = await db.from("categories").insert(row);
    if (error) throw error;
  }
  revalidate();
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  const { error } = await supabaseAdmin().from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function saveMenuItem(data: {
  id?: string;
  category_id: string;
  name_bg: string;
  name_en: string;
  description_bg: string | null;
  description_en: string | null;
  portion_value: string | null;
  portion_unit: "g" | "ml" | null;
  price: number;
  sort_number: number;
  is_featured: boolean;
  is_available: boolean;
  image_url: string | null;
}) {
  await assertAdmin();
  const db = supabaseAdmin();
  const row = {
    category_id: data.category_id,
    name_bg: data.name_bg,
    name_en: data.name_en,
    description_bg: data.description_bg,
    description_en: data.description_en,
    portion_value: data.portion_value,
    portion_unit: data.portion_unit,
    price: data.price,
    sort_number: data.sort_number,
    is_featured: data.is_featured,
    is_available: data.is_available,
    image_url: data.image_url,
  };
  if (data.id) {
    const { error } = await db.from("menu_items").update(row).eq("id", data.id);
    if (error) throw error;
  } else {
    const { error } = await db.from("menu_items").insert(row);
    if (error) throw error;
  }
  revalidate();
}

export async function deleteMenuItem(id: string) {
  await assertAdmin();
  const { error } = await supabaseAdmin().from("menu_items").delete().eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function setMenuItemAvailability(id: string, is_available: boolean) {
  await assertAdmin();
  const { error } = await supabaseAdmin()
    .from("menu_items")
    .update({ is_available })
    .eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function savePoster(data: {
  id?: string;
  image_bg: string;
  image_en: string;
  text_bg: string | null;
  text_en: string | null;
  link_bg: string | null;
  link_en: string | null;
  sort_order: number;
}) {
  await assertAdmin();
  const db = supabaseAdmin();
  const row = {
    image_bg: data.image_bg,
    image_en: data.image_en,
    text_bg: data.text_bg,
    text_en: data.text_en,
    link_bg: data.link_bg,
    link_en: data.link_en,
    sort_order: data.sort_order,
  };
  if (data.id) {
    const { error } = await db.from("posters").update(row).eq("id", data.id);
    if (error) throw error;
  } else {
    const { error } = await db.from("posters").insert(row);
    if (error) throw error;
  }
  revalidate();
}

export async function deletePoster(id: string) {
  await assertAdmin();
  const { error } = await supabaseAdmin().from("posters").delete().eq("id", id);
  if (error) throw error;
  revalidate();
}
