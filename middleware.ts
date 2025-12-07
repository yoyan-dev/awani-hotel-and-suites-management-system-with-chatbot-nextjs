import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  // const supabase = createMiddlewareClient({ req, res });
  // const { data, error } = await supabase.auth.getSession();

  // console.log("Middleware user:", data, "Error:", error);

  const { pathname } = req.nextUrl;

  // redirect root to guest
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/guest", req.url));
  }

  // prevent logged in user from visiting /auth
  // if (pathname.startsWith("/auth") && user) {
  //   let redirectTo = "/guest";
  //   // const roles = user.app_metadata?.roles || user.user_metadata?.roles;

  //   // if (roles?.includes("admin")) {
  //   //   redirectTo = "/admin";
  //   // } else if (roles?.includes("housekeeping")) {
  //   //   redirectTo = "/housekeeping";
  //   // }

  //   return NextResponse.redirect(new URL(redirectTo, req.url));
  // }

  // route protections
  // if (pathname.startsWith("/admin")) {
  //   if (
  //     !user ||
  //     !(user.app_metadata?.roles || user.user_metadata?.roles)?.includes(
  //       "admin"
  //     )
  //   ) {
  //     return NextResponse.redirect(new URL("/auth", req.url));
  //   }
  // }

  // if (pathname.startsWith("/housekeeping")) {
  //   if (
  //     !user ||
  //     !(user.app_metadata?.roles || user.user_metadata?.roles)?.includes(
  //       "housekeeping"
  //     )
  //   ) {
  //     return NextResponse.redirect(new URL("/auth", req.url));
  //   }
  // }

  return res;
}

export const config = {
  matcher: ["/", "/auth", "/admin/:path*", "/housekeeping/:path*"],
};
