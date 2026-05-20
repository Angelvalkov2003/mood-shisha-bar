"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { saveMenuItem } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category, MenuItem } from "@/types/db";

type Form = {
  id?: string;
  category_id: string;
  name_bg: string;
  name_en: string;
  description_bg: string;
  description_en: string;
  portion_value: string;
  portion_unit: "g" | "ml";
  price: number;
  sort_number: number;
  is_featured: boolean;
  is_available: boolean;
  image_url: string | null;
};

export function MenuItemForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: MenuItem;
}) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Form>({
    id: initial?.id,
    category_id: initial?.category_id ?? categories[0]?.id ?? "",
    name_bg: initial?.name_bg ?? "",
    name_en: initial?.name_en ?? "",
    description_bg: initial?.description_bg ?? "",
    description_en: initial?.description_en ?? "",
    portion_value: initial?.portion_value ?? "",
    portion_unit: initial?.portion_unit === "ml" ? "ml" : "g",
    price: initial ? Number(initial.price) : 0,
    sort_number: initial?.sort_number ?? 0,
    is_featured: initial?.is_featured ?? false,
    is_available: initial?.is_available ?? true,
    image_url: initial?.image_url ?? null,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await saveMenuItem({
        ...form,
        description_bg: form.description_bg || null,
        description_en: form.description_en || null,
        portion_value: form.portion_value.trim() || null,
        portion_unit: form.portion_value.trim() ? form.portion_unit : null,
      });
      router.push("/admin/menu-items");
      router.refresh();
    } catch {
      setErr("Save failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {form.id ? "Edit menu item" : "Add menu item"}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/admin/menu-items">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-5">
        <ImageUpload
          value={form.image_url}
          onChange={(url) => setForm({ ...form, image_url: url })}
          seed={form.id ?? "new-item"}
        />
        <div>
          <Label>Category</Label>
          <Select
            value={form.category_id}
            onValueChange={(v) => setForm({ ...form, category_id: v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name_en} ({c.name_bg})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name (BG)</Label>
            <Input
              value={form.name_bg}
              onChange={(e) => setForm({ ...form, name_bg: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Name (EN)</Label>
            <Input
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label>Description (BG)</Label>
          <Textarea
            value={form.description_bg}
            onChange={(e) => setForm({ ...form, description_bg: e.target.value })}
            className="mt-1"
            rows={2}
          />
        </div>
        <div>
          <Label>Description (EN)</Label>
          <Textarea
            value={form.description_en}
            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            className="mt-1"
            rows={2}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Portion</Label>
            <Input
              value={form.portion_value}
              onChange={(e) => setForm({ ...form, portion_value: e.target.value })}
              placeholder="e.g. 250"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <div className="mt-1 inline-flex rounded-md border border-zinc-200 bg-white p-1">
              <Button
                type="button"
                size="sm"
                variant={form.portion_unit === "g" ? "default" : "ghost"}
                onClick={() => setForm({ ...form, portion_unit: "g" })}
              >
                Grams (g)
              </Button>
              <Button
                type="button"
                size="sm"
                variant={form.portion_unit === "ml" ? "default" : "ghost"}
                onClick={() => setForm({ ...form, portion_unit: "ml" })}
              >
                Milliliters (ml)
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Price (EUR)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>Sort Number</Label>
            <Input
              type="number"
              value={form.sort_number}
              onChange={(e) => setForm({ ...form, sort_number: Number(e.target.value) })}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-zinc-500">Higher value appears first in menu</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="available"
              checked={form.is_available}
              onCheckedChange={(v) => setForm({ ...form, is_available: v === true })}
            />
            <Label htmlFor="available">Available</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={form.is_featured}
              onCheckedChange={(v) => setForm({ ...form, is_featured: v === true })}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </div>
        {!form.is_available ? (
          <p className="text-sm text-amber-700">Not available — hidden from public menu.</p>
        ) : null}
        {err ? <p className="text-sm text-red-600">{err}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
