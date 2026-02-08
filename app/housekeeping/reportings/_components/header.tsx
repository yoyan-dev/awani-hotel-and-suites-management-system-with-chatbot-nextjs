import React from "react";
import AddModal from "./modals/add-modal";

export default function Header() {
  return (
    <header className="space-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Housekeeping Room Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Track lost, damaged, and reported room items efficiently
          </p>
        </div>
        <AddModal />
      </div>
    </header>
  );
}
