import { formatPrice } from "@/lib/price";

export function PriceDisplay({
  eur,
  dark = false,
  locale = "bg",
}: {
  eur: number;
  dark?: boolean;
  locale?: string;
}) {
  const { eur: e, bgn } = formatPrice(eur);
  return (
    <span className="inline-flex shrink-0 flex-nowrap items-baseline justify-center gap-1.5 whitespace-nowrap">
      <span
        className={
          dark
            ? "text-sm font-semibold text-amber-200/95"
            : "text-sm font-semibold text-amber-700"
        }
      >
        {e} €
      </span>
      <span
        className={
          dark ? "text-[10px] text-white/45" : "text-[10px] text-zinc-400"
        }
      >
        {bgn} {locale === "en" ? "BGN" : "лв"}
      </span>
    </span>
  );
}
