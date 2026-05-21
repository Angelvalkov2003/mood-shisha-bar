"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { tileTransformVars, type TileRect } from "@/lib/menu-transition";

export function MenuTileExpand({
  rect,
  open,
  visible,
  onTransitionEnd,
}: {
  rect: TileRect;
  open: boolean;
  visible: boolean;
  onTransitionEnd?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onTransitionEnd) return;
    const handler = (e: TransitionEvent) => {
      if (e.target !== el || e.propertyName !== "transform") return;
      onTransitionEnd();
    };
    el.addEventListener("transitionend", handler);
    return () => el.removeEventListener("transitionend", handler);
  }, [onTransitionEnd]);

  return (
    <div
      className={cn("menu-expand", visible && "menu-expand--visible")}
      aria-hidden
    >
      <div
        ref={ref}
        className={cn(
          "menu-expand__container",
          open && "menu-expand__container--open",
        )}
        style={tileTransformVars(rect)}
      >
        <div className="menu-expand__inner">
          <Image
            src={SITE_LOGO}
            alt={SITE_NAME}
            width={220}
            height={220}
            className="max-h-[min(45vw,200px)] w-auto object-contain sm:max-h-[220px]"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
