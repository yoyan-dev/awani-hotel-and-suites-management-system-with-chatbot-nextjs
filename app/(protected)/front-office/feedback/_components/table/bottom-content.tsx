import React from "react";
import { Pagination } from "@heroui/react";
import { FeedbackFetchParams } from "@/types/feedback";

interface Props {
  query: FeedbackFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<FeedbackFetchParams>>;
  pages: number;
  totalItems: any;
}

export const TableBottomContent: React.FC<Props> = ({
  query,
  setQuery,
  pages,
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
        {totalItems} guest feedbacks
      </span>
    </div>
  );
};
