import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function proxy(req: NextRequest) {
  let res = NextResponse.next();
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log("Middleware user:", session, "Error:", error);
  const user = session?.user;
  const { pathname } = req.nextUrl;

  // redirect root to guest
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/guest", req.url));
  }

  // prevent logged in user from visiting /auth
  if (pathname.startsWith("/auth") && user) {
    let redirectTo = "/auth";
    const roles = user.app_metadata?.roles || user.user_metadata?.roles;

    if (roles?.includes("admin")) {
      redirectTo = "/admin";
    } else if (roles?.includes("housekeeping")) {
      redirectTo = "/housekeeping";
    }

    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // route protections
  if (pathname.startsWith("/admin")) {
    if (
      !user ||
      !(user.app_metadata?.roles || user.user_metadata?.roles)?.includes(
        "admin"
      )
    ) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  if (pathname.startsWith("/housekeeping")) {
    if (
      !user ||
      !(user.app_metadata?.roles || user.user_metadata?.roles)?.includes(
        "housekeeping"
      )
    ) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/", "/auth", "/admin/:path*", "/housekeeping/:path*"],
};
