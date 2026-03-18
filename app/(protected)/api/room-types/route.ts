import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/api/error-response";
import {
  createRoomType,
  listRoomTypes,
} from "@/services/api/room-types";
import { ApiResponse } from "@/types/response";
import { apiMessage, apiSuccess } from "@/utils/api/responses";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const data = await listRoomTypes({
      query: searchParams.get("q") || "",
      maxGuest: searchParams.get("maxGuest") || "",
    });

    return apiSuccess(data, apiMessage("success", "", "success"), 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const data = await createRoomType(await req.formData());

    return apiSuccess(
      data,
      apiMessage("Success", "Item successfully added.", "success"),
      201,
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
