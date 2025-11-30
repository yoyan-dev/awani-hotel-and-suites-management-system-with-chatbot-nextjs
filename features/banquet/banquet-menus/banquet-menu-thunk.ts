import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  BanquetMenu,
  BanquetMenuFetchParams,
  BanquetMenuPagination,
} from "@/types/banquet";

const api = "/api/banquet/banquet-menus";

export const fetchBanquetMenus = createAsyncThunk<
  { data: BanquetMenu[]; pagination: BanquetMenuPagination },
  BanquetMenuFetchParams | undefined
>("banquet-menus/fetchBanquetMenus", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("q", params.query);

    const res = await fetch(`${api}?${searchParams.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message ?? "Failed to fetch menus");
      return rejectWithValue(data.message ?? "Failed to fetch menus");
    }

    return data as {
      data: BanquetMenu[];
      pagination: BanquetMenuPagination;
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchBanquetMenu = createAsyncThunk<BanquetMenu, string>(
  "banquet-menus/fetchBanquetMenu",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch menu"
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
  }
);

export const addBanquetMenu = createAsyncThunk<BanquetMenu, FormData>(
  "banquet-menus/addBanquetMenu",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(api, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add menu"
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
  }
);

// UPDATE
export const updateBanquetMenu = createAsyncThunk<
  BanquetMenu,
  BanquetMenu,
  { rejectValue: string }
>("banquet-menus/updateBanquetMenu", async (menu, { rejectWithValue }) => {
  try {
    const res = await fetch(`${api}/${menu.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menu),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update menu"
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
export const deleteBanquetMenu = createAsyncThunk<string, string>(
  "banquet-menus/deleteBanquetMenu",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete menu"
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
  }
);

//  delete selected rooms or all
export const deletBanquetMenus = createAsyncThunk<
  BanquetMenu[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>("banquet-menus/deletBanquetMenus", async ({ selectedValues }, thunkAPI) => {
  try {
    const body =
      selectedValues === "all"
        ? { selectedValues: "all" }
        : { selectedValues: Array.from(selectedValues) };

    const res = await fetch(api, {
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
