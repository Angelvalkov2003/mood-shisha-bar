"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HOME_GALLERY_PHOTOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Every 4th image is wide on md+ screens. */
function galleryClass(i: number) {
  const wide = i % 4 === 0;
  return cn(
    "relative shrink-0 snap-center overflow-hidden rounded-2xl border border-brand/25 bg-[#0a0a0a] shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
    "w-[78vw] max-w-[320px] aspect-[3/4]",
    "sm:w-[42vw] sm:max-w-none",
    "md:w-auto md:aspect-auto md:h-auto",
    wide
      ? "md:col-span-2 md:aspect-[16/10]"
      : "md:col-span-1 md:aspect-[4/5]",
  );
}

export function HomeGallery() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden border-t border-brand/20 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(189,156,77,0.12),transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center sm:mb-12"
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand">
            {t("galleryEyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-light sm:text-3xl">
            {t("galleryTitle")}
          </h2>
        </motion.div>

        {/* Mobile: horizontal snap scroll — no cropped overlap */}
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none md:hidden">
          {HOME_GALLERY_PHOTOS.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className={galleryClass(i)}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="78vw"
                loading={i < 3 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}
        </div>

        {/* Desktop: clean grid — each cell owns its aspect ratio */}
        <div className="hidden gap-3 md:grid md:grid-cols-4">
          {HOME_GALLERY_PHOTOS.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: (i % 4) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(galleryClass(i), "group")}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1200px) 25vw, 280px"
                loading={i < 4 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-brand/10 transition group-hover:ring-brand/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
