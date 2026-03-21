import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { Bed, Edit, House } from "lucide-react";
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
          startContent={<House size={14} />}
          href="/admin/rooms/function-rooms"
        >
          Funtion Rooms
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<Edit size={14} />}>
          Add New Room
        </BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}
