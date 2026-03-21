import { bookingStatusColorMap } from "@/app/constants/function-hall-booking";
import { Button, Chip } from "@heroui/react";

interface BookingDetailsHeaderProps {
  bookingNumber?: string;
  status?: string;
  onDownloadPdf: () => void;
}

export default function BookingDetailsHeader({
  bookingNumber,
  status,
  onDownloadPdf,
}: BookingDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Booking #{bookingNumber}</h1>
        <p className="mt-1 text-sm text-gray-500">Function Room Details</p>
      </div>

      <div className="flex items-center gap-2">
        <Chip
          variant="flat"
          className={`uppercase text-sm ${bookingStatusColorMap[status || "default"]}`}
        >
          {status || "Pending"}
        </Chip>
        <Button type="button" color="primary" variant="flat" onPress={onDownloadPdf}>
          Download PDF
        </Button>
      </div>
    </div>
  );
}
