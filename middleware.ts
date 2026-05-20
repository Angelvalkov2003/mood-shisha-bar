import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ADMIN_COOKIE } from "./lib/constants";

const intl = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) return NextResponse.next();

  if (pathname.startsWith("/menu")) return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (req.cookies.get(ADMIN_COOKIE)?.value === "1") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return intl(req);
}

export const config = {
  matcher: [
    "/",
    "/(bg|en)",
    "/(bg|en)/:path*",
    "/admin/:path*",
    "/menu",
    "/menu/:path*",
  ],
};
