import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import { BanquetPackage } from "@/types/banquet";

const api = "/api/banquet/banquet-packages";

export const fetchBanquetPackages = createAsyncThunk<BanquetPackage[]>(
  "banquet-packages/fetchBanquetPackages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(api);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message ?? "Failed to fetch banquet packages");
        return rejectWithValue(
          data.message ?? "Failed to fetch banquet packages"
        );
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get one
export const fetchBanquetPackage = createAsyncThunk<BanquetPackage, string>(
  "banquet-packages/fetchBanquetPackage",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch banquet package"
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

export const addBanquetPackage = createAsyncThunk<BanquetPackage, FormData>(
  "banquet-packages/addBanquetPackage",
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
          data.message?.description ?? "Failed to add banquet package"
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
export const updateBanquetPackage = createAsyncThunk<
  BanquetPackage,
  BanquetPackage,
  { rejectValue: string }
>(
  "banquet-packages/updateBanquetPackage",
  async (banquet_package, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/${banquet_package.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banquet_package),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update banquet package"
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
  }
);

// DELETE
export const deleteBanquetPackage = createAsyncThunk<string, string>(
  "banquet-packages/deleteBanquetPackage",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${api}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete banquet package"
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
export const deleteBanquetPackages = createAsyncThunk<
  BanquetPackage[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>(
  "banquet-packages/deleteBanquetPackages",
  async ({ selectedValues }, thunkAPI) => {
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
  }
);
