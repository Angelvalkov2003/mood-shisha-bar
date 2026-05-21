import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { FeaturedSection } from "@/components/site/featured-section";
import { FullMenu } from "@/components/site/full-menu";
import { ContactForm } from "@/components/site/contact-form";
import { SocialLinks } from "@/components/site/social-links";
import { PostersSection } from "@/components/site/posters-section";
import { getMenuData } from "@/lib/menu-data";
import { supabase } from "@/lib/supabase";
import type { Poster } from "@/types/db";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { featured, byCat } = await getMenuData();
  const { data: posterData } = await supabase
    .from("posters")
    .select("*")
    .order("sort_order", { ascending: false });
  const posters = (posterData ?? []) as Poster[];
  const t = await getTranslations("sections");
  const tf = await getTranslations("footer");

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PostersSection locale={locale} posters={posters} />
        <FeaturedSection items={featured} locale={locale} />
        <FullMenu groups={byCat} locale={locale} />
        <section id="contact" className="scroll-mt-20 border-t border-brand/15 py-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <h2 className="mb-8 text-2xl font-semibold text-brand">{t("contact")}</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="border-t border-brand/25 py-8 text-center">
        <SocialLinks className="mb-4" />
        <p className="text-sm text-zinc-400">
          {tf("copy", { year: new Date().getFullYear() })}
        </p>
      </footer>
    </>
  );
}
