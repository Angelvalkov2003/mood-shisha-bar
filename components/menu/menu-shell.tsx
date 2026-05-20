"use client";

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

const Ctx = createContext<((slug: string) => void) | null>(null);

export function useMenuGo() {
  const go = useContext(Ctx);
  if (!go) throw new Error("useMenuGo outside MenuShell");
  return go;
}

export function MenuShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  const go = useCallback(
    (slug: string) => {
      const q =
        typeof window !== "undefined" ? window.location.search : "";
      router.push(`/menu/${slug}${q}`);
    },
    [router],
  );

  return <Ctx.Provider value={go}>{children}</Ctx.Provider>;
}
