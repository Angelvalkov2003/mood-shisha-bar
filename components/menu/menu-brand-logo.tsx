import Image from "next/image";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";

export function MenuBrandLogo() {
  return (
    <div className="flex flex-col items-center px-4 pb-2 pt-4 text-center sm:pt-6">
      <Image
        src={SITE_LOGO}
        alt={SITE_NAME}
        width={200}
        height={200}
        priority
        className="max-h-24 w-auto max-w-[min(72vw,220px)] object-contain sm:max-h-28"
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
}
