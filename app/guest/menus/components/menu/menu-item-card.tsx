import { Card, CardBody } from "@heroui/react";
import { BanquetMenu } from "@/types/banquet";
import { formatPHP } from "@/lib/format-php";

interface Props {
  menu: BanquetMenu;
}

export default function BanquetMenuCard({ menu }: Props) {
  return (
    <Card
      radius="sm"
      shadow="sm"
      className="
        h-full
        border border-gray-200
        bg-white
        transition-colors
      "
      aria-label={`Banquet menu ${menu.name}`}
    >
      <CardBody className="p-4 flex flex-col gap-2">
        {/* Name + Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{menu.name}</h3>

          <span className="text-sm font-semibold text-green-600">
            ₱{menu.price}
          </span>
        </div>

        {/* Category */}
        {menu.category && (
          <span
            className="
              inline-block
              w-fit
              text-xs
              font-medium
              text-blue-700
              bg-blue-50
              px-2
              py-0.5
              rounded-[4px]
            "
          >
            {menu.category}
          </span>
        )}
      </CardBody>
    </Card>
  );
}
