"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteShisha, setShishaSortOrder } from "@/app/admin/actions";
import { InlineSortInput } from "@/components/admin/inline-sort-input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { imgUrl } from "@/lib/utils";
import type { Shisha } from "@/types/db";

export function ShishaCrud({ rows }: { rows: Shisha[] }) {
  const router = useRouter();
  const [delId, setDelId] = useState<string | null>(null);
  const [items, setItems] = useState(rows);

  useEffect(() => {
    setItems(rows);
  }, [rows]);

  async function del(id: string) {
    await deleteShisha(id);
    setDelId(null);
    router.refresh();
  }

  async function updateSort(row: Shisha, sort_order: number) {
    setItems((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, sort_order } : r)),
    );
    try {
      await setShishaSortOrder(row.id, sort_order);
      router.refresh();
    } catch {
      setItems((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, sort_order: row.sort_order } : r)),
      );
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shishas</h1>
        <Button asChild>
          <Link href="/admin/shishas/new">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>All flavors</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>Sort</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="relative h-10 w-16 overflow-hidden rounded">
                  <Image
                    src={imgUrl(r.image_url, `shisha-${r.id}`)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{r.brand}</TableCell>
              <TableCell>{r.all_flavors.length}</TableCell>
              <TableCell>{r.available_flavors.length}</TableCell>
              <TableCell>
                <InlineSortInput
                  value={r.sort_order}
                  onSave={(sort_order) => updateSort(r, sort_order)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="relative inline-flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/shishas/${r.id}`}>
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
