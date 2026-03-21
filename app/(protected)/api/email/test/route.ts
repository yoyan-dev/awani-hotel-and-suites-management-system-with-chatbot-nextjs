import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  EmailTestPayload,
  sendTestEmail,
} from "@/services/api/email-test";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await sendTestEmail((await req.json()) as EmailTestPayload);

    return apiSuccess(
      data,
      apiMessage("Email Sent", `Sample email was sent to ${data.to}.`, "success"),
      200,
    );
  } catch (error) {
    const description =
      error instanceof Error ? error.message : "Failed to send sample email.";

    return apiErrorResponse(error, description);
  }
}
