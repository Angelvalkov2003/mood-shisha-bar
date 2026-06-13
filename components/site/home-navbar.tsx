"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "@/components/site/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeNavbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "bg" ? "en" : "bg";
  const menuHref = locale === "en" ? "/menu?lang=en" : "/menu";

  const menuBtnClass =
    "border-brand/40 bg-black/25 text-brand-light hover:border-brand/70 hover:bg-brand/10 hover:text-brand-light";

  /** Mobile: equal size, slightly wider/taller than before */
  const mobileNavBtn =
    "h-10 min-w-[4.75rem] px-4 text-sm font-medium sm:h-12 sm:min-w-0 sm:px-6 sm:text-sm";

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-brand/15 bg-ink/35 backdrop-blur-md supports-[backdrop-filter]:bg-ink/25">
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3">
        <Button
          variant="outline"
          size="sm"
          asChild
          className={cn(
            menuBtnClass,
            mobileNavBtn,
            "justify-self-start sm:rounded-md",
          )}
        >
          <a href={menuHref}>{t("menu")}</a>
        </Button>

        <Link
          href="/"
          className="justify-self-center outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <BrandLogo
            showName={false}
            priority
            imageClassName="h-[calc(1.75rem*3)] w-auto max-h-[calc(1.75rem*3)] sm:h-32 sm:max-h-32"
          />
        </Link>

        <Button
          variant="outline"
          size="sm"
          asChild
          className={cn(
            mobileNavBtn,
            "justify-self-end border-brand/25 bg-black/20 text-zinc-300 hover:border-brand/60 hover:bg-brand/10 hover:text-brand sm:min-w-[4.5rem] sm:rounded-md sm:px-5",
          )}
        >
          <Link href={pathname} locale={other}>
            {other.toUpperCase()}
          </Link>
        </Button>
      </div>
    </header>
  );
}
