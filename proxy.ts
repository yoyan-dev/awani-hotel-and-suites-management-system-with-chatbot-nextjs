import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function redirectWithCookies(
  req: NextRequest,
  res: NextResponse,
  path: string,
) {
  const redirect = NextResponse.redirect(new URL(path, req.url));
  res.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie);
  });
  return redirect;
}

export async function proxy(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: true, // 🔥 REQUIRED IN PROD
              sameSite: "lax", // ✅ works with same-origin
              path: "/",
            });
          });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const roles = user?.app_metadata?.roles || user?.user_metadata?.roles || [];

  const pathname = req.nextUrl.pathname;

  const redirect = (path: string) => redirectWithCookies(req, res, path);

  // Root
  if (pathname === "/") return redirect("/guest");

  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/register", "/auth/callback"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If user is not authenticated and trying to access protected route
  if (
    !user &&
    !isPublicPath &&
    (pathname.startsWith("/admin") || pathname.startsWith("/housekeeping"))
  ) {
    return redirect("/auth/login");
  }

  // Block auth if logged in
  if (pathname.startsWith("/auth") && user) {
    if (roles.includes("admin")) return redirect("/admin");
    if (roles.includes("housekeeping")) return redirect("/housekeeping");
    return redirect("/guest");
  }

  // Guards for admin routes
  if (pathname.startsWith("/admin") && !roles.includes("admin")) {
    return redirect("/auth/login");
  }

  // Guards for housekeeping routes
  if (pathname.startsWith("/housekeeping") && !roles.includes("housekeeping")) {
    return redirect("/auth/login");
  }

  return res;
}

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*", "/housekeeping/:path*"],
};
