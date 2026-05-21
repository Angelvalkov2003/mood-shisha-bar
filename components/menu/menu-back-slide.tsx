"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SlidePhase = "active" | "left" | "right";

const PHASE_CLASS: Record<SlidePhase, string> = {
  active: "menu-page--active",
  left: "menu-page--left",
  right: "menu-page--right",
};

export type MenuBackSlideState = {
  outPhase: SlidePhase;
  inPhase: SlidePhase;
  /** Both panels animating (after /menu is active). */
  started: boolean;
};

export function MenuBackLayers({
  state,
  isMenu,
  busy,
  children,
  onIncomingEnd,
}: {
  state: MenuBackSlideState | null;
  isMenu: boolean;
  busy: boolean;
  children: ReactNode;
  onIncomingEnd: () => void;
}) {
  const inRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
  }, [state?.started]);

  useEffect(() => {
    if (!state?.started || state.inPhase !== "active" || doneRef.current) return;
    const el = inRef.current;
    if (!el) return;

    const finish = (e: TransitionEvent) => {
      if (e.target !== el || e.propertyName !== "transform") return;
      doneRef.current = true;
      onIncomingEnd();
    };

    el.addEventListener("transitionend", finish);
    const fallback = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onIncomingEnd();
      }
    }, 500);

    return () => {
      el.removeEventListener("transitionend", finish);
      window.clearTimeout(fallback);
    };
  }, [state?.started, state?.inPhase, onIncomingEnd]);

  const inPhase =
    state && !isMenu ? "active" : (state?.inPhase ?? "active");
  const showCurtain = Boolean(state && isMenu);

  return (
    <div className="menu-pages">
      {showCurtain ? (
        <div
          className={cn(
            "menu-page menu-page--out",
            PHASE_CLASS[state!.outPhase],
          )}
          aria-hidden
        >
          <div className="menu-back-curtain" />
        </div>
      ) : null}
      <div
        ref={inRef}
        className={cn(
          "menu-page",
          state && isMenu && "menu-page--in",
          PHASE_CLASS[inPhase],
        )}
        style={{ pointerEvents: busy ? "none" : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
