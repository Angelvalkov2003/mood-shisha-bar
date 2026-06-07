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
  revalidatePath("/admin/shishas");
  revalidatePath("/menu");
  revalidatePath("/menu/nargile");
}

function failDb(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function normalizePortion(
  portion_value: string | null | undefined,
  portion_unit: "g" | "ml" | null | undefined,
) {
  const value = portion_value?.trim() || null;
  if (!value) return { portion_value: null, portion_unit: null };
  return {
    portion_value: value,
    portion_unit: portion_unit === "ml" ? "ml" : "g",
  };
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
    failDb(error);
  } else {
    const { error } = await db.from("categories").insert(row);
    failDb(error);
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

  if (!data.category_id?.trim()) {
    throw new Error("Please select a category.");
  }
  if (!data.name_bg.trim() || !data.name_en.trim()) {
    throw new Error("Name (BG) and Name (EN) are required.");
  }
  if (!Number.isFinite(data.price) || data.price < 0) {
    throw new Error("Please enter a valid price.");
  }

  const db = supabaseAdmin();
  const { portion_value, portion_unit } = normalizePortion(
    data.portion_value,
    data.portion_unit,
  );
  const row = {
    category_id: data.category_id,
    name_bg: data.name_bg.trim(),
    name_en: data.name_en.trim(),
    description_bg: data.description_bg?.trim() || null,
    description_en: data.description_en?.trim() || null,
    portion_value,
    portion_unit,
    price: data.price,
    sort_number: Number.isFinite(data.sort_number) ? data.sort_number : 0,
    is_featured: data.is_featured,
    is_available: data.is_available,
    image_url: data.image_url?.trim() || null,
  };
  if (data.id) {
    const { error } = await db.from("menu_items").update(row).eq("id", data.id);
    failDb(error);
  } else {
    const { error } = await db.from("menu_items").insert(row);
    failDb(error);
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

export async function setMenuItemSortNumber(id: string, sort_number: number) {
  await assertAdmin();
  const { error } = await supabaseAdmin()
    .from("menu_items")
    .update({ sort_number })
    .eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function setCategorySortOrder(id: string, sort_order: number) {
  await assertAdmin();
  const { error } = await supabaseAdmin()
    .from("categories")
    .update({ sort_order })
    .eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function setShishaSortOrder(id: string, sort_order: number) {
  await assertAdmin();
  const { error } = await supabaseAdmin()
    .from("shishas")
    .update({ sort_order })
    .eq("id", id);
  if (error) throw error;
  revalidate();
}

export async function setPosterSortOrder(id: string, sort_order: number) {
  await assertAdmin();
  const { error } = await supabaseAdmin()
    .from("posters")
    .update({ sort_order })
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

export async function saveShisha(data: {
  id?: string;
  brand: string;
  image_url: string | null;
  all_flavors: string[];
  available_flavors: string[];
  sort_order: number;
}) {
  await assertAdmin();
  const all = [...new Set(data.all_flavors.map((f) => f.trim()).filter(Boolean))];
  const available = data.available_flavors
    .map((f) => f.trim())
    .filter((f) => f && all.includes(f));
  const row = {
    brand: data.brand.trim(),
    image_url: data.image_url,
    all_flavors: all,
    available_flavors: available,
    sort_order: data.sort_order,
  };
  const db = supabaseAdmin();
  if (data.id) {
    const { error } = await db.from("shishas").update(row).eq("id", data.id);
    if (error) throw error;
  } else {
    const { error } = await db.from("shishas").insert(row);
    if (error) throw error;
  }
  revalidate();
}

export async function deleteShisha(id: string) {
  await assertAdmin();
  const { error } = await supabaseAdmin().from("shishas").delete().eq("id", id);
  if (error) throw error;
  revalidate();
}
