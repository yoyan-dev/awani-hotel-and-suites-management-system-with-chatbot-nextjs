import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { verifyIdImage } from "@/services/api/verify-id";

export async function POST(req: Request) {
  try {
    const result = await verifyIdImage(await req.formData());
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return apiErrorResponse(error, "Verification failed");
  }
}
