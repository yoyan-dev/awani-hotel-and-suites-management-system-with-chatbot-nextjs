import React from "react";
import { Pagination } from "@heroui/react";
import { BanquetMenuFetchParams } from "@/types/banquet";

interface Props {
  query: BanquetMenuFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<BanquetMenuFetchParams>>;
  pages: number;
  selectedKeys: any;
  totalMenus: any;
}

export const TableBottomContent: React.FC<Props> = ({
  query,
  setQuery,
  pages,
  selectedKeys,
  totalMenus,
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
          : `${selectedKeys.size} of ${totalMenus} selected`}
      </span>
    </div>
  );
};
