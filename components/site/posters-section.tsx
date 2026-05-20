import Image from "next/image";
import { t } from "@/lib/locale";
import { imgUrl } from "@/lib/utils";
import type { Poster } from "@/types/db";

export function PostersSection({
  locale,
  posters,
}: {
  locale: string;
  posters: Poster[];
}) {
  if (!posters.length) return null;

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {posters.map((p) => {
            const image = locale === "bg" ? p.image_bg : p.image_en;
            const text = t(locale, p.text_bg ?? "", p.text_en ?? "");
            const link = locale === "bg" ? p.link_bg : p.link_en;
            const card = (
              <article className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={imgUrl(image, `poster-${p.id}`)}
                    alt={text || "Poster"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {text ? <p className="p-3 text-sm">{text}</p> : null}
              </article>
            );
            return link ? (
              <a key={p.id} href={link} target="_blank" rel="noreferrer">
                {card}
              </a>
            ) : (
              <div key={p.id}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
