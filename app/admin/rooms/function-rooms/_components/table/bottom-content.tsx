import React from "react";
import { Pagination } from "@heroui/react";
import { FetchRoomsParams } from "@/types/room";
import { FetchFunctionRoomParams } from "@/types/function-room";

interface Props {
  query: FetchFunctionRoomParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchFunctionRoomParams>>;
  pages: number;
  selectedKeys: any;
  roomsCount: any;
}

export const TableBottomContent: React.FC<Props> = ({
  query,
  setQuery,
  pages,
  selectedKeys,
  roomsCount,
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
          : `${selectedKeys.size} of ${roomsCount} selected`}
      </span>
    </div>
  );
};
