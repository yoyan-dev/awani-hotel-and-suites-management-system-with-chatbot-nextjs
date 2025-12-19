import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addBanquetPackage,
  deleteBanquetPackage,
  deleteBanquetPackages,
  fetchBanquetPackage,
  fetchBanquetPackages,
  updateBanquetPackage,
} from "./banquet-package-thunk";
import {
  BanquetMenuState,
  BanquetPackage,
  BanquetPackagePagination,
} from "@/types/banquet-package";

const initialState: BanquetMenuState = {
  items: [],
  item: {} as BanquetPackage,
  pagination: {} as BanquetPackagePagination,
  isLoading: false,
  error: undefined,
};

const banquetPackageSlice = createSlice({
  name: "banquet-packages",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single
      .addCase(fetchBanquetPackage.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchBanquetPackage.fulfilled,
        (state, action: PayloadAction<BanquetPackage>) => {
          state.isLoading = false;
          state.item = action.payload;
          state.error = undefined;
        }
      )
      .addCase(fetchBanquetPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get many
      .addCase(fetchBanquetPackages.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchBanquetPackages.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: BanquetPackage[];
            pagination: BanquetPackagePagination;
          }>
        ) => {
          state.isLoading = false;
          state.items = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        }
      )

      .addCase(fetchBanquetPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add item
      .addCase(addBanquetPackage.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addBanquetPackage.fulfilled,
        (state, action: PayloadAction<BanquetPackage>) => {
          state.isLoading = false;
          state.error = undefined;
          state.items.push(action.payload);
        }
      )
      .addCase(addBanquetPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update item
      .addCase(updateBanquetPackage.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateBanquetPackage.fulfilled,
        (state, action: PayloadAction<BanquetPackage>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.items.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(updateBanquetPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete item
      .addCase(deleteBanquetPackage.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteBanquetPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteBanquetPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete items
      .addCase(deleteBanquetPackages.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteBanquetPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.items = state.items.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id)
        );
      })
      .addCase(deleteBanquetPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = banquetPackageSlice.actions;
export default banquetPackageSlice.reducer;
