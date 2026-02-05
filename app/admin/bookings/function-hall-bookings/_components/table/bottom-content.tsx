import React from "react";
import { Pagination } from "@heroui/react";
import {
  FunctionHallBookingPagination,
  FetchFunctionHallBookingParams,
} from "@/types/function-room-booking";

interface Props {
  query: FetchFunctionHallBookingParams;
  setQuery: React.Dispatch<
    React.SetStateAction<FetchFunctionHallBookingParams>
  >;
  pages: number;
  selectedKeys: any;
  itemsLength: number;
}

export const TableBottomContent: React.FC<Props> = ({
  query,
  setQuery,
  pages,
  selectedKeys,
  itemsLength,
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
          : `${selectedKeys.size} of ${itemsLength} selected`}
      </span>
    </div>
  );
};
