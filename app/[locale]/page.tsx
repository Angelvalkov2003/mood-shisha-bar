import { setRequestLocale } from "next-intl/server";
import { HomeFooter } from "@/components/site/home-footer";
import { HomeGallery } from "@/components/site/home-gallery";
import { HomeHero } from "@/components/site/home-hero";
import { HomeInfo } from "@/components/site/home-info";
import { HomeNavbar } from "@/components/site/home-navbar";
import { HomeShell } from "@/components/site/home-shell";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HomeShell>
      <HomeNavbar />
      <main className="overflow-x-clip">
        {/* Desktop: black band at top, then hero photo (navbar stays transparent over it) */}
        <div
          className="hidden h-[9.5rem] shrink-0 bg-ink sm:block"
          aria-hidden
        />
        <HomeHero />
        <HomeInfo />
        <HomeGallery />
      </main>
      <HomeFooter />
    </HomeShell>
  );
}
