"use client";
import AddModal from "./modals/add-modal";

export default function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="space-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
          <p className="text-gray-500 dark:text-gray-300">{description}</p>
        </div>
        <AddModal />
      </div>
    </header>
  );
}
