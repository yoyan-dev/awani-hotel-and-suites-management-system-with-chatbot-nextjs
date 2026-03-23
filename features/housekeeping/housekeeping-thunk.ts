import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  RoomListParams,
  RoomListResponse,
  RoomUpdatePayload,
  TodayOperations,
  TodayOperationsParams,
  UpdateRoomResponse,
} from "@/types/housekeeping";
import { addToast } from "@heroui/react";

const apiUrl = "/api/housekeeping";

export const fetchRoomList = createAsyncThunk<
  RoomListResponse,
  RoomListParams | undefined,
  { rejectValue: string }
>("housekeeping/fetchRoomList", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.cleaning_status)
      searchParams.append("cleaning_status", params.cleaning_status);
    if (params?.room_type_id)
      searchParams.append("room_type_id", params.room_type_id);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
    if (params?.sort_order)
      searchParams.append("sort_order", params.sort_order);

    const res = await apiFetch(`${apiUrl}/rooms?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description: response.error?.message ?? "Failed to fetch room list",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch room list",
      );
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching room list:", err);
    return rejectWithValue("Failed to fetch room list");
  }
});

export const fetchTodayOperations = createAsyncThunk<
  TodayOperations,
  TodayOperationsParams | undefined,
  { rejectValue: string }
>("housekeeping/fetchTodayOperations", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.append("date", params.date);

    const res = await apiFetch(`${apiUrl}/operations?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch today's operations",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch today's operations",
      );
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching today's operations:", err);
    return rejectWithValue("Failed to fetch today's operations");
  }
});

export const updateRoomStatus = createAsyncThunk<
  UpdateRoomResponse,
  { room_id: string; payload: RoomUpdatePayload },
  { rejectValue: string }
>(
  "housekeeping/updateRoomStatus",
  async ({ room_id, payload }, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/rooms/${room_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const response = await res.json();

      if (!res.ok) {
        addToast({
          title: "Error",
          description:
            response.error?.message ?? "Failed to update room status",
          color: "danger",
        });
        return rejectWithValue(
          response.error?.message ?? "Failed to update room status",
        );
      }

      addToast({
        title: "Success",
        description: "Room status updated successfully",
        color: "success",
      });

      return response.data;
    } catch (err) {
      console.error("Error updating room status:", err);
      return rejectWithValue("Failed to update room status");
    }
  },
);

