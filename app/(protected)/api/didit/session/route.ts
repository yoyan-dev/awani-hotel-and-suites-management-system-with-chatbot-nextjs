import { NextResponse } from "next/server";
import { createDiditSession } from "@/lib/didit/service";
import { apiErrorResponse } from "@/lib/api/error-response";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const origin = new URL(req.url).origin;
    const session = await createDiditSession({
      vendorData: body.vendorData,
      bookingType: body.bookingType,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      callback: `${origin}/guest/verification/done`,
    });

    return NextResponse.json(session);
  } catch (error) {
    return apiErrorResponse(error, "Could not start identity verification");
  }
}
