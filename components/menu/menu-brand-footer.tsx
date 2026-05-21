import Image from "next/image";
import { SocialLinks } from "@/components/site/social-links";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";

export function MenuBrandFooter() {
  return (
    <footer className="mt-auto flex flex-col items-center px-4 pt-10 pb-8 text-center">
      <Image
        src={SITE_LOGO}
        alt={SITE_NAME}
        width={200}
        height={200}
        className="h-20 w-auto max-w-[min(65vw,200px)] object-contain sm:h-24"
      />
      <SocialLinks className="mt-4" iconClassName="h-7 w-7 text-brand transition hover:opacity-80" />
    </footer>
  );
}
