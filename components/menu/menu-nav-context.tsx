"use client";

import { createContext, useContext } from "react";
import type { MenuGoTarget } from "@/components/menu/menu-shell-types";

export type MenuNavContextValue = {
  go: (target: MenuGoTarget) => void;
  goBack: (href: string) => void;
};

export const MenuNavContext = createContext<MenuNavContextValue | null>(null);

export function useMenuGo() {
  const ctx = useContext(MenuNavContext);
  if (!ctx) throw new Error("useMenuGo must be used within menu layout (MenuShell)");
  return ctx.go;
}

export function useMenuBack() {
  const ctx = useContext(MenuNavContext);
  if (!ctx) throw new Error("useMenuBack must be used within menu layout (MenuShell)");
  return ctx.goBack;
}
