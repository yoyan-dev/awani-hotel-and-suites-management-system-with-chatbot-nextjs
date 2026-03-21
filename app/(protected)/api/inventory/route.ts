import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createInventoryItem,
  deleteInventoryItems,
  listInventoryItems,
} from "@/services/api/inventory";
import { ApiResponse } from "@/types/response";
import {
  apiBulkDeleteSuccess,
  apiMessage,
  apiSuccess,
} from "@/utils/api/responses";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await listInventoryItems();
    return apiSuccess(data, apiMessage("success", "", "success"), 201);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createInventoryItem(await req.formData());

    return apiSuccess(
      data,
      apiMessage("Success", "Item successfully added.", "success"),
      201,
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues = body.selectedValues as number[] | "all";
    const data = await deleteInventoryItems(selectedValues);

    return apiBulkDeleteSuccess(selectedValues, data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
