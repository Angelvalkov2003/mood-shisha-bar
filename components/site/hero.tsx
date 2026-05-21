import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="border-b border-brand/20 bg-ink py-16 text-center sm:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <Image
          src={SITE_LOGO}
          alt={SITE_NAME}
          width={280}
          height={280}
          priority
          className="mx-auto h-28 w-auto max-w-[min(70vw,240px)] object-contain sm:h-32"
        />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand sm:text-5xl">
          {t("name")}
        </h1>
        <p className="mt-4 text-lg text-zinc-300">{t("tagline")}</p>
      </div>
    </section>
  );
}
