import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { updateCurrentUserProfile } from "@/services/api/users-item";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function PUT(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const result = await updateCurrentUserProfile(await req.json());

    return apiSuccess(
      null,
      apiMessage("Success", result.description, "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
