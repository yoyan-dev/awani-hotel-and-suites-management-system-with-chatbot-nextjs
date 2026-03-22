import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAuthLogs } from "./auth-log-thunk";
import { AuthLog, AuthLogPagination, AuthLogState } from "@/types/auth-log";

const initialPagination: AuthLogPagination = {
  page: 1,
  limit: 10,
  total: 0,
  total_pages: 0,
};

const initialState: AuthLogState = {
  logs: [],
  pagination: initialPagination,
  isLoading: false,
  error: undefined,
};

const authLogSlice = createSlice({
  name: "auth_logs",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearAuthLogs: (state) => {
      state.logs = [];
      state.pagination = initialPagination;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthLogs.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchAuthLogs.fulfilled,
        (
          state,
          action: PayloadAction<{ data: AuthLog[]; pagination: AuthLogPagination }>,
        ) => {
          state.isLoading = false;
          state.logs = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        },
      )
      .addCase(fetchAuthLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.logs = [];
        state.pagination = initialPagination;
        state.error = action.error.message;
      });
  },
});

export const { setLoading, clearAuthLogs } = authLogSlice.actions;
export default authLogSlice.reducer;
