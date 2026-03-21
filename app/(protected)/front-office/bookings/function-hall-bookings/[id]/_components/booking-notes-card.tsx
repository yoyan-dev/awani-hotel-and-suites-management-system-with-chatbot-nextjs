import { Card, CardBody } from "@heroui/react";

interface BookingNotesCardProps {
  notes?: string;
}

export default function BookingNotesCard({ notes }: BookingNotesCardProps) {
  return (
    <Card radius="sm" className="border border-gray-200 shadow-none">
      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Notes</p>
          <p className="text-sm">{notes || "-"}</p>
        </div>
      </CardBody>
    </Card>
  );
}
