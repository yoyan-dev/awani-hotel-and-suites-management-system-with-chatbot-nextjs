import {
  BanquetMenu,
  BanquetMenuPagination,
  BanquetMenuState,
} from "@/types/banquet";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addBanquetMenu,
  deletBanquetMenus,
  deleteBanquetMenu,
  fetchBanquetMenu,
  fetchBanquetMenus,
  updateBanquetMenu,
} from "./banquet-menu-thunk";

const initialState: BanquetMenuState = {
  menus: [],
  menu: {} as BanquetMenu,
  pagination: {} as BanquetMenuPagination,
  isLoading: false,
  error: undefined,
};

const banquetMenuSlice = createSlice({
  name: "banquet-menus",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get single
      .addCase(fetchBanquetMenu.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchBanquetMenu.fulfilled,
        (state, action: PayloadAction<BanquetMenu>) => {
          state.isLoading = false;
          state.menu = action.payload;
          state.error = undefined;
        }
      )
      .addCase(fetchBanquetMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // get many
      .addCase(fetchBanquetMenus.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchBanquetMenus.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: BanquetMenu[];
            pagination: BanquetMenuPagination;
          }>
        ) => {
          state.isLoading = false;
          state.menus = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = undefined;
        }
      )

      .addCase(fetchBanquetMenus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add item
      .addCase(addBanquetMenu.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addBanquetMenu.fulfilled,
        (state, action: PayloadAction<BanquetMenu>) => {
          state.isLoading = false;
          state.error = undefined;
          state.menus.push(action.payload);
        }
      )
      .addCase(addBanquetMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // update item
      .addCase(updateBanquetMenu.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateBanquetMenu.fulfilled,
        (state, action: PayloadAction<BanquetMenu>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.menus.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.menus[index] = action.payload;
          }
        }
      )
      .addCase(updateBanquetMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete item
      .addCase(deleteBanquetMenu.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteBanquetMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.menus = state.menus.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteBanquetMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // delete items
      .addCase(deletBanquetMenus.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deletBanquetMenus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
        state.menus = state.menus.filter(
          (r) => !action.payload.map((room) => room.id).includes(r.id)
        );
      })
      .addCase(deletBanquetMenus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = banquetMenuSlice.actions;
export default banquetMenuSlice.reducer;
