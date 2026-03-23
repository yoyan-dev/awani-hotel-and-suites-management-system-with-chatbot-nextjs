import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  RoomReport,
  RoomReportFetchParams,
  RoomReportPagination,
} from "@/types/room-report";

const path = "/api/room-reports";
export const fetchRoomReports = createAsyncThunk<
  { data: RoomReport[]; pagination: RoomReportPagination },
  RoomReportFetchParams | undefined
>("roomReports/fetchRoomReports", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("query", params.query);
    if (params?.room_number)
      searchParams.append("room_number", params.room_number);
    if (params?.guest_name)
      searchParams.append("guest_name", params.guest_name);
    if (params?.report_type)
      searchParams.append("report_type", params.report_type);
    if (params?.status) searchParams.append("status", params.status);

    const res = await apiFetch(`${path}?${searchParams.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message ?? "Failed to fetch room reports");
      return rejectWithValue(data.message ?? "Failed to fetch rooms");
    }

    return data as {
      data: RoomReport[];
      pagination: RoomReportPagination;
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchRoomReport = createAsyncThunk<RoomReport, string>(
  "roomReports/fetchRoomReport",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${path}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch room report",
        );
      }
      return data.data;
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
      });
      return rejectWithValue(error.message);
    }
  },
);

export const addRoomReport = createAsyncThunk<RoomReport, FormData>(
  "roomReports/addRoomReport",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiFetch(path, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add room report",
        );
      }
      return data.data;
    } catch (err: any) {
      console.log(err.message);
      addToast({
        title: "Error",
        description: err.message,
        color: "danger",
      });
      return rejectWithValue(err.message);
    }
  },
);

// UPDATE
export const updateRoomReport = createAsyncThunk<
  RoomReport,
  RoomReport,
  { rejectValue: string }
>("roomReports/updateRoomReport", async (room, { rejectWithValue }) => {
  try {
    const res = await apiFetch(`${path}/${room.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update room report",
      );
    }

    return data.data;
  } catch (err: any) {
    addToast({
      title: "Error",
      description: err.message,
      color: "danger",
    });
    return rejectWithValue(err.message);
  }
});

// DELETE
export const deleteRoomReport = createAsyncThunk<string, string>(
  "roomReports/deleteRoomReport",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${path}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete room report",
        );
      }

      return data.data;
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
      });
      return rejectWithValue(error.message);
    }
  },
);

//  delete selected selected or all
export const deleteRoomReports = createAsyncThunk<
  RoomReport[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>("roomReports/deleteRoomReports", async ({ selectedValues }, thunkAPI) => {
  try {
    const body =
      selectedValues === "all"
        ? { selectedValues: "all" }
        : { selectedValues: Array.from(selectedValues) };

    const res = await apiFetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    addToast(data.message);
    if (!res.ok) return thunkAPI.rejectWithValue(data.error);

    return data.data;
  } catch (err: any) {
    addToast({
      title: "Error",
      description: err.message,
      color: "danger",
    });
    return thunkAPI.rejectWithValue(err.message);
  }
});

