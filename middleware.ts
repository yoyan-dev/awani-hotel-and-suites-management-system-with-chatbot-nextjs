import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createEdgeSupabaseClient } from "./lib/supabase/proxy";

export async function middleware(req: NextRequest) {
  const { supabase, res } = createEdgeSupabaseClient(req);
  await supabase.auth.getSession();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;
  const roles: string[] = session?.user?.app_metadata?.roles || [];

  const pathname = req.nextUrl.pathname;
  console.log("user", user, roles);
  const publicPaths = ["/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Root redirect
  if (pathname === "/")
    return NextResponse.redirect(new URL("/guest", req.url));

  // Not authenticated
  // if (!user && !isPublicPath)
  //   return NextResponse.redirect(new URL("/auth", req.url));

  // // Block auth pages if logged in
  // if (pathname.startsWith("/auth") && user) {
  //   if (roles.includes("admin"))
  //     return NextResponse.redirect(new URL("/admin", req.url));
  //   if (roles.includes("housekeeping"))
  //     return NextResponse.redirect(new URL("/housekeeping", req.url));
  //   return NextResponse.redirect(new URL("/guest", req.url));
  // }

  // // Admin guard
  // if (pathname.startsWith("/admin") && !roles.includes("admin")) {
  //   return NextResponse.redirect(new URL("/auth", req.url));
  // }

  // // Housekeeping guard
  // if (pathname.startsWith("/housekeeping") && !roles.includes("housekeeping")) {
  //   return NextResponse.redirect(new URL("/auth", req.url));
  // }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/admin/:path*",
    "/housekeeping/:path*",
    "/guest/:path*",
  ],
};
