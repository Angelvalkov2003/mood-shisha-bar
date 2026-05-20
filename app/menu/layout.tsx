import { MenuShell } from "@/components/menu/menu-shell";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#07070c] text-white antialiased">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(90,90,140,0.35),transparent_55%),radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(40,60,90,0.2),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <MenuShell>
        <div className="relative z-10">{children}</div>
      </MenuShell>
    </div>
  );
}
