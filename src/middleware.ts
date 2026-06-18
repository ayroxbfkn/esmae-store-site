import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createMiddleware(routing);

const adminPaths = ["/admin"];
const authPaths = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for path checks
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en|fr)/, "");

  const isAdminPath = adminPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isAuthPath = authPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isAdminPath || isAuthPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const locale = pathname.split("/")[1] || "ar";
      return NextResponse.redirect(
        new URL(`/${locale}/sign-in?callbackUrl=${pathname}`, request.url)
      );
    }

    if (isAdminPath) {
      const role = token.role as string;
      if (role !== "SUPER_ADMIN" && role !== "STAFF") {
        const locale = pathname.split("/")[1] || "ar";
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
