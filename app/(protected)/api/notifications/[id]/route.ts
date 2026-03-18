import { NextRequest, NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import { ApiRouteError } from "@/lib/api/route-error";
import {
  deleteNotificationById,
  updateNotificationById,
} from "@/services/api/notifications";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

function parseNotificationId(id: string) {
  const notificationId = Number(id);
  if (!Number.isFinite(notificationId)) {
    throw new ApiRouteError("Invalid notification id", {
      status: 400,
      color: "error",
    });
  }

  return notificationId;
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    const data = await updateNotificationById(
      parseNotificationId(id),
      (await req.json()) as Record<string, unknown>,
    );

    return apiSuccess(
      data,
      apiMessage("Success", "Notification updated successfully", "success"),
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;
    await deleteNotificationById(parseNotificationId(id));

    return apiSuccess(
      null,
      apiMessage("Success", "Notification deleted successfully", "success"),
      200,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
