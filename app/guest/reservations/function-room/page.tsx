"use client";
import Header from "./_components/header";
import React from "react";
import BanquetPackages from "./_components/banquet-packages";
import SkeletonLoader from "../../_components/skeleton-loader";

export default function page() {
  // const {
  //   items,
  //   isLoading: packageIsLoading,
  //   fetchBanquetPackages,
  // } = useBanquetPackages();

  // React.useEffect(() => {
  //   fetchBanquetPackages({} as BanquetPackageFetchParams);
  // }, []);
  return (
    <div className="bg-white dark:bg-gray-900 space-y-4 pb-16">
      <Header />
      {/* {!packageIsLoading ? (
        <BanquetPackages packages={items} />
      ) : (
        <SkeletonLoader />
      )} */}
    </div>
  );
}
