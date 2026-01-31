import React, { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-gray-700 mb-2">{title}</h4>
      {children}
    </div>
  );
};
