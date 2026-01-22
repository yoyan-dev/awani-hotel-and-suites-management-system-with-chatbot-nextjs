"use client";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import Header from "./_components/header";
import React from "react";
import BanquetPackages from "./_components/banquet-packages";
import SkeletonLoader from "../../_components/skeleton-loader";
import { BanquetPackageFetchParams } from "@/types/banquet-package";

export default function page() {
  const {
    items,
    isLoading: packageIsLoading,
    fetchBanquetPackages,
  } = useBanquetPackages();

  React.useEffect(() => {
    fetchBanquetPackages({} as BanquetPackageFetchParams);
  }, []);
  return (
    <div className="bg-white dark:bg-gray-900 space-y-4">
      <Header />
      {!packageIsLoading ? (
        <BanquetPackages packages={items} />
      ) : (
        <SkeletonLoader />
      )}
    </div>
  );
}
