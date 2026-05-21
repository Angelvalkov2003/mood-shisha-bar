import Link from "next/link";
import { MenuBrandHeader } from "@/components/menu/menu-brand-header";
import { CategoryBubbles } from "@/components/menu/category-bubbles";
import { SITE_NAME } from "@/lib/constants";
import { getCategories } from "@/lib/menu-pages";

export const metadata = {
  title: `Menu | ${SITE_NAME}`,
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "bg";
  const categories = await getCategories();

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-10 pt-2 sm:pt-4">
      <MenuBrandHeader />
      <header className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand/70">
          {locale === "bg" ? "Меню" : "Menu"}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-brand-light sm:text-3xl">
          {locale === "bg" ? "Изберете категория" : "Choose a category"}
        </h1>
        <div className="mt-4 flex justify-center gap-2 text-sm">
          <Link
            href="/menu?lang=bg"
            className={
              locale === "bg"
                ? "text-brand"
                : "text-white/40 hover:text-brand"
            }
          >
            BG
          </Link>
          <span className="text-white/20">·</span>
          <Link
            href="/menu?lang=en"
            className={
              locale === "en"
                ? "text-brand"
                : "text-white/40 hover:text-brand"
            }
          >
            EN
          </Link>
        </div>
      </header>

      {categories.length === 0 ? (
        <p className="text-center text-white/50">No categories yet.</p>
      ) : (
        <CategoryBubbles categories={categories} locale={locale} />
      )}
    </main>
  );
}
