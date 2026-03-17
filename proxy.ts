import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const roles = Array.isArray(token?.roles) ? token.roles : [];
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isFrontOfficePage = pathname.startsWith("/front-office");
  const isHousekeepingPage = pathname.startsWith("/housekeeping");

  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/guest", request.url));
    }

    if (roles.includes("admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (roles.includes("front_office")) {
      return NextResponse.redirect(new URL("/front-office", request.url));
    }

    if (roles.includes("housekeeping")) {
      return NextResponse.redirect(new URL("/housekeeping", request.url));
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if ((isAdminPage || isFrontOfficePage || isHousekeepingPage) && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthPage && token) {
    if (roles.includes("admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (roles.includes("front_office")) {
      return NextResponse.redirect(new URL("/front-office", request.url));
    }

    if (roles.includes("housekeeping")) {
      return NextResponse.redirect(new URL("/housekeeping", request.url));
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if (isAdminPage && !roles.includes("admin")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isFrontOfficePage && !roles.includes("front_office")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isHousekeepingPage && !roles.includes("housekeeping")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/front-office/:path*",
    "/housekeeping/:path*",
    "/auth/:path*",
  ],
};
