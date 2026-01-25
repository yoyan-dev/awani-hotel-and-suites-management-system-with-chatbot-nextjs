// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const { pathname } = req.nextUrl;

  // root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/guest", req.url));
  }

  // block /auth for logged-in users
  // if (pathname.startsWith("/auth") && user) {
  //   const roles = user.app_metadata?.roles || user.user_metadata?.roles;
  //   let redirectTo = "/guest";

  //   if (roles?.includes("admin")) redirectTo = "/admin";
  //   else if (roles?.includes("housekeeping")) redirectTo = "/housekeeping";

  //   return NextResponse.redirect(new URL(redirectTo, req.url));
  // }

  // admin guard
  // if (
  //   pathname.startsWith("/admin") &&
  //   (!user ||
  //     !(user.app_metadata?.roles || user.user_metadata?.roles)?.includes(
  //       "admin",
  //     ))
  // ) {
  //   return NextResponse.redirect(new URL("/auth", req.url));
  // }

  // housekeeping guard
  // if (
  //   pathname.startsWith("/housekeeping") &&
  //   (!user ||
  //     !(user.app_metadata?.roles || user.user_metadata?.roles)?.includes(
  //       "housekeeping",
  //     ))
  // ) {
  //   return NextResponse.redirect(new URL("/auth", req.url));
  // }

  return res;
}

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*", "/housekeeping/:path*"],
};
