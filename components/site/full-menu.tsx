import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PriceDisplay } from "@/components/price-display";
import { t } from "@/lib/locale";
import { imgUrl } from "@/lib/utils";
import type { Category, MenuItem } from "@/types/db";

type Group = { category: Category; items: MenuItem[] };

export async function FullMenu({
  groups,
  locale,
}: {
  groups: Group[];
  locale: string;
}) {
  const tMenu = await getTranslations("menu");
  const tSec = await getTranslations("sections");

  return (
    <section id="menu" className="scroll-mt-20 border-t border-brand/15 bg-surface-elevated py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-10 text-2xl font-semibold text-brand">{tSec("menu")}</h2>
        <div className="flex flex-col gap-12">
          {groups.map(({ category, items }) => (
            <div key={category.id}>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-brand/30 bg-surface-card">
                  <Image
                    src={imgUrl(category.image_url, category.id)}
                    alt={t(locale, category.name_bg, category.name_en)}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <h3 className="text-xl font-medium text-brand-light">
                  {t(locale, category.name_bg, category.name_en)}
                </h3>
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-zinc-500">{tMenu("empty")}</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-baseline justify-between gap-4 border-b border-brand/15 pb-4"
                    >
                      <div>
                        <p className="font-medium">
                          {t(locale, item.name_bg, item.name_en)}
                        </p>
                        {item.portion_value && item.portion_unit ? (
                          <p className="mt-1 text-xs text-zinc-500">
                            {item.portion_value} {item.portion_unit}
                          </p>
                        ) : null}
                        {(locale === "bg"
                          ? item.description_bg
                          : item.description_en) && (
                          <p className="mt-1 text-sm text-zinc-500">
                            {t(
                              locale,
                              item.description_bg ?? "",
                              item.description_en ?? "",
                            )}
                          </p>
                        )}
                      </div>
                      <PriceDisplay eur={item.price} locale={locale} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
