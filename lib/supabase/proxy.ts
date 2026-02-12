import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth";
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );

    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
    // return NextResponse.redirect(new URL("/auth", request.url));
  }

  console.log(user);
  const roles: string[] = user?.app_metadata?.roles || [];

  const pathname = request.nextUrl.pathname;
  console.log("user", user, roles);
  const publicPaths = ["/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Root redirect
  if (pathname === "/")
    return NextResponse.redirect(new URL("/guest", request.url));

  // Not authenticated
  // if (!user && !isPublicPath)
  //   return NextResponse.redirect(new URL("/auth", request.url));

  // Block auth pages if logged in
  if (pathname.startsWith("/auth") && user) {
    if (roles.includes("admin"))
      return NextResponse.redirect(new URL("/admin", request.url));
    if (roles.includes("housekeeping"))
      return NextResponse.redirect(new URL("/housekeeping", request.url));
    return NextResponse.redirect(new URL("/guest", request.url));
  }

  // Admin guard
  if (pathname.startsWith("/admin") && !roles.includes("admin")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Housekeeping guard
  if (pathname.startsWith("/housekeeping") && !roles.includes("housekeeping")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
