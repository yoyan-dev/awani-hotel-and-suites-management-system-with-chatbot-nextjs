import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/features/room/room-slice";
import { BanquetMenu, BanquetMenuFetchParams } from "@/types/banquet";
import {
  addBanquetMenu,
  deletBanquetMenus,
  deleteBanquetMenu,
  fetchBanquetMenu,
  fetchBanquetMenus,
  updateBanquetMenu,
} from "@/features/banquet/banquet-menus/banquet-menu-thunk";

export function useBanquetMenus() {
  const dispatch = useAppDispatch();
  const { menu, menus, pagination, isLoading, error } = useAppSelector(
    (state) => state.banquet_menu
  );
  return {
    menu,
    menus,
    pagination,
    isLoading,
    error,
    setLoading: () => dispatch(setLoading(true)),
    fetchBanquetMenus: (payload: BanquetMenuFetchParams | null) =>
      dispatch(fetchBanquetMenus(payload || {})),
    fetchBanquetMenu: (id: string) => dispatch(fetchBanquetMenu(id)),
    addBanquetMenu: (payload: FormData) => dispatch(addBanquetMenu(payload)),
    updateBanquetMenu: (payload: BanquetMenu) =>
      dispatch(updateBanquetMenu(payload)),
    deleteBanquetMenu: (id: string) => dispatch(deleteBanquetMenu(id)),
    deletBanquetMenus: (selectedKeys: Set<number> | "all") =>
      deletBanquetMenus({ selectedValues: selectedKeys }),
  };
}
