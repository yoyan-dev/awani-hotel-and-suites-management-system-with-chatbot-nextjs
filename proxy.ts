import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const API_BEARER_TOKEN =
  process.env.API_BEARER_TOKEN ?? process.env.NEXT_PUBLIC_API_BEARER_TOKEN;

const PUBLIC_API_EXACT_RULES: Array<{
  pathname: string;
  methods: string[];
}> = [
  { pathname: "/api", methods: ["GET"] },
  { pathname: "/api/auth", methods: ["POST"] },
  { pathname: "/api/accounts", methods: ["POST"] },
  { pathname: "/api/auth-logs/device", methods: ["POST"] },
  { pathname: "/api/verify-id", methods: ["POST"] },
  { pathname: "/api/chatbot", methods: ["POST"] },
  { pathname: "/api/guest", methods: ["POST"] },
  { pathname: "/api/feedback", methods: ["POST"] },
  { pathname: "/api/feedback", methods: ["GET"] },
  { pathname: "/api/room-types", methods: ["GET"] },
  { pathname: "/api/room-types/available-room-types", methods: ["GET"] },
  { pathname: "/api/rooms/available-rooms", methods: ["GET"] },
  { pathname: "/api/function-rooms/available-rooms", methods: ["GET"] },
  { pathname: "/api/bookings/hotel-rooms", methods: ["POST"] },
  { pathname: "/api/bookings/function-hall", methods: ["POST"] },
];

const PUBLIC_API_PREFIX_RULES: Array<{
  pathname: string;
  methods: string[];
}> = [{ pathname: "/api/auth/", methods: ["GET", "POST"] }];

function matchesApiRule(
  pathname: string,
  method: string,
  rule: { pathname: string; methods: string[] },
) {
  return rule.pathname === pathname && rule.methods.includes(method);
}

function matchesApiPrefixRule(
  pathname: string,
  method: string,
  rule: { pathname: string; methods: string[] },
) {
  return pathname.startsWith(rule.pathname) && rule.methods.includes(method);
}

function isPublicApiRequest(pathname: string, method: string) {
  return (
    PUBLIC_API_EXACT_RULES.some((rule) =>
      matchesApiRule(pathname, method, rule),
    ) ||
    PUBLIC_API_PREFIX_RULES.some((rule) =>
      matchesApiPrefixRule(pathname, method, rule),
    )
  );
}

function getRequestBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

function hasValidApiBearerToken(request: NextRequest) {
  if (!API_BEARER_TOKEN) {
    return false;
  }

  return getRequestBearerToken(request) === API_BEARER_TOKEN;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();
  const isApiRoute = pathname === "/api" || pathname.startsWith("/api/");
  const isAuthCallbackApiRoute = pathname.startsWith("/api/auth/");

  if (
    isApiRoute &&
    !isAuthCallbackApiRoute &&
    !hasValidApiBearerToken(request)
  ) {
    return NextResponse.json(
      {
        message: "You don't have permission to access this page.",
      },
      { status: 401 },
    );
  }

  if (isApiRoute && isPublicApiRequest(pathname, method)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const roles = Array.isArray(token?.roles) ? token.roles : [];
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isFrontOfficePage = pathname.startsWith("/front-office");
  const isHousekeepingPage = pathname.startsWith("/housekeeping");

  if (isApiRoute && !token) {
    return NextResponse.json(
      {
        message: "Authentication required.",
      },
      { status: 401 },
    );
  }

  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/guest", request.url));
    }

    if (roles.includes("admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (roles.includes("front_office")) {
      return NextResponse.redirect(new URL("/front-office", request.url));
    }

    if (roles.includes("housekeeping")) {
      return NextResponse.redirect(new URL("/housekeeping", request.url));
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if ((isAdminPage || isFrontOfficePage || isHousekeepingPage) && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthPage && token) {
    if (roles.includes("admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (roles.includes("front_office")) {
      return NextResponse.redirect(new URL("/front-office", request.url));
    }

    if (roles.includes("housekeeping")) {
      return NextResponse.redirect(new URL("/housekeeping", request.url));
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if (isAdminPage && !roles.includes("admin")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isFrontOfficePage && !roles.includes("front_office")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isHousekeepingPage && !roles.includes("housekeeping")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/api",
    "/api/:path*",
    "/admin/:path*",
    "/front-office/:path*",
    "/housekeeping/:path*",
    "/auth/:path*",
  ],
};
