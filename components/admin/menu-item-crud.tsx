"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteMenuItem,
  setMenuItemAvailability,
  setMenuItemSortNumber,
} from "@/app/admin/actions";
import { InlineSortInput } from "@/components/admin/inline-sort-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, imageSrc } from "@/lib/utils";
import type { Category, MenuItem } from "@/types/db";

export function MenuItemCrud({
  rows,
  categories,
}: {
  rows: MenuItem[];
  categories: Category[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [delId, setDelId] = useState<string | null>(null);
  const [items, setItems] = useState(rows);
  const [toggleErr, setToggleErr] = useState("");

  useEffect(() => {
    setItems(rows);
  }, [rows]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((r) => r.category_id === filter)),
    [items, filter],
  );

  const catName = (id: string) => categories.find((c) => c.id === id)?.name_bg ?? "—";

  async function del(id: string) {
    await deleteMenuItem(id);
    setDelId(null);
    router.refresh();
  }

  async function updateSort(row: MenuItem, sort_number: number) {
    setItems((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, sort_number } : r)),
    );
    try {
      await setMenuItemSortNumber(row.id, sort_number);
      router.refresh();
    } catch {
      setItems((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, sort_number: row.sort_number } : r)),
      );
      setToggleErr("Could not update sort number");
    }
  }

  async function toggleAvailable(row: MenuItem) {
    const next = !row.is_available;
    setToggleErr("");
    setItems((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, is_available: next } : r)),
    );
    try {
      await setMenuItemAvailability(row.id, next);
      router.refresh();
    } catch {
      setItems((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, is_available: row.is_available } : r)),
      );
      setToggleErr("Could not update availability");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Menu items</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/admin/menu-items/new">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Link>
          </Button>
        </div>
      </div>

      {toggleErr ? <p className="mb-3 text-sm text-red-600">{toggleErr}</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Available</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name (BG)</TableHead>
            <TableHead>Portion</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sort Number</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow
              key={r.id}
              className={cn(!r.is_available && "bg-zinc-50/80 opacity-75")}
            >
              <TableCell>
                <Checkbox
                  checked={r.is_available}
                  onCheckedChange={() => toggleAvailable(r)}
                  aria-label={`Available: ${r.name_bg}`}
                />
              </TableCell>
              <TableCell>
                {imageSrc(r.image_url) ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded">
                    <Image
                      src={imageSrc(r.image_url)!}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                  {r.name_bg}
                  {r.is_featured ? <Badge>Featured</Badge> : null}
                  {!r.is_available ? (
                    <Badge variant="outline" className="text-amber-800">
                      Unavailable
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                {r.portion_value && r.portion_unit
                  ? `${r.portion_value} ${r.portion_unit}`
                  : "—"}
              </TableCell>
              <TableCell>{catName(r.category_id)}</TableCell>
              <TableCell>{Number(r.price).toFixed(2)}</TableCell>
              <TableCell>
                <InlineSortInput
                  value={r.sort_number}
                  onSave={(sort_number) => updateSort(r, sort_number)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="relative inline-flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/menu-items/${r.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDelId(r.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                  {delId === r.id ? (
                    <div className="absolute right-0 top-10 z-10 w-40 rounded-md border bg-white p-2 shadow-md">
                      <p className="mb-2 text-xs text-zinc-600">Confirm deletion?</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => del(r.id)}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDelId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
