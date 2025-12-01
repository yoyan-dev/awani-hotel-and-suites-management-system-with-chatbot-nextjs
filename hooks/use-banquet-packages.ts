import {
  addBanquetPackage,
  deleteBanquetPackage,
  deleteBanquetPackages,
  fetchBanquetPackage,
  fetchBanquetPackages,
  updateBanquetPackage,
} from "@/features/banquet/banquet-packages/banquet-package-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BanquetMenu } from "@/types/banquet";

export function useBanquetPackages() {
  const dispatch = useAppDispatch();
  const { banquet_package, banquet_packages, isLoading, error } =
    useAppSelector((state) => state.banquet_package);
  return {
    banquet_packages,
    banquet_package,
    isLoading,
    error,
    fetchBanquetPackages: () => dispatch(fetchBanquetPackages()),
    fetchBanquetPackage: (id: string) => dispatch(fetchBanquetPackage(id)),
    addBanquetPackage: (payload: FormData) =>
      dispatch(addBanquetPackage(payload)),
    updateBanquetPackage: (payload: BanquetMenu) =>
      dispatch(updateBanquetPackage(payload)),
    deleteBanquetPackage: (id: string) => dispatch(deleteBanquetPackage(id)),
    deleteBanquetPackages: (selectedKeys: Set<number> | "all") =>
      deleteBanquetPackages({ selectedValues: selectedKeys }),
  };
}
