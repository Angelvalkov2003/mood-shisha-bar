"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "bg" ? "en" : "bg";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-zinc-900">
          {t("home")}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#menu" className="text-zinc-600 hover:text-zinc-900">
            {t("menu")}
          </a>
          <a href="#contact" className="text-zinc-600 hover:text-zinc-900">
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
