import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  FeedbackFetchParams,
  FeedbackPagination,
  FeedbackPayload,
  FeedbackUpdatePayload,
} from "@/types/feedback";

const apiUrl = "/api/feedback";

export const fetchGuestFeedbacks = createAsyncThunk<
  { data: FeedbackPayload[]; pagination: FeedbackPagination },
  FeedbackFetchParams | undefined
>("inventory/fetchGuestFeedbacks", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("q", params.query);
    if (params?.rating) searchParams.append("rating", String(params.rating));
    if (params?.approval) searchParams.append("approval", params.approval);

    const endpoint = params?.publicOnly ? `${apiUrl}/public` : apiUrl;
    const res = await apiFetch(`${endpoint}?${searchParams.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message);
      return rejectWithValue(
        data.message?.description ?? "Failed to fetch guest feedbacks",
      );
    }
    return {
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchGuestFeedback = createAsyncThunk<FeedbackPayload, string>(
  "inventory/fetchGuestFeedback",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch guest feedback",
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

export const addGuestFeedback = createAsyncThunk<FeedbackPayload, FormData>(
  "inventory/addGuestFeedback",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add guest feedback",
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
export const updateGuestFeedback = createAsyncThunk<
  FeedbackPayload,
  FeedbackUpdatePayload,
  { rejectValue: string }
>(
  "inventory/updateGuestFeedback",
  async (guest_request, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${guest_request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest_request),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update guest feedback",
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
  },
);

// DELETE
export const deleteGuestFeedback = createAsyncThunk<string, string>(
  "inventory/deleteGuestFeedback",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete guest feedback",
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

//  delete selected rooms or all
export const deleteSelectedGuestFeedback = createAsyncThunk<
  FeedbackPayload[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>(
  "inventory/deleteSelectedGuestFeedback",
  async ({ selectedValues }, thunkAPI) => {
    try {
      const body =
        selectedValues === "all"
          ? { selectedValues: "all" }
          : { selectedValues: Array.from(selectedValues) };

      const res = await apiFetch(apiUrl, {
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
  },
);

