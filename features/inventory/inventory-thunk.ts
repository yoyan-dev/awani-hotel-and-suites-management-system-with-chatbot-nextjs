import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Inventory } from "@/types/inventory";
import { addToast } from "@heroui/react";

const apiUrl = "/api/inventory";

export const fetchInventory = createAsyncThunk<Inventory[]>(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch intentory"
        );
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInventoryItem = createAsyncThunk<Inventory, string>(
  "inventory/fetchInventoryItem",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch item"
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

export const addItem = createAsyncThunk<Inventory, FormData>(
  "inventory/addItem",
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
          data.message?.description ?? "Failed to add item in inventory"
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
export const UpdateItem = createAsyncThunk<
  Inventory,
  Inventory,
  { rejectValue: string }
>("inventory/UpdateItem", async (inventory, { rejectWithValue }) => {
  try {
    const res = await apiFetch(`${apiUrl}/${inventory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inventory),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update item"
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
export const deleteItem = createAsyncThunk<string, string>(
  "inventory/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete item"
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
export const deleteSelectedItems = createAsyncThunk<
  Inventory[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>("inventory/deleteSelectedItems", async ({ selectedValues }, thunkAPI) => {
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
});

