import { NextResponse } from "next/server";
import { refreshDiditVerificationFromSession } from "@/lib/didit/service";
import { apiErrorResponse } from "@/lib/api/error-response";

function getVerificationMedia(metadata: unknown) {
  const record =
    metadata && typeof metadata === "object"
      ? (metadata as Record<string, unknown>)
      : {};

  return {
    front: typeof record.front === "string" ? record.front : null,
    back: typeof record.back === "string" ? record.back : null,
  };
}

export async function GET(req: Request) {
  try {
    const vendorData = new URL(req.url).searchParams.get("vendorData") ?? "";
    const verification = await refreshDiditVerificationFromSession(vendorData);
    const media = getVerificationMedia(verification?.metadata);

    return NextResponse.json({
      status: verification?.status ?? "Not Started",
      session_id: verification?.session_id ?? null,
      verified_at: verification?.verified_at ?? null,
      front: media.front,
      back: media.back,
    });
  } catch (error) {
    return apiErrorResponse(error, "API: Could not load verification status");
  }
}
