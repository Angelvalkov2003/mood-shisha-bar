"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  VENUE_HOURS,
  VENUE_MAPS_URL,
  VENUE_PHONE,
  VENUE_PHONE_HREF,
} from "@/lib/constants";
import { SocialLinks } from "@/components/site/social-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cardMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function InfoCard({
  icon: Icon,
  title,
  children,
  className,
  delay = 0,
}: {
  icon: typeof Clock;
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...cardMotion}
      transition={{ ...cardMotion.transition, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand/30 p-6",
        "bg-gradient-to-br from-[#1a1510] via-[#121212] to-[#0a0a0a]",
        "shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(189,156,77,0.12)]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/10 blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-full border border-brand/40 bg-brand/15 p-2.5">
          <Icon className="h-5 w-5 text-brand" aria-hidden />
        </div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-brand/90">
          {title}
        </h3>
        <div className="mt-3">{children}</div>
      </div>
    </motion.div>
  );
}

export function HomeInfo() {
  const t = useTranslations("home");
  const locale = useLocale();
  const address =
    locale === "bg"
      ? "Варна, ул. „Княз Борис I“ 60"
      : "Varna, 60 Knyaz Boris I St";

  return (
    <section className="relative overflow-hidden border-t border-brand/25 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(189,156,77,0.08)_0%,transparent_40%,rgba(189,156,77,0.05)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,480px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div {...cardMotion} className="mb-12 text-center sm:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-brand">
            {t("visitEyebrow")}
          </p>
          <h2 className="mt-4 bg-gradient-to-r from-brand-light via-brand to-brand-dark bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            {t("visitTitle")}
          </h2>
          <div
            className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-brand to-transparent"
            aria-hidden
          />
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={Clock} title={t("hoursTitle")} delay={0.05}>
            <p className="text-sm text-zinc-400">{t("hoursEveryDay")}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
              {VENUE_HOURS}
            </p>
          </InfoCard>

          <InfoCard
            icon={MapPin}
            title={t("addressTitle")}
            delay={0.1}
            className="sm:col-span-2 lg:col-span-1"
          >
            <p className="text-sm leading-relaxed text-zinc-200">{address}</p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mt-4 border-brand/50 bg-brand/10 text-brand-light hover:bg-brand/20"
            >
              <a href={VENUE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                {t("openMaps")}
              </a>
            </Button>
          </InfoCard>

          <InfoCard
            icon={Phone}
            title={t("phoneTitle")}
            delay={0.15}
            className="sm:col-span-2 lg:col-span-1"
          >
            <a
              href={VENUE_PHONE_HREF}
              className="block text-2xl font-semibold tabular-nums text-white transition hover:text-brand"
            >
              {VENUE_PHONE}
            </a>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild className="bg-brand text-ink shadow-lg shadow-brand/20 hover:bg-brand-dark">
                <a href={VENUE_PHONE_HREF}>{t("bookNow")}</a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-brand/50 bg-transparent text-brand-light hover:bg-brand/10"
              >
                <a href={VENUE_PHONE_HREF}>{t("call")}</a>
              </Button>
            </div>
          </InfoCard>
        </div>

        <motion.a
          href={VENUE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          {...cardMotion}
          transition={{ ...cardMotion.transition, delay: 0.18 }}
          className="group mt-5 block overflow-hidden rounded-2xl border border-brand/30 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          aria-label={t("openMaps")}
        >
          <div className="relative aspect-[16/8] min-h-[200px] w-full sm:aspect-[21/8]">
            <iframe
              title={t("addressTitle")}
              src="https://maps.google.com/maps?q=Knyaz+Boris+I+60,+Varna,+Bulgaria&z=16&output=embed"
              className="pointer-events-none absolute inset-0 h-full w-full border-0 opacity-90 transition duration-500 group-hover:opacity-100"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-brand/5 transition group-hover:from-ink/40" />
          </div>
        </motion.a>

        <motion.div
          {...cardMotion}
          transition={{ ...cardMotion.transition, delay: 0.22 }}
          className="mt-10 rounded-2xl border border-brand/25 bg-gradient-to-b from-brand/10 to-transparent px-6 py-9 text-center"
        >
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-brand/80">
            {t("followUs")}
          </p>
          <SocialLinks iconClassName="h-8 w-8 text-brand transition hover:scale-110 hover:text-brand-light" />
        </motion.div>
      </div>
    </section>
  );
}
