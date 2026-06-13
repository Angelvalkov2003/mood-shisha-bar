import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HOME_HERO_PHOTO } from "@/lib/constants";
import { HomeHeroContent } from "@/components/site/home-hero-content";

export async function HomeHero() {
  const t = await getTranslations("home");

  return (
    <section className="relative flex min-h-[min(92dvh,900px)] flex-col justify-end overflow-hidden sm:min-h-[min(80dvh,760px)]">
      <Image
        src={HOME_HERO_PHOTO}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(189,156,77,0.18),transparent)]" />

      <HomeHeroContent tagline={t("tagline")} subtitle={t("subtitle")} />
    </section>
  );
}
