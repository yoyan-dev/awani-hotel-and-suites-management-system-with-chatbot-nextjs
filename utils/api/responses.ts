import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/response";

type MessageColor = "success" | "danger" | "warning" | "error";

export function apiMessage(
  title: string,
  description: string,
  color: MessageColor,
) {
  return { title, description, color };
}

export function apiSuccess<T>(
  data: T,
  message = apiMessage("Success", "", "success"),
  status = 200,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...extra,
    } satisfies ApiResponse,
    { status },
  );
}

export function apiFailure(
  description: string,
  status = 500,
  title = "Error",
  color: MessageColor = "danger",
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      success: false,
      message: apiMessage(title, description, color),
      ...extra,
    } satisfies ApiResponse,
    { status },
  );
}

export function apiDuplicate(description: string) {
  return apiFailure(description, 400, "Error", "danger");
}

export function apiBulkDeleteSelectionError(selectedValues: unknown) {
  return apiFailure(String(selectedValues), 400, "Error", "warning");
}

export function apiBulkDeleteSuccess(
  selectedValues: number[] | "all",
  data: unknown,
) {
  return apiSuccess(
    data,
    apiMessage(
      "Success",
      selectedValues === "all"
        ? "All items deleted successfully"
        : "Selected items deleted successfully",
      "success",
    ),
  );
}
