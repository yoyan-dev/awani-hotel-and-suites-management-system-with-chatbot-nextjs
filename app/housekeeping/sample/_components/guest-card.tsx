import { Card } from "@heroui/react";
import { format } from "date-fns";

interface GuestMovement {
  id: string;
  guestName: string;
  roomNumber: string | number;
  nights: number;
  arrival: string; // ISO date string
  departure: string; // ISO date string
}

interface Props {
  guest: GuestMovement;
}

export default function GuestCard({ guest }: Props) {
  return (
    <Card className="p-4 rounded-md shadow-sm flex flex-col sm:flex-row justify-between gap-2">
      <div className="flex-1 flex flex-col sm:flex-row sm:gap-4 items-start sm:items-center">
        <span className="font-medium text-gray-800">{guest.guestName}</span>
        <span className="text-gray-600">Room: {guest.roomNumber}</span>
        <span className="text-gray-600">Nights: {guest.nights}</span>
      </div>

      {/* Dates */}
      <div className="flex gap-4 mt-2 sm:mt-0">
        <span className="text-sm text-gray-500">
          Arrival: {format(new Date(guest.arrival), "MMM dd, yyyy")}
        </span>
        <span className="text-sm text-gray-500">
          Departure: {format(new Date(guest.departure), "MMM dd, yyyy")}
        </span>
      </div>
    </Card>
  );
}
