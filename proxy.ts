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
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set({ name, value, ...options }),
          ),
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

  // Block auth if logged in
  if (pathname.startsWith("/auth") && user) {
    if (roles.includes("admin")) return redirect("/admin");
    if (roles.includes("housekeeping")) return redirect("/housekeeping");
    return redirect("/guest");
  }

  // Guards
  if (pathname.startsWith("/admin") && !roles.includes("admin"))
    return redirect("/auth");

  if (pathname.startsWith("/housekeeping") && !roles.includes("housekeeping"))
    return redirect("/auth");

  return res;
}

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

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*", "/housekeeping/:path*"],
};
