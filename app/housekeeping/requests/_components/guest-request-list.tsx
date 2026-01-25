import { GuestRequest } from "@/types/gues-request";
import { GuestRequestCard } from "./guest-request-card";

interface Props {
  requests: GuestRequest[];
  handleComplete: (id: string) => void;
  handleCancel: (id: string) => void;
}

export function GuestRequestList({
  requests,
  handleComplete,
  handleCancel,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {requests.map((req) => (
        <GuestRequestCard
          key={req.id}
          request={req}
          onComplete={() => handleComplete(req.id as string)}
          onCancel={() => handleCancel(req.id as string)}
        />
      ))}
    </div>
  );
}
