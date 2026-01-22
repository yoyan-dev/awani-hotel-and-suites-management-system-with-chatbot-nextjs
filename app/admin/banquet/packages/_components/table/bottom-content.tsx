import React from "react";
import { Pagination } from "@heroui/react";
import { BanquetPackageFetchParams } from "@/types/banquet-package";

interface Props {
  query: BanquetPackageFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<BanquetPackageFetchParams>>;
  pages: number;
  selectedKeys: any;
  totalItems: any;
}

export const TableBottomContent: React.FC<Props> = ({
  query,
  setQuery,
  pages,
  selectedKeys,
  totalItems,
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        color="primary"
        page={query.page}
        total={pages}
        variant="light"
        onChange={(page: number) => setQuery({ ...query, page: page })}
      />
      <span className="text-small text-default-400">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys.size} of ${totalItems} selected`}
      </span>
    </div>
  );
};
