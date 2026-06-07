"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteMenuItem,
  setMenuItemAvailability,
  setMenuItemSortNumber,
} from "@/app/admin/actions";
import {
  AdminListSearch,
  useAdminSearchQuery,
} from "@/components/admin/admin-list-search";
import { AdminCategorySelect } from "@/components/admin/category-select";
import { InlineSortInput } from "@/components/admin/inline-sort-input";
import { matchesAdminSearch } from "@/lib/admin-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { query: searchQuery } = useAdminSearchQuery();
  const [delId, setDelId] = useState<string | null>(null);
  const [items, setItems] = useState(rows);
  const [toggleErr, setToggleErr] = useState("");

  useEffect(() => {
    setItems(rows);
  }, [rows]);

  const filter = useMemo(() => {
    const id = searchParams.get("category");
    if (!id || id === "all") return "all";
    return categories.some((c) => c.id === id) ? id : "all";
  }, [searchParams, categories]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.category_id, (counts.get(item.category_id) ?? 0) + 1);
    }
    return counts;
  }, [items]);

  const categoryFiltered = useMemo(
    () => (filter === "all" ? items : items.filter((r) => r.category_id === filter)),
    [items, filter],
  );

  const displayed = useMemo(
    () =>
      categoryFiltered.filter((r) =>
        matchesAdminSearch(searchQuery, r.name_bg, r.name_en),
      ),
    [categoryFiltered, searchQuery],
  );

  function setCategoryFilter(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") params.delete("category");
    else params.set("category", categoryId);
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  const catName = (id: string) => categories.find((c) => c.id === id)?.name_bg ?? "—";
  const activeCategory =
    filter === "all" ? null : categories.find((c) => c.id === filter);

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
        <Button asChild>
          <Link href="/admin/menu-items/new">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Link>
        </Button>
      </div>

      <AdminListSearch placeholder="Search by name (BG or EN)…" />

      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-3">
        <AdminCategorySelect
          label="Filter by category"
          id="menu-items-category-filter"
          value={filter}
          onValueChange={setCategoryFilter}
          categories={categories}
          includeAll
          allCount={items.length}
          getItemCount={(id) => countByCategory.get(id) ?? 0}
        />
        {activeCategory || searchQuery.trim() ? (
          <p className="mt-2 text-xs text-zinc-500">
            Showing {displayed.length} item{displayed.length === 1 ? "" : "s"}
            {activeCategory ? ` in ${activeCategory.name_bg}` : ""}
            {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ""}
          </p>
        ) : null}
      </div>

      {toggleErr ? <p className="mb-3 text-sm text-red-600">{toggleErr}</p> : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">Available</TableHead>
            <TableHead className="hidden md:table-cell">Image</TableHead>
            <TableHead>Name (BG)</TableHead>
            <TableHead className="hidden md:table-cell">Portion</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Sort Number</TableHead>
            <TableHead className="w-[4.5rem] text-right md:w-auto" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayed.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-zinc-500 md:col-span-8"
              >
                No items match your search.
              </TableCell>
            </TableRow>
          ) : null}
          {displayed.map((r) => (
            <TableRow
              key={r.id}
              className={cn(!r.is_available && "bg-zinc-50/80 opacity-75")}
            >
              <TableCell className="w-10">
                <Checkbox
                  checked={r.is_available}
                  onCheckedChange={() => toggleAvailable(r)}
                  aria-label={`Available: ${r.name_bg}`}
                />
              </TableCell>
              <TableCell className="hidden md:table-cell">
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
              <TableCell className="max-w-[9rem] md:max-w-none">
                <span className="line-clamp-2 text-sm font-medium md:hidden">
                  {r.name_bg}
                </span>
                <div className="hidden flex-wrap items-center gap-2 md:flex">
                  {r.name_bg}
                  {r.is_featured ? <Badge>Featured</Badge> : null}
                  {!r.is_available ? (
                    <Badge variant="outline" className="text-amber-800">
                      Unavailable
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {r.portion_value && r.portion_unit
                  ? `${r.portion_value} ${r.portion_unit}`
                  : "—"}
              </TableCell>
              <TableCell className="max-w-[5.5rem] text-sm md:max-w-none">
                <span className="line-clamp-2">{catName(r.category_id)}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {Number(r.price).toFixed(2)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
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
