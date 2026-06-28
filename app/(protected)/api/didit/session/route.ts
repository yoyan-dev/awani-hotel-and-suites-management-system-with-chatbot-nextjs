import { NextResponse } from "next/server";
import { createDiditSession } from "@/lib/didit/service";
import { apiErrorResponse } from "@/lib/api/error-response";

function getSafeReturnTo(value: unknown) {
  if (typeof value !== "string") return "/guest/reservations/hotel-rooms";

  try {
    const url = new URL(value, "https://local.invalid");
    url.searchParams.set("didit_return", "1");
    const returnTo = `${url.pathname}${url.search}`;

    return returnTo.startsWith("/guest/reservations/")
      ? returnTo
      : "/guest/reservations/hotel-rooms";
  } catch {
    return "/guest/reservations/hotel-rooms";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const origin = new URL(req.url).origin;
    const returnTo = getSafeReturnTo(body.returnTo);
    const session = await createDiditSession({
      vendorData: body.vendorData,
      bookingType: body.bookingType,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      callback: `${origin}/guest/verification/done?returnTo=${encodeURIComponent(returnTo)}`,
    });

    return NextResponse.json(session);
  } catch (error) {
    return apiErrorResponse(error, "Could not start identity verification");
  }
}
