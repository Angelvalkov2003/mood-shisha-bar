"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { saveShisha } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Shisha } from "@/types/db";

type Form = {
  id?: string;
  brand: string;
  image_url: string | null;
  all_flavors: string[];
  available_flavors: string[];
  sort_order: number;
};

export function ShishaForm({ initial }: { initial?: Shisha }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [newFlavor, setNewFlavor] = useState("");
  const [form, setForm] = useState<Form>({
    id: initial?.id,
    brand: initial?.brand ?? "",
    image_url: initial?.image_url ?? null,
    all_flavors: initial?.all_flavors ?? [],
    available_flavors: initial?.available_flavors ?? [],
    sort_order: initial?.sort_order ?? 0,
  });

  function addFlavor() {
    const f = newFlavor.trim();
    if (!f || form.all_flavors.includes(f)) return;
    setForm({
      ...form,
      all_flavors: [...form.all_flavors, f],
    });
    setNewFlavor("");
  }

  function removeFlavor(flavor: string) {
    setForm({
      ...form,
      all_flavors: form.all_flavors.filter((x) => x !== flavor),
      available_flavors: form.available_flavors.filter((x) => x !== flavor),
    });
  }

  function toggleVisible(flavor: string, checked: boolean) {
    if (checked) {
      if (form.available_flavors.includes(flavor)) return;
      setForm({
        ...form,
        available_flavors: [...form.available_flavors, flavor],
      });
    } else {
      setForm({
        ...form,
        available_flavors: form.available_flavors.filter((x) => x !== flavor),
      });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand.trim()) {
      setErr("Brand is required");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      await saveShisha(form);
      router.push("/admin/shishas");
      router.refresh();
    } catch {
      setErr("Save failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{form.id ? "Edit shisha" : "Add shisha"}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/shishas">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-5">
        <div>
          <Label>Brand</Label>
          <Input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="mt-1"
            placeholder="e.g. Al Fakher"
            required
          />
        </div>
        <div>
          <Label>Image</Label>
          <div className="mt-1">
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              seed={form.id ?? "shisha"}
            />
          </div>
        </div>
        <div>
          <Label>All flavors</Label>
          <p className="mt-0.5 text-xs text-zinc-500">
            Add every flavor this brand offers. Tick visible ones below.
          </p>
          <div className="mt-2 flex gap-2">
            <Input
              value={newFlavor}
              onChange={(e) => setNewFlavor(e.target.value)}
              placeholder="Flavor name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFlavor();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addFlavor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {form.all_flavors.length > 0 ? (
            <ul className="mt-3 space-y-2 rounded-md border p-3">
              {form.all_flavors.map((flavor) => {
                const visible = form.available_flavors.includes(flavor);
                return (
                  <li
                    key={flavor}
                    className="flex items-center justify-between gap-3 rounded-md bg-zinc-50 px-3 py-2"
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
                      <Checkbox
                        checked={visible}
                        onCheckedChange={(v) => toggleVisible(flavor, v === true)}
                      />
                      <span className={visible ? "font-medium text-amber-900" : "text-zinc-600"}>
                        {flavor}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {visible ? "visible on site" : "hidden"}
                      </span>
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFlavor(flavor)}
                      aria-label={`Remove ${flavor}`}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No flavors yet.</p>
          )}
        </div>
        <div>
          <Label>Sort order</Label>
          <Input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-zinc-500">Higher value appears first</p>
        </div>
        {err ? <p className="text-sm text-red-600">{err}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
