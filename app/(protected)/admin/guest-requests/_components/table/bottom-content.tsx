import React from "react";
import { Pagination } from "@heroui/react";

interface Props {
  hasSearchFilter: boolean;
  page: number;
  setPage: (val: number) => void;
  pages: number;
  selectedKeys: any;
  itemsLength: number;
}

export const TableBottomContent: React.FC<Props> = ({
  hasSearchFilter,
  page,
  setPage,
  pages,
  selectedKeys,
  itemsLength,
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        color="primary"
        isDisabled={hasSearchFilter}
        page={page}
        total={pages}
        variant="light"
        onChange={setPage}
      />
      <span className="text-small text-default-400">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys.size} of ${itemsLength} selected`}
      </span>
    </div>
  );
};
