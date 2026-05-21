"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "@/components/site/brand-logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "bg" ? "en" : "bg";

  return (
    <header className="sticky top-0 z-40 border-b border-brand/30 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-brand-light">
          <BrandLogo
            priority
            nameClassName="text-brand-light sm:text-base"
            imageClassName="h-9 w-9 sm:h-10 sm:w-10"
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#menu" className="text-zinc-300 transition hover:text-brand">
            {t("menu")}
          </a>
          <a href="#contact" className="text-zinc-300 transition hover:text-brand">
            {t("contact")}
          </a>
          <Button variant="outline" size="sm" asChild>
            <Link href={pathname} locale={other}>
              {other.toUpperCase()}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
