import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createRoom,
  deleteRooms,
  listRooms,
} from "@/services/api/rooms";
import { ApiResponse } from "@/types/response";
import {
  apiBulkDeleteSuccess,
  apiMessage,
  apiSuccess,
} from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = 10;
    const result = await listRooms({
      query: searchParams.get("q") || "",
      roomTypeID: searchParams.get("roomTypeID") || "",
      status: searchParams.get("status") || "",
      page,
      limit,
    });

    return apiSuccess(result.data, apiMessage("success", "", "success"), 201, {
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createRoom(await req.formData());

    return apiSuccess(
      data,
      apiMessage("Success", "Room added successfully", "success"),
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
    const data = await deleteRooms(selectedValues);

    return apiBulkDeleteSuccess(selectedValues, data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
