import { NextResponse } from "next/server";
import { getDiditVerification } from "@/lib/didit/service";
import { apiErrorResponse } from "@/lib/api/error-response";

export async function GET(req: Request) {
  try {
    const vendorData = new URL(req.url).searchParams.get("vendorData") ?? "";
    const verification = await getDiditVerification(vendorData);

    return NextResponse.json({
      status: verification?.status ?? "Not Started",
      session_id: verification?.session_id ?? null,
      verified_at: verification?.verified_at ?? null,
    });
  } catch (error) {
    return apiErrorResponse(error, "Could not load verification status");
  }
}
