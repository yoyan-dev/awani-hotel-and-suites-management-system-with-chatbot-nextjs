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
  addOns: { name: string; price: string }[];
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
                  {row.name}{" "}
                  {row.price && ` - ${formatPHP(Number(row.price) || 0)}`}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
