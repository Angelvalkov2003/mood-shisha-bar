import Image from "next/image";
import { PriceDisplay } from "@/components/price-display";
import { t } from "@/lib/locale";
import { imgUrl } from "@/lib/utils";
import type { MenuItem } from "@/types/db";

export function MenuFoodCard({
  item,
  locale = "bg",
}: {
  item: MenuItem;
  locale?: string;
}) {
  const name = t(locale, item.name_bg, item.name_en);
  const desc = t(
    locale,
    item.description_bg ?? "",
    item.description_en ?? "",
  );
  const portion =
    item.portion_value && item.portion_unit
      ? `${item.portion_value} ${item.portion_unit}`
      : null;

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_minmax(7.25rem,auto)_5.5rem] items-center gap-3 overflow-hidden rounded-2xl border border-brand/25 bg-surface-card/80 p-3 shadow-lg backdrop-blur-md sm:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)_6rem] sm:gap-4 sm:p-4">
      <div className="min-w-0">
        <h3 className="font-medium text-white">{name}</h3>
        {desc ? (
          <p className="mt-1 text-sm leading-snug text-white/55">{desc}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-2 text-center">
        <PriceDisplay eur={item.price} dark locale={locale} />
        {portion ? (
          <p className="whitespace-nowrap text-xs text-white/50">{portion}</p>
        ) : null}
      </div>

      <div className="relative h-[5.5rem] w-full max-w-[5.5rem] shrink-0 justify-self-end overflow-hidden rounded-xl bg-white/5 sm:h-24 sm:max-w-24">
        <Image
          src={imgUrl(item.image_url, item.id)}
          alt={name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    </article>
  );
}
