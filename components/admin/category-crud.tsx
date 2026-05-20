"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteCategory } from "@/app/admin/actions";
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
import type { Category } from "@/types/db";

export function CategoryCrud({ rows }: { rows: Category[] }) {
  const [delId, setDelId] = useState<string | null>(null);

  async function del(id: string) {
    await deleteCategory(id);
    setDelId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name (BG)</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Sort Order</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="relative h-10 w-10 overflow-hidden rounded">
                  <Image
                    src={imgUrl(r.image_url, r.id)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </TableCell>
              <TableCell>{r.name_bg}</TableCell>
              <TableCell className="font-mono text-xs text-zinc-600">{r.slug}</TableCell>
              <TableCell>{r.name_en}</TableCell>
              <TableCell>{r.sort_order}</TableCell>
              <TableCell className="text-right">
                <div className="relative inline-flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/categories/${r.id}`}>
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
