import { format } from "date-fns";

export default function AgendaEvent({ event }: any) {
  const start = new Date(event.dateDuration.start);
  start.setHours(14, 0, 0, 0);

  const end = new Date(event.dateDuration.end);
  end.setDate(end.getDate() + 1);
  end.setHours(8, 0, 0, 0);

  const [guestName, nights] = event.title
    .split("●")
    .map((t: string) => t.trim());

  return (
    <div
      className="p-3 rounded-md border-l-4 border-blue-500 bg-white shadow-sm"
      style={{ whiteSpace: "normal", lineHeight: 1.5 }}
    >
      <div className="text-sm text-gray-500 font-semibold mb-1">
        {format(start, "MMM d")}–{format(end, "d")}
      </div>

      <div className="text-xs text-gray-500 mb-2">
        {format(start, "EEE h:mm a")} – {format(end, "EEE h:mm a")}
      </div>

      <div className="font-medium text-gray-800 mb-1">
        {guestName} ● {nights}
      </div>

      <div className="text-xs text-gray-500">
        Room {event.roomNumber || "N/A"} – {event.roomType || "N/A"}
      </div>
    </div>
  );
}
