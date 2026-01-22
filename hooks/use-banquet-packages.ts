import {
  addBanquetPackage,
  deleteBanquetPackage,
  deleteBanquetPackages,
  fetchBanquetPackage,
  fetchBanquetPackages,
  updateBanquetPackage,
} from "@/features/banquet-packages/banquet-package-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  BanquetPackage,
  BanquetPackageFetchParams,
} from "@/types/banquet-package";

export function useBanquetPackages() {
  const dispatch = useAppDispatch();
  const { item, items, pagination, isLoading, error } = useAppSelector(
    (state) => state.banquet_package
  );
  return {
    item,
    items,
    pagination,
    isLoading,
    error,
    fetchBanquetPackages: (payload: BanquetPackageFetchParams | undefined) =>
      dispatch(fetchBanquetPackages(payload)),
    fetchBanquetPackage: (id: string) => dispatch(fetchBanquetPackage(id)),
    addBanquetPackage: (payload: FormData) =>
      dispatch(addBanquetPackage(payload)),
    updateBanquetPackage: (payload: BanquetPackage) =>
      dispatch(updateBanquetPackage(payload)),
    deleteBanquetPackage: (id: string) => dispatch(deleteBanquetPackage(id)),
    deleteBanquetPackages: (selectedKeys: Set<number> | "all") =>
      deleteBanquetPackages({ selectedValues: selectedKeys }),
  };
}
