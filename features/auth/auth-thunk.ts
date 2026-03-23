import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import { User } from "@/types/users";

const apiUrl = "/api/auth";

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message?.description);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAccount = createAsyncThunk<User, FormData>(
  "auth/createAccount",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message?.description);
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
export const updateAccount = createAsyncThunk<
  User,
  User,
  { rejectValue: string }
>("auth/updateAccount", async (booking, { rejectWithValue }) => {
  try {
    const res = await apiFetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(data.message?.description);
    }

    return data.room;
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
// export const deleteBooking = createAsyncThunk<string, string>(
//   "auth/deleteBooking",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
//       const data = await res.json();

//       addToast(data.message);
//       if (!res.ok || !data.success) {
//         return rejectWithValue(
//           data.message?.description ?? "Failed to delete booking"
//         );
//       }

//       return data.data;
//     } catch (error: any) {
//       addToast({
//         title: "Error",
//         description: error.message,
//         color: "danger",
//       });
//       return rejectWithValue(error.message);
//     }
//   }
// );

