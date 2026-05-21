"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { slugFromEn } from "@/lib/slug";
import { t } from "@/lib/locale";
import { imgUrl } from "@/lib/utils";
import { useMenuGo } from "@/components/menu/menu-nav-context";
import type { Category } from "@/types/db";

const BUBBLE =
  "h-[11.5rem] w-[11.5rem] shrink-0 sm:h-[12.5rem] sm:w-[12.5rem]";

function catSlug(c: Category) {
  return c.slug || slugFromEn(c.name_en);
}

function layoutRows(cats: Category[]) {
  const rows: { items: Category[]; pair: boolean }[] = [];
  let i = 0;
  let pair = true;
  while (i < cats.length) {
    if (pair) {
      rows.push({ items: cats.slice(i, i + 2), pair: true });
      i += 2;
    } else {
      rows.push({ items: cats.slice(i, i + 1), pair: false });
      i += 1;
    }
    pair = !pair;
  }
  return rows;
}

function bubbleLabel(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 2) {
    return (
      <>
        <span className="block">{words[0]}</span>
        <span className="block">{words[1]}</span>
      </>
    );
  }
  return name;
}

export function CategoryBubbles({
  categories,
  locale = "bg",
}: {
  categories: Category[];
  locale?: string;
}) {
  const go = useMenuGo();
  let idx = 0;

  return (
    <div className="menu-bubbles-root mx-auto flex max-w-2xl flex-col items-center gap-y-3 px-2 transition-transform sm:gap-y-4">
      {layoutRows(categories).map((row, ri) => (
        <ul
          key={ri}
          className={`flex justify-center gap-x-8 sm:gap-x-10 ${
            row.pair ? "" : "w-full"
          }`}
        >
          {row.items.map((cat) => {
            const slug = catSlug(cat);
            const name = t(locale, cat.name_bg, cat.name_en);
            const i = idx++;
            const src = imgUrl(cat.image_url, cat.id);
            return (
              <li key={cat.id}>
                <motion.button
                  type="button"
                  aria-label={name}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    go({ slug, imageUrl: src, rect });
                  }}
                  className={`${BUBBLE} rounded-full shadow-[0_0_0_1px_rgba(189,156,77,0.35),0_12px_32px_rgba(0,0,0,0.55),0_0_50px_rgba(189,156,77,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    opacity: { duration: 0.2 },
                    scale: { delay: i * 0.05, duration: 0.5 },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative block h-full w-full overflow-hidden rounded-full border border-brand/40 bg-white/5 backdrop-blur-md">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover brightness-110 contrast-[1.02] saturate-110"
                      sizes="(max-width: 640px) 184px, 200px"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 bg-white/5" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent pt-8" />
                    <span className="absolute inset-x-0 bottom-0 max-w-full px-2 pb-2 text-center text-[10px] font-medium leading-[1.15] tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-[11px]">
                      {bubbleLabel(name)}
                    </span>
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
