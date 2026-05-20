import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="bg-white py-20 text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          {t("name")}
        </h1>
        <p className="mt-4 text-lg text-zinc-600">{t("tagline")}</p>
      </div>
    </section>
  );
}
