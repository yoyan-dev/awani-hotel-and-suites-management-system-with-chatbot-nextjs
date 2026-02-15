import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookie = request.cookies.get("sb-session")?.value;

  let user: any = null;
  let roles: string[] = [];

  if (cookie) {
    try {
      const decoded = JSON.parse(
        Buffer.from(cookie, "base64").toString("utf-8"),
      );

      const accessToken = decoded?.access_token;

      if (accessToken) {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        );

        const { data, error } = await supabase.auth.getUser(accessToken);

        if (!error && data?.user) {
          user = data.user;
          roles = user.app_metadata?.roles || [];
        }
      }
    } catch (err) {
      console.log("Invalid session cookie");
    }
  }

  const publicPaths = ["/auth"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  console.log(pathname);

  // ------------------------
  // ROOT REDIRECT (SMART)
  // ------------------------
  if (pathname === "/") {
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (roles.includes("admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (roles.includes("housekeeping")) {
      return NextResponse.redirect(new URL("/housekeeping", request.url));
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  // ------------------------
  // NOT AUTHENTICATED
  // ------------------------

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // ------------------------
  // BLOCK AUTH PAGE IF LOGGED IN
  // ------------------------
  if (pathname.startsWith("/auth") && user) {
    if (roles.includes("admin"))
      return NextResponse.redirect(new URL("/admin", request.url));

    if (roles.includes("housekeeping"))
      return NextResponse.redirect(new URL("/housekeeping", request.url));

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/housekeeping/:path*", "/auth"],
};
