import Image from "next/image";
import { SITE_LOGO, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  showName?: boolean;
  className?: string;
  imageClassName?: string;
  nameClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  showName = true,
  className,
  imageClassName,
  nameClassName,
  priority,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={SITE_LOGO}
        alt={SITE_NAME}
        width={160}
        height={160}
        priority={priority}
        className={cn("h-10 w-10 shrink-0 object-contain", imageClassName)}
      />
      {showName ? (
        <span className={cn("font-semibold leading-tight", nameClassName)}>
          {SITE_NAME}
        </span>
      ) : null}
    </span>
  );
}
