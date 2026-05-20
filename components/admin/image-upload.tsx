"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imgUrl } from "@/lib/utils";

export function ImageUpload({
  value,
  onChange,
  seed,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  seed: string;
}) {
  const [busy, setBusy] = useState(false);
  const [urlText, setUrlText] = useState(value ?? "");
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    setUrlText(value ?? "");
    setUrlError("");
  }, [value]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }

  async function uploadFile(file: File) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setUrlText(data.url);
        onChange(data.url);
      }
    } finally {
      setBusy(false);
    }
  }

  function applyUrlFromField() {
    const t = urlText.trim();
    if (!t) {
      setUrlError("");
      onChange(null);
      return;
    }
    if (!isValidHttpUrl(t)) {
      setUrlError("Please enter a valid URL (https://...)");
      return;
    }
    setUrlError("");
    onChange(t);
  }

  const finalUrl = value ?? urlText;
  const previewUrl = isValidHttpUrl(finalUrl) ? finalUrl : null;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3">
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-zinc-100">
          <Image
            src={imgUrl(previewUrl, seed)}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <label className="flex-1 cursor-pointer rounded-md border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm text-zinc-600 hover:border-amber-400 hover:bg-amber-50/40">
          <div className="flex items-center gap-2">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{busy ? "Uploading..." : "Upload image"}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Click to choose file</p>
          <Input
            type="file"
            accept="image/*"
            onChange={onFile}
            disabled={busy}
            className="sr-only"
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Image URL</p>
        <Input
          value={urlText}
          onChange={(e) => {
            setUrlText(e.target.value);
            if (urlError) setUrlError("");
          }}
          onBlur={applyUrlFromField}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          placeholder="https://..."
        />
        {urlError ? <p className="text-xs text-red-600">{urlError}</p> : null}
        {finalUrl ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="px-0"
            onClick={() => {
              setUrlText("");
              onChange(null);
            }}
          >
            <X className="mr-1 h-3 w-3" />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function isValidHttpUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
