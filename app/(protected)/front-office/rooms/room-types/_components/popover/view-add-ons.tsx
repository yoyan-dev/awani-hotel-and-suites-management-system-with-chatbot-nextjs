import { formatPHP } from "@/lib/format-php";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Chip,
} from "@heroui/react";

interface AddOnsProps {
  addOns: {
    id?: string;
    quantity_limit: number;
    add_on?: { name?: string; price?: string | number } | null;
    remaining_quantity?: number;
  }[];
}

export default function ViewAddOns({ addOns }: AddOnsProps) {
  return (
    <Popover showArrow offset={10} placement="bottom">
      <PopoverTrigger>
        <Button color="primary" variant="flat" size="sm">
          View Add ons
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        {(titleProps) => (
          <div className="px-1 py-2 w-full">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Add Ons
            </p>
            <div className="mt-2 flex flex-col gap-2 w-full">
              {addOns.map((row, index) => (
                <Chip key={index}>
                  {row.add_on?.name}{" "}
                  {row.add_on?.price !== undefined &&
                    ` - ${formatPHP(Number(row.add_on.price) || 0)}`}{" "}
                  (limit: {row.quantity_limit}
                  {row.remaining_quantity !== undefined
                    ? `, remaining: ${row.remaining_quantity}`
                    : ""}
                  )
                </Chip>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
