import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const SESSION_COOKIE = "tacdent_session";

function getPathnameWithoutLocale(pathname: string): string {
  const match = pathname.match(/^\/(tr|en)(\/.*)?$/);
  if (match) {
    return match[2] ?? "/";
  }
  return pathname;
}

function getLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(tr|en)/);
  return match?.[1] ?? routing.defaultLocale;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);

  if (
    pathWithoutLocale.startsWith("/admin") &&
    pathWithoutLocale !== "/admin/login"
  ) {
    const session = request.cookies.get(SESSION_COOKIE);
    if (!session) {
      const locale = getLocaleFromPathname(pathname);
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Include unprefixed paths (e.g. /services) so next-intl can 307 to /tr|en/...
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
