import Image from "next/image";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";

export function MenuBrandHeader() {
  return (
    <header className="flex flex-col items-center px-4 pt-6 pb-2 text-center">
      <Image
        src={SITE_LOGO}
        alt={SITE_NAME}
        width={200}
        height={200}
        priority
        className="h-24 w-auto max-w-[min(72vw,220px)] object-contain sm:h-28"
      />
      <p className="mt-3 text-sm font-medium tracking-[0.12em] text-brand sm:text-base">
        {SITE_NAME}
      </p>
    </header>
  );
}
