"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function InlineSortInput({
  value,
  onSave,
}: {
  value: number;
  onSave: (next: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  async function commit() {
    const parsed = Number.parseInt(draft, 10);
    const next = Number.isFinite(parsed) ? parsed : 0;
    if (next === value) return;
    setSaving(true);
    try {
      await onSave(next);
    } catch {
      setDraft(String(value));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Input
      type="number"
      inputMode="numeric"
      className="h-8 w-20 text-center tabular-nums"
      value={draft}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => void commit()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
        if (e.key === "Escape") {
          setDraft(String(value));
          (e.target as HTMLInputElement).blur();
        }
      }}
      aria-label="Sort order"
    />
  );
}
