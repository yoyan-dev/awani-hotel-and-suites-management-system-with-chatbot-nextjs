import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  AuthLog,
  AuthLogApiResponse,
  AuthLogFetchParams,
  AuthLogPagination,
} from "@/types/auth-log";

const apiUrl = "/api/auth-logs";

export const fetchAuthLogs = createAsyncThunk<
  { data: AuthLog[]; pagination: AuthLogPagination },
  AuthLogFetchParams | undefined
>("authLogs/fetchAuthLogs", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("q", params.query);
    if (params?.userId) searchParams.append("userId", params.userId);

    const res = await apiFetch(`${apiUrl}?${searchParams.toString()}`);
    const data = ((await res.json()) as AuthLogApiResponse) ?? {};

    // if (!res.ok || !data.success) {
    //   if (data.message) addToast(data.message);
    //   return rejectWithValue(
    //     data.message?.description ?? "Failed to fetch auth logs",
    //   );
    // }

    return {
      data: data.data ?? [],
      pagination: data.pagination ?? {
        page: params?.page ?? 1,
        limit: 10,
        total: 0,
        total_pages: 0,
      },
    };
  } catch (error: any) {
    addToast({
      title: "Error",
      description: error.message,
      color: "danger",
    });
    return rejectWithValue(error.message);
  }
});

