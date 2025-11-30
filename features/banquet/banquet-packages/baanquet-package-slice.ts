import { BanquetPackage, BanquetPackageState } from "@/types/banquet";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addBanquetPackage,
  deleteBanquetPackage,
  deleteBanquetPackages,
  fetchBanquetPackage,
  fetchBanquetPackages,
  updateBanquetPackage,
} from "./banquet-package-thunk";

const initialState: BanquetPackageState = {
  banquet_packages: [],
  banquet_package: {} as BanquetPackage,
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
          state.banquet_package = action.payload;
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
        (state, action: PayloadAction<BanquetPackage[]>) => {
          state.isLoading = false;
          state.banquet_packages = action.payload;
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
          state.banquet_packages.push(action.payload);
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
          const index = state.banquet_packages.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.banquet_packages[index] = action.payload;
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
        state.banquet_packages = state.banquet_packages.filter(
          (r) => r.id !== action.payload
        );
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
        state.banquet_packages = state.banquet_packages.filter(
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
