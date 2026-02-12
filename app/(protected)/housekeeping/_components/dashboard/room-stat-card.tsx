"use client";

import { Card, CardBody } from "@heroui/react";

interface Props {
  label: string;
  value: number;
  color?: string;
}

export function RoomStatCard({ label, value, color }: Props) {
  return (
    <Card className="border border-gray-200">
      <CardBody>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardBody>
    </Card>
  );
}
