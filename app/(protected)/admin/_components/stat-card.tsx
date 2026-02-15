"use client";

import { Card } from "@heroui/react";

export const StatCard = ({
  title,
  value,
  trend,
}: {
  title: string;
  value: string | number;
  trend: string;
}) => (
  <Card className="p-5 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl border border-slate-200">
    <h3 className="text-slate-500 text-sm">{title}</h3>
    <div className="text-2xl font-semibold mt-1">{value}</div>
    <span className="text-emerald-600 text-sm">{trend}</span>
  </Card>
);
