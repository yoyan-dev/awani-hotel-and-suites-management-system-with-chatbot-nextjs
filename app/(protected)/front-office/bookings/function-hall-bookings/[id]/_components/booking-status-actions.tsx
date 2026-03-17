import { Button, Card, CardBody } from "@heroui/react";

interface BookingStatusActionsProps {
  status?: string;
  onUpdateStatus: (status: string) => void | Promise<void>;
  onOpenMarkConfirmed: () => void;
}

export default function BookingStatusActions({
  status,
  onUpdateStatus,
  onOpenMarkConfirmed,
}: BookingStatusActionsProps) {
  if (
    status === "rejected" ||
    status === "cancelled" ||
    status === "completed"
  ) {
    return null;
  }

  return (
    <Card radius="sm" className="border border-gray-200 shadow-none">
      <CardBody className="flex justify-end gap-2">
        {status === "pending" ? (
          <>
            <Button
              color="danger"
              variant="flat"
              onPress={() => onUpdateStatus("rejected")}
            >
              Reject Booking
            </Button>
            <Button color="success" onPress={onOpenMarkConfirmed}>
              Mark Confirmed
            </Button>
          </>
        ) : status === "confirmed" ? (
          <>
            <Button
              color="warning"
              variant="flat"
              onPress={() => onUpdateStatus("ongoing")}
            >
              Mark Ongoing
            </Button>
            <Button
              color="danger"
              variant="flat"
              onPress={() => onUpdateStatus("cancelled")}
            >
              Mark Cancelled
            </Button>
          </>
        ) : status === "ongoing" ? (
          <>
            <Button
              color="success"
              variant="flat"
              onPress={() => onUpdateStatus("completed")}
            >
              Mark Complete
            </Button>
            <Button
              color="danger"
              variant="flat"
              onPress={() => onUpdateStatus("cancelled")}
            >
              Mark Cancelled
            </Button>
          </>
        ) : (
          <Button
            color="danger"
            variant="flat"
            onPress={() => onUpdateStatus("cancelled")}
          >
            Mark Cancelled
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
