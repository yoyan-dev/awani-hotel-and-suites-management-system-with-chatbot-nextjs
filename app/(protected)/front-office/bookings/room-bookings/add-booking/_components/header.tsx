import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { Bed, Edit } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <div className="px-2">
      <Breadcrumbs
        itemClasses={{
          item: ["data-[current=true]:text-primary transition-colors"],
        }}
      >
        <BreadcrumbItem
          startContent={<Bed size={14} />}
          href="/admin/bookings/room-bookings"
        >
          Room Bookings
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<Edit size={14} />}>
          Add Booking
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}
