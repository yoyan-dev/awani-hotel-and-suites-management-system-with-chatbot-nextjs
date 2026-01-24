import { Chip } from "@heroui/react";

export function GuestRequestStatusChip({
  status,
}: {
  status?: "pending" | "completed" | "cancelled";
}) {
  const color =
    status === "completed"
      ? "success"
      : status === "cancelled"
        ? "danger"
        : "warning";

  return (
    <Chip size="sm" variant="flat" color={color}>
      {status?.toUpperCase()}
    </Chip>
  );
}
