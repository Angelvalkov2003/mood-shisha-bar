"use client";

import { useMenuBack } from "@/components/menu/menu-nav-context";

export function MenuBackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const goBack = useMenuBack();

  return (
    <button type="button" onClick={() => goBack(href)} className={className}>
      {children}
    </button>
  );
}
