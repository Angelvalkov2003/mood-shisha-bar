import { MenuLayoutClient } from "@/components/menu/menu-layout-client";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MenuLayoutClient>{children}</MenuLayoutClient>;
}
