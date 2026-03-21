import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { createUser, listUsers } from "@/services/api/users";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await listUsers();

    return apiSuccess(data, apiMessage("Success", "", "success"), 200);
  } catch (error) {
    console.error("Unexpected error:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createUser(await req.formData());

    return apiSuccess(
      data,
      apiMessage("Success", "Account created successfully.", "success"),
      201,
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return apiErrorResponse(error);
  }
}
