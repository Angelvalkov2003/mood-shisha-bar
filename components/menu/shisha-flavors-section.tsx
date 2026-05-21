import Image from "next/image";
import { imgUrl } from "@/lib/utils";
import type { Shisha } from "@/types/db";

function flavorLists(shisha: Shisha) {
  const availableSet = new Set(shisha.available_flavors);
  const available = [
    ...shisha.all_flavors.filter((f) => availableSet.has(f)),
    ...shisha.available_flavors.filter((f) => !shisha.all_flavors.includes(f)),
  ];
  const unavailable = shisha.all_flavors.filter((f) => !availableSet.has(f));
  return { available, unavailable };
}

export function ShishaFlavorsSection({
  shishas,
  locale = "bg",
}: {
  shishas: Shisha[];
  locale?: string;
}) {
  if (shishas.length === 0) return null;

  const heading = locale === "bg" ? "Нашите вкусове" : "Our flavors";

  return (
    <section className="mt-12 border-t border-brand/25 pt-10">
      <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-brand">
        {heading}
      </h2>
      <ul className="flex flex-col gap-4">
        {shishas.map((shisha) => {
          const { available, unavailable } = flavorLists(shisha);
          return (
            <li key={shisha.id}>
              <article className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-4 overflow-hidden rounded-2xl border border-brand/25 bg-surface-card/80 p-4 shadow-lg backdrop-blur-md sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5">
                  <Image
                    src={imgUrl(shisha.image_url, shisha.id)}
                    alt={shisha.brand}
                    fill
                    className="object-cover"
                    sizes="104px"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-lg font-semibold text-brand-light">{shisha.brand}</h3>
                  {(available.length > 0 || unavailable.length > 0) && (
                    <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 text-sm leading-relaxed">
                      {available.map((flavor) => (
                        <span key={`a-${flavor}`} className="text-white/90">
                          {flavor}
                        </span>
                      ))}
                      {unavailable.map((flavor) => (
                        <span
                          key={`u-${flavor}`}
                          className="text-white/35 line-through decoration-white/25"
                        >
                          {flavor}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
