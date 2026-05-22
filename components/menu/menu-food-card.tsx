import Image from "next/image";
import { PriceDisplay } from "@/components/price-display";
import { t } from "@/lib/locale";
import { cn, imageSrc } from "@/lib/utils";
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
  const src = imageSrc(item.image_url);

  return (
    <article
      className={cn(
        "grid items-center gap-3 overflow-hidden rounded-2xl border border-brand/25 bg-surface-card/80 p-3 shadow-lg backdrop-blur-md sm:gap-4 sm:p-4",
        src
          ? "grid-cols-[minmax(0,1fr)_minmax(7.25rem,auto)_5.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)_6rem]"
          : "grid-cols-[minmax(0,1fr)_minmax(7.25rem,auto)] sm:grid-cols-[minmax(0,1fr)_minmax(8rem,auto)]",
      )}
    >
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

      {src ? (
        <div className="relative h-[5.5rem] w-full max-w-[5.5rem] shrink-0 justify-self-end overflow-hidden rounded-xl bg-white/5 sm:h-24 sm:max-w-24">
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : null}
    </article>
  );
}
