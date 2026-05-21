import Image from "next/image";
import { notFound } from "next/navigation";
import { MenuBackLink } from "@/components/menu/menu-back-link";
import { MenuFoodCard } from "@/components/menu/menu-food-card";
import { MenuBrandFooter } from "@/components/menu/menu-brand-footer";
import { ShishaFlavorsSection } from "@/components/menu/shisha-flavors-section";
import { SITE_NAME } from "@/lib/constants";
import { getCategoryPage, getShishas } from "@/lib/menu-pages";
import { t } from "@/lib/locale";
import { imgUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryPage(slug);
  if (!data) return { title: `Menu | ${SITE_NAME}` };
  const cat = data.category.name_en || data.category.name_bg;
  return { title: `${cat} | ${SITE_NAME}` };
}

export default async function MenuCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = lang === "en" ? "en" : "bg";
  const [data, shishas] = await Promise.all([
    getCategoryPage(slug),
    slug === "nargile" ? getShishas() : Promise.resolve([]),
  ]);
  if (!data) notFound();

  const { category, items } = data;
  const title = t(locale, category.name_bg, category.name_en);
  const q = locale === "en" ? "?lang=en" : "";

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="relative h-[min(42vh,320px)] w-full shrink-0 overflow-hidden">
        <Image
          src={imgUrl(category.image_url, category.id)}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-ink" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <MenuBackLink
            href={`/menu${q}`}
            className="rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm backdrop-blur-md transition hover:bg-black/50"
          >
            ← {locale === "bg" ? "Назад" : "Back"}
          </MenuBackLink>
        </div>
        <h1 className="absolute bottom-6 left-4 right-4 text-3xl font-semibold tracking-tight drop-shadow-lg sm:text-4xl">
          {title}
        </h1>
      </div>

      <section className="mx-auto max-w-lg px-4 pt-8 sm:max-w-2xl">
        {items.length === 0 ? (
          <p className="text-center text-white/50">
            {locale === "bg" ? "Няма ястия." : "No dishes yet."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <MenuFoodCard item={item} locale={locale} />
              </li>
            ))}
          </ul>
        )}
        {slug === "nargile" ? (
          <ShishaFlavorsSection shishas={shishas} locale={locale} />
        ) : null}
      </section>
      <MenuBrandFooter />
    </main>
  );
}
