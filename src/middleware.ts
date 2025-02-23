import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next({
      headers: new Headers(request.headers),
    });
  }

  return createMiddleware({
    locales: ["pl", "en"],
    defaultLocale: "en",
    localePrefix: "as-needed",
  })(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|site\\.webmanifest|.*\\..*).*)"],
};
