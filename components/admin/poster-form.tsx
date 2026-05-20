"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { savePoster } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Poster } from "@/types/db";

type Form = {
  id?: string;
  image_bg: string;
  image_en: string;
  text_bg: string;
  text_en: string;
  link_bg: string;
  link_en: string;
  sort_order: number;
};

export function PosterForm({ initial }: { initial?: Poster }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Form>({
    id: initial?.id,
    image_bg: initial?.image_bg ?? "",
    image_en: initial?.image_en ?? "",
    text_bg: initial?.text_bg ?? "",
    text_en: initial?.text_en ?? "",
    link_bg: initial?.link_bg ?? "",
    link_en: initial?.link_en ?? "",
    sort_order: initial?.sort_order ?? 0,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await savePoster({
        ...form,
        text_bg: form.text_bg.trim() || null,
        text_en: form.text_en.trim() || null,
        link_bg: form.link_bg.trim() || null,
        link_en: form.link_en.trim() || null,
      });
      router.push("/admin/posters");
      router.refresh();
    } catch {
      setErr("Save failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{form.id ? "Edit poster" : "Add poster"}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/posters">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Image (BG)</Label>
            <div className="mt-1">
              <ImageUpload
                value={form.image_bg || null}
                onChange={(url) => setForm({ ...form, image_bg: url ?? "" })}
                seed={form.id ?? "poster-bg"}
              />
            </div>
          </div>
          <div>
            <Label>Image (EN)</Label>
            <div className="mt-1">
              <ImageUpload
                value={form.image_en || null}
                onChange={(url) => setForm({ ...form, image_en: url ?? "" })}
                seed={form.id ?? "poster-en"}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Text (BG)</Label>
            <Textarea
              value={form.text_bg}
              onChange={(e) => setForm({ ...form, text_bg: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Text (EN)</Label>
            <Textarea
              value={form.text_en}
              onChange={(e) => setForm({ ...form, text_en: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Link (BG)</Label>
            <Input
              value={form.link_bg}
              onChange={(e) => setForm({ ...form, link_bg: e.target.value })}
              className="mt-1"
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Link (EN)</Label>
            <Input
              value={form.link_en}
              onChange={(e) => setForm({ ...form, link_en: e.target.value })}
              className="mt-1"
              placeholder="https://..."
            />
          </div>
        </div>
        <div>
          <Label>Sort Order</Label>
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
