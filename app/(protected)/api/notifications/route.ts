import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createNotification,
  deleteAllNotifications,
  listNotifications,
} from "@/services/api/notifications";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 20), 1), 100);
    const data = await listNotifications(page, limit);

    return apiSuccess(data, apiMessage("Success", "", "success"), 200);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createNotification(
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Notification added successfully", "success"),
      201,
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return apiErrorResponse(error);
  }
}

export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await deleteAllNotifications();

    return apiSuccess(
      data,
      apiMessage("Success", "All notifications deleted successfully", "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
