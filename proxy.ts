import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // const cookie = request.cookies.get("sb-session")?.value;

  // let user: any = null;
  // let roles: string[] = [];

  // // ----------------------------------
  // // DECODE BASE64 SESSION COOKIE
  // // ----------------------------------
  // if (cookie) {
  //   try {
  //     const decoded = JSON.parse(
  //       Buffer.from(cookie, "base64").toString("utf-8"),
  //     );

  //     // store user + roles in cookie at login
  //     user = decoded.user || null;
  //     roles = decoded.user?.app_metadata?.roles || [];
  //   } catch (err) {
  //     console.log("Invalid session cookie");
  //   }
  // }

  // console.log("user", user, roles);
  // const isAuthPage = pathname.startsWith("/auth");
  // const isAdminPage = pathname.startsWith("/admin");
  // const isHousekeepingPage = pathname.startsWith("/housekeeping");

  // ----------------------------------
  // ROOT REDIRECT
  // ----------------------------------
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/guest", request.url));
  }

  // // ----------------------------------
  // // NOT AUTHENTICATED GUARD
  // // ----------------------------------
  // if (!user && !isAuthPage) {
  //   return NextResponse.redirect(new URL("/auth", request.url));
  // }

  // // ----------------------------------
  // // BLOCK AUTH PAGE IF LOGGED IN
  // // ----------------------------------
  // if (isAuthPage && user) {
  //   if (roles.includes("admin")) {
  //     return NextResponse.redirect(new URL("/admin", request.url));
  //   }

  //   if (roles.includes("housekeeping")) {
  //     return NextResponse.redirect(new URL("/housekeeping", request.url));
  //   }
  // }

  // ----------------------------------
  // ADMIN ROLE GUARD
  // ----------------------------------
  // if (isAdminPage && !roles.includes("admin")) {
  //   return NextResponse.redirect(new URL("/auth", request.url));
  // }

  // ----------------------------------
  // HOUSEKEEPING ROLE GUARD
  // ----------------------------------
  // if (isHousekeepingPage && !roles.includes("housekeeping")) {
  //   return NextResponse.redirect(new URL("/auth", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/housekeeping/:path*", "/auth/:path*"],
};
