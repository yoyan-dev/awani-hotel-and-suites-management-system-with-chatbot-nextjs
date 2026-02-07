import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "./lib/supabase/server";

export async function proxy(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = await createClient();

  // Refresh session if expired
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Also get session for roles
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Extract roles from user metadata
  const roles: string[] =
    user?.app_metadata?.roles ||
    user?.user_metadata?.roles ||
    session?.user?.app_metadata?.roles ||
    session?.user?.user_metadata?.roles ||
    [];

  const pathname = req.nextUrl.pathname;

  // Helper function for redirects with cookies
  const redirect = (path: string) => {
    const redirect = NextResponse.redirect(new URL(path, req.url));
    // Copy cookies from response to redirect
    res.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  };

  // Public paths that don't require authentication
  const publicPaths = ["/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Root redirect
  if (pathname === "/") {
    return redirect("/guest");
  }

  // // If user is not authenticated and trying to access protected routes
  // if (!user && !isPublicPath) {
  //   if (pathname.startsWith("/admin") || pathname.startsWith("/housekeeping")) {
  //     return redirect("/auth");
  //   }
  // }

  // // Block auth pages if already logged in
  // if (pathname.startsWith("/auth") && user) {
  //   if (roles.includes("admin")) return redirect("/admin");
  //   if (roles.includes("housekeeping")) return redirect("/housekeeping");
  //   return redirect("/guest");
  // }

  // // Guards for admin routes - must have admin role
  // if (pathname.startsWith("/admin")) {
  //   if (!user) {
  //     return redirect("/auth");
  //   }
  //   if (!roles.includes("admin")) {
  //     return redirect("/auth");
  //   }
  //   // }

  //   // Guards for housekeeping routes - must have housekeeping role
  //   if (pathname.startsWith("/housekeeping")) {
  //     if (!user) {
  //       return redirect("/auth");
  //     }
  //     if (!roles.includes("housekeeping")) {
  //       return redirect("/auth");
  //     }
  //   }

  //   return res;
  // }
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
