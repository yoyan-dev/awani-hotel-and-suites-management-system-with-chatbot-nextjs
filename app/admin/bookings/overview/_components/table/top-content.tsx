import React from "react";

interface Props {
  bookingsCount: number;
}

export const TableTopContent: React.FC<Props> = ({ bookingsCount }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        Bookings{" "}
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {bookingsCount} bookings
        </span>
      </div>
    </div>
  );
};
