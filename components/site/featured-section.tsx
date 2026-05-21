import { getTranslations } from "next-intl/server";
import { MenuItemCard } from "@/components/site/menu-item-card";
import type { MenuItem } from "@/types/db";

export async function FeaturedSection({
  items,
  locale,
}: {
  items: MenuItem[];
  locale: string;
}) {
  const t = await getTranslations("sections");
  if (!items.length) return null;

  return (
    <section className="border-t border-brand/15 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-8 text-2xl font-semibold text-brand">{t("featured")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
