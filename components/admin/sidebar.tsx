"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  UtensilsCrossed,
  LogOut,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin/menu-items", label: "Menu items", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/posters", label: "Posters", icon: ImageIcon },
];

export function AdminSidebar() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-amber-100 bg-white px-3 py-2 md:hidden">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-amber-900">Admin</p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bg" target="_blank">
                <ExternalLink className="h-4 w-4" />
                View site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm",
                path === href
                  ? "bg-amber-50 font-medium text-amber-900"
                  : "text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <aside className="hidden w-56 flex-col border-r border-amber-100 bg-white p-4 md:flex">
        <p className="mb-6 text-lg font-semibold text-amber-900">Admin</p>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                path === href
                  ? "bg-amber-50 font-medium text-amber-900"
                  : "text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" size="sm" className="mb-2 justify-start" asChild>
          <Link href="/bg" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            View site
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={logout} className="justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </aside>
    </>
  );
}
