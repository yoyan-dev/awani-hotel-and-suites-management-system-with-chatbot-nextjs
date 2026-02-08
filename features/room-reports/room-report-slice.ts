import {
  RoomReport,
  RoomReportPagination,
  RoomReportState,
} from "@/types/room-report";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addRoomReport,
  deleteRoomReport,
  deleteRoomReports,
  fetchRoomReport,
  fetchRoomReports,
  updateRoomReport,
} from "./room-report-thunk";

const initialState: RoomReportState = {
  room_reports: [],
  room_report: {} as RoomReport,
  pagination: {} as RoomReportPagination,
  isLoading: false,
  error: undefined,
};

const roomReportSlice = createSlice({
  name: "room-reports",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get all room reports
      .addCase(fetchRoomReport.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchRoomReport.fulfilled,
        (state, action: PayloadAction<RoomReport>) => {
          state.isLoading = false;
          state.room_report = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchRoomReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get all room reports
      .addCase(fetchRoomReports.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchRoomReports.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: RoomReport[];
            pagination: RoomReportPagination;
          }>,
        ) => {
          state.isLoading = false;
          state.room_reports = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        },
      )

      .addCase(fetchRoomReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add
      .addCase(addRoomReport.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addRoomReport.fulfilled,
        (state, action: PayloadAction<RoomReport>) => {
          state.isLoading = false;
          state.error = undefined;
          state.room_reports?.push(action.payload);
        },
      )
      .addCase(addRoomReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update
      .addCase(updateRoomReport.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateRoomReport.fulfilled,
        (state, action: PayloadAction<RoomReport>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.room_reports?.findIndex(
            (r) => r.id === action.payload.id,
          );
          // if (index !== -1) {
          //   state.room_reports[index] = action.payload;
          // }
        },
      )
      .addCase(updateRoomReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteRoomReport.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteRoomReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.room_reports = state.room_reports?.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteRoomReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete
      .addCase(deleteRoomReports.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteRoomReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.room_reports = state.room_reports?.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id),
        );
      })
      .addCase(deleteRoomReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = roomReportSlice.actions;
export default roomReportSlice.reducer;
