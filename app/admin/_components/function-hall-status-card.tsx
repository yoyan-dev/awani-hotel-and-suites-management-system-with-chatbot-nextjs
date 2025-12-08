"use client";

import { Card } from "@heroui/react";

export const FunctionHallStatusCard = ({
  type,
  count,
  color,
}: {
  type: string;
  count: number;
  color: string;
}) => (
  <Card
    className={`p-6 shadow-md bg-linear-to-br from-${color}-50 to-white border border-${color}-300`}
  >
    <div className="text-xl font-bold">{count}</div>
    <p className="text-slate-600">{type}</p>
  </Card>
);
