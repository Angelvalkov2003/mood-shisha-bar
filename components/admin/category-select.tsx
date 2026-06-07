"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/db";

const triggerClass =
  "h-11 w-full text-left text-zinc-900 data-[placeholder]:text-zinc-500 sm:h-9";
const contentClass =
  "z-[100] max-h-[min(50vh,20rem)] w-[var(--radix-select-trigger-width)] text-zinc-900";

export function AdminCategorySelect({
  value,
  onValueChange,
  categories,
  includeAll = false,
  allCount,
  getItemCount,
  label,
  id = "category",
}: {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  includeAll?: boolean;
  allCount?: number;
  getItemCount?: (categoryId: string) => number;
  label?: string;
  id?: string;
}) {
  if (categories.length === 0 && !includeAll) {
    return label ? (
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="mt-1 text-sm text-zinc-500">No categories available.</p>
      </div>
    ) : null;
  }

  const field = (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
    >
      <SelectTrigger id={id} className={triggerClass}>
        <SelectValue placeholder={includeAll ? "All categories" : "Select category"} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={4} className={contentClass}>
        {includeAll ? (
          <SelectItem value="all" className="text-zinc-900">
            All categories
            {allCount != null ? ` (${allCount})` : ""}
          </SelectItem>
        ) : null}
        {categories.map((c) => {
          const count = getItemCount?.(c.id);
          return (
            <SelectItem key={c.id} value={c.id} className="text-zinc-900">
              {c.name_bg}
              {c.name_en !== c.name_bg ? ` / ${c.name_en}` : ""}
              {count != null ? ` (${count})` : ""}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );

  if (!label) return field;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">{field}</div>
    </div>
  );
}
