import React from "react";

interface FilterBarProps {
  startDate?: string;
  endDate?: string;
  onChange: (start?: string, end?: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  startDate,
  endDate,
  onChange,
}) => (
  <div className="flex gap-2 items-center mb-4">
    <input
      type="date"
      value={startDate}
      onChange={(e) => onChange(e.target.value, endDate)}
      className="p-2 border border-gray-300 rounded"
    />
    <span>-</span>
    <input
      type="date"
      value={endDate}
      onChange={(e) => onChange(startDate, e.target.value)}
      className="p-2 border border-gray-300 rounded"
    />
  </div>
);
