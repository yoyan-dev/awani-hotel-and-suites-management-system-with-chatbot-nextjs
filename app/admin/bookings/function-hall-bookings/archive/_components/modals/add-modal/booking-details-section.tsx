import { Select, SelectItem, Input, Chip, Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { formatPHP } from "@/lib/format-php";

interface Props {
  room_types: any[];
  rooms: any[];
  selectedRoomType?: string;
  setSelectedRoomType: (id: string) => void;
  specialRequests: { name: string; price: string; quantity: number }[];
  setSpecialRequests: React.Dispatch<
    React.SetStateAction<{ name: string; price: string; quantity: number }[]>
  >;
  typesLoading?: boolean;
  roomLoading?: boolean;
}

export default function BookingDetailsSection({
  room_types,
  rooms,
  selectedRoomType,
  setSelectedRoomType,
  specialRequests,
  setSpecialRequests,
  typesLoading,
  roomLoading,
}: Props) {
  return (
    <div className="space-y-4 w-full">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Booking Details
      </h1>
      <div className="pt-4">
        <Select
          isRequired
          fullWidth
          isLoading={typesLoading}
          radius="none"
          className="flex-1 w-full min-w-40"
          name="room_type_id"
          label="Room type"
          onChange={(e) => setSelectedRoomType(e.target.value)}
          labelPlacement="outside"
          placeholder="Select Room Type"
          variant="bordered"
        >
          {room_types.map((type) => (
            <SelectItem key={type.id} textValue={type.name}>
              <div className="flex flex-col">
                <span className="text-small">{type.name}</span>
                <span className="text-tiny text-gray-600 dark:text-gray-300">
                  {type.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>
      {selectedRoomType ? (
        <div className="pt-4">
          <Select
            fullWidth
            isLoading={roomLoading}
            radius="none"
            className="flex-1 w-full min-w-40"
            name="room_id"
            label="Assign Room"
            labelPlacement="outside"
            placeholder="Assign available room"
            variant="bordered"
          >
            {rooms.map((room) => (
              <SelectItem
                key={room.id}
                textValue={room.room_number?.toString() || ""}
              >
                <div className="flex flex-col">
                  <span className="text-small">{room.room_number}</span>
                  <span className="text-tiny text-gray-600 dark:text-gray-300">
                    {room.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
      ) : null}

      <div className="flex gap-4">
        <Input
          fullWidth
          variant="bordered"
          radius="none"
          isRequired
          type="date"
          label="Check-in Date"
          name="check_in"
        />

        <Input
          fullWidth
          variant="bordered"
          radius="none"
          isRequired
          type="date"
          label="Check-out Date"
          name="check_out"
        />
      </div>
      <div>
        <label>Special requests</label>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
          Select optional add-ons for this room. Use the plus/minus buttons to
          adjust the quantity.
        </p>

        <div className="flex gap-4 flex-wrap py-4">
          {specialRequests
            ? specialRequests.map((request: any) => (
                <div
                  className="flex flex-col gap-2 items-center"
                  key={request.name}
                >
                  <div className="flex items-center gap-4 ">
                    <span className="text-tiny text-default-700 dark:text-default-400">
                      {request.name}
                    </span>
                    <Chip color="success" size="sm" variant="flat">
                      {formatPHP(Number(request.price || 0))}
                    </Chip>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      isIconOnly
                      isDisabled={request.quantity === 0}
                      onPress={() =>
                        setSpecialRequests((prev) =>
                          prev.map((req) =>
                            req.name === request.name
                              ? {
                                  ...req,
                                  quantity: req.quantity - 1,
                                }
                              : req
                          )
                        )
                      }
                    >
                      <Minus size={8} />
                    </Button>
                    {request.quantity}
                    <Button
                      size="sm"
                      isIconOnly
                      onPress={() =>
                        setSpecialRequests((prev) =>
                          prev.map((req) =>
                            req.name === request.name
                              ? {
                                  ...req,
                                  quantity: req.quantity + 1,
                                }
                              : req
                          )
                        )
                      }
                    >
                      <Plus size={8} />
                    </Button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <Input
        isRequired
        variant="bordered"
        label="Number of Guests"
        placeholder="e.g. (1 adult, 1 child"
        labelPlacement="outside"
        name="number_of_guests"
        radius="none"
      />
    </div>
  );
}
