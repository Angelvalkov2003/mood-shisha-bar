import { getTranslations } from "next-intl/server";
import { SITE_NAME } from "@/lib/constants";

export async function HomeFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-brand/20 py-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-brand/60">{SITE_NAME}</p>
      <p className="mt-2 text-sm text-zinc-500">
        {t("copy", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
