"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { MenuNavContext } from "@/components/menu/menu-nav-context";
import type { MenuGoTarget } from "@/components/menu/menu-shell-types";
import {
  MenuBackLayers,
  type MenuBackSlideState,
} from "@/components/menu/menu-back-slide";
import { MenuTileExpand } from "@/components/menu/menu-tile-expand";
import {
  clearExpandOrigin,
  saveExpandOrigin,
  setNavDir,
  type StoredExpandOrigin,
} from "@/lib/menu-transition";

export type { MenuGoTarget } from "@/components/menu/menu-shell-types";

export function MenuShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [backSlide, setBackSlide] = useState<MenuBackSlideState | null>(null);
  const [busy, setBusy] = useState(false);
  const [expand, setExpand] = useState<StoredExpandOrigin | null>(null);
  const [expandOpen, setExpandOpen] = useState(false);
  const [expandVisible, setExpandVisible] = useState(false);
  const pendingHref = useRef<string | null>(null);
  const expandTargetPath = useRef<string | null>(null);
  const expandDone = useRef(false);
  const busyLock = useRef(false);
  const backTimers = useRef<number[]>([]);

  const setMenuExpandActive = (on: boolean) => {
    document.documentElement.classList.toggle("menu-expand-active", on);
  };

  const clearBackTimers = useCallback(() => {
    backTimers.current.forEach((id) => window.clearTimeout(id));
    backTimers.current = [];
  }, []);

  const finishBack = useCallback(() => {
    clearBackTimers();
    setBackSlide(null);
    busyLock.current = false;
    setBusy(false);
    document.documentElement.classList.remove("menu-slide-active");
    clearExpandOrigin();
  }, [clearBackTimers]);

  const clearExpand = useCallback(() => {
    setExpandVisible(false);
    setExpand(null);
    setExpandOpen(false);
    setMenuExpandActive(false);
    pendingHref.current = null;
    expandTargetPath.current = null;
  }, []);

  const onExpandOpenEnd = useCallback(() => {
    if (!pendingHref.current || expandDone.current) return;
    expandDone.current = true;
    const href = pendingHref.current;
    pendingHref.current = null;
    setNavDir("forward");
    router.push(href);
  }, [router]);

  const startExpandOpen = useCallback(
    (origin: StoredExpandOrigin, href: string) => {
      expandDone.current = false;
      pendingHref.current = href;
      expandTargetPath.current = href.split("?")[0] ?? href;
      saveExpandOrigin(origin);
      setMenuExpandActive(true);
      setExpand(origin);
      setExpandVisible(true);
      setExpandOpen(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setExpandOpen(true));
      });

      const fallback = window.setTimeout(onExpandOpenEnd, 450);
      backTimers.current.push(fallback);
    },
    [onExpandOpenEnd],
  );

  const goBack = useCallback(
    (href: string) => {
      if (busyLock.current) return;
      busyLock.current = true;
      setBusy(true);
      clearExpandOrigin();
      clearBackTimers();
      document.documentElement.classList.add("menu-slide-active");

      setBackSlide({
        outPhase: "active",
        inPhase: "left",
        started: false,
      });

      setNavDir("back");
      router.push(href);
    },
    [router, clearBackTimers],
  );

  const go = useCallback(
    (target: MenuGoTarget) => {
      if (busyLock.current) return;
      busyLock.current = true;
      setBusy(true);
      const q = typeof window !== "undefined" ? window.location.search : "";
      const href = `/menu/${target.slug}${q}`;
      startExpandOpen(
        {
          top: target.rect.top,
          left: target.rect.left,
          width: target.rect.width,
          height: target.rect.height,
          imageUrl: target.imageUrl,
        },
        href,
      );
    },
    [startExpandOpen],
  );

  const isMenu = pathname === "/menu";

  useLayoutEffect(() => {
    const target = expandTargetPath.current;
    if (!expand || !target || pathname !== target) return;
    clearExpand();
    clearExpandOrigin();
    busyLock.current = false;
    setBusy(false);
  }, [pathname, expand, clearExpand]);

  useLayoutEffect(() => {
    if (!expand) return;
    const safety = window.setTimeout(() => {
      clearExpand();
      busyLock.current = false;
      setBusy(false);
    }, 4000);
    return () => window.clearTimeout(safety);
  }, [expand, clearExpand]);

  useLayoutEffect(() => {
    if (!backSlide || !isMenu || backSlide.started) return;

    setBackSlide((s) => (s ? { ...s, started: true } : s));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBackSlide((s) =>
          s ? { ...s, outPhase: "right", inPhase: "active" } : s,
        );
      });
    });
  }, [backSlide, isMenu]);

  return (
    <MenuNavContext.Provider value={{ go, goBack }}>
      {expand ? (
        <MenuTileExpand
          rect={expand}
          open={expandOpen}
          visible={expandVisible}
          onTransitionEnd={onExpandOpenEnd}
        />
      ) : null}

      <MenuBackLayers
        state={backSlide}
        isMenu={isMenu}
        busy={busy}
        onIncomingEnd={finishBack}
      >
        {children}
      </MenuBackLayers>
    </MenuNavContext.Provider>
  );
}
