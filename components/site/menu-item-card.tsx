import Image from "next/image";
import { PriceDisplay } from "@/components/price-display";
import { t } from "@/lib/locale";
import { imgUrl } from "@/lib/utils";
import type { MenuItem } from "@/types/db";

export function MenuItemCard({
  item,
  locale,
}: {
  item: MenuItem;
  locale: string;
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
    <article className="overflow-hidden rounded-lg border border-brand/25 bg-surface-card">
      <div className="relative aspect-[4/3] bg-surface-elevated">
        <Image
          src={imgUrl(item.image_url, item.id)}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-zinc-100">{name}</h3>
            {portion ? <p className="text-xs text-zinc-400">{portion}</p> : null}
          </div>
          <PriceDisplay eur={item.price} locale={locale} />
        </div>
        {desc ? <p className="mt-2 text-sm text-zinc-400">{desc}</p> : null}
      </div>
    </article>
  );
}
