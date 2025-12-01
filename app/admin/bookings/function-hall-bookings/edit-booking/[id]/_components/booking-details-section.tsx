import { Select, SelectItem, Input, Chip, Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import React from "react";
import { Booking } from "@/types/booking";

interface Props {
  formData: Booking;
  setFormData: React.Dispatch<React.SetStateAction<Booking>>;
  room_types: any[];
  rooms: any[];
  specialRequests: {
    name: string;
    price: string;
    quantity: number;
    max_quantity: number;
  }[];
  setSpecialRequests: React.Dispatch<
    React.SetStateAction<
      { name: string; price: string; quantity: number; max_quantity: number }[]
    >
  >;
  typesLoading?: boolean;
  roomLoading?: boolean;
}

function formatDateISO(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BookingDetailsSection({
  formData,
  setFormData,
  room_types,
  rooms,
  specialRequests,
  setSpecialRequests,
  typesLoading,
  roomLoading,
}: Props) {
  const [checkInDate, setCheckInDate] = React.useState<string>(
    formData.check_in
  );
  const [checkOutDate, setCheckOutDate] = React.useState<string>(
    formData.check_out
  );

  const today = React.useMemo(() => formatDateISO(new Date()), []);
  const minCheckout = React.useMemo(() => {
    if (!checkInDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return formatDateISO(tomorrow);
    }
    const d = new Date(checkInDate);
    d.setDate(d.getDate() + 1);
    return formatDateISO(d);
  }, [checkInDate]);

  React.useEffect(() => {
    setFormData({
      ...formData,
      check_in: checkInDate,
      check_out: checkOutDate,
    });
    if (!checkInDate) {
      setCheckOutDate("");
      return;
    }
    if (!checkOutDate) {
      return;
    }
    if (checkOutDate < minCheckout) {
      setCheckOutDate(minCheckout);
    }
  }, [checkInDate, minCheckout, checkOutDate]);

  return (
    <div className="space-y-4 w-full">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Booking Details
      </h1>
      <div className="pt-4">
        <Select
          isRequired
          fullWidth
          isDisabled={typesLoading}
          isLoading={typesLoading}
          radius="none"
          className="flex-1 w-full min-w-40"
          name="room_type_id"
          label="Room type"
          onChange={(e) => {
            setFormData({
              ...formData,
              room_type_id: e.target.value,
              room_id: "",
            });
          }}
          selectedKeys={[formData.room_type_id]}
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
      <div className="flex gap-4">
        <Input
          fullWidth
          variant="bordered"
          radius="none"
          isRequired
          type="date"
          label="Check-in Date"
          name="check_in"
          value={checkInDate || formData.check_in}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCheckInDate(e.target.value)
          }
          min={today}
        />

        <Input
          fullWidth
          variant="bordered"
          radius="none"
          isRequired
          type="date"
          label="Check-out Date"
          name="check_out"
          value={checkOutDate || formData.check_out}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCheckOutDate(e.target.value)
          }
          min={minCheckout}
          disabled={!checkInDate}
        />
      </div>

      {formData.room_type_id && (checkInDate || formData.check_in) ? (
        <div className="pt-4">
          <Select
            fullWidth
            isDisabled={roomLoading}
            isLoading={roomLoading}
            radius="none"
            className="flex-1 w-full min-w-40"
            name="room_id"
            label="Assign Room"
            labelPlacement="outside"
            placeholder="Assign available room"
            selectedKeys={[formData.room_id]}
            value={formData.room_id}
            onChange={(e) =>
              setFormData({ ...formData, room_id: e.target.value })
            }
            variant="bordered"
          >
            {rooms.map((room: any) => (
              <SelectItem
                key={room.id}
                textValue={room.room_number?.toString() || ""}
              >
                <div className="flex flex-col">
                  <span className="font-medium">Room {room.room_number}</span>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-default-700 dark:text-default-400">
                      {room.availability}
                    </span>
                    <Chip
                      size="sm"
                      color={
                        room.status === "available"
                          ? "success"
                          : room.status === "occupied"
                            ? "danger"
                            : "warning"
                      }
                      className="capitalize"
                    >
                      {room.status}
                    </Chip>
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
      ) : null}

      <div>
        <label>Special requests</label>
        {specialRequests.length > 0 ? (
          <>
            <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
              Select optional add-ons for this room. Use the plus/minus buttons
              to adjust the quantity.
            </p>

            <div className="flex gap-4 flex-wrap py-4">
              {specialRequests.map((request: any) => (
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
                      isDisabled={
                        request.quantity >= Number(request?.max_quantity)
                      }
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
              ))}
            </div>
          </>
        ) : (
          <div>
            <span>No special requests</span>{" "}
            <Button size="sm" variant="flat" color="primary">
              Add special requests
            </Button>
          </div>
        )}
      </div>
      <Input
        isRequired
        variant="bordered"
        type="nmber"
        value={formData.number_of_guests?.toString()}
        onChange={(e) =>
          setFormData({ ...formData, number_of_guests: Number(e.target.value) })
        }
        label="Number of Guests"
        placeholder="Enter number of guest"
        labelPlacement="outside"
        name="number_of_guests"
        radius="none"
      />
    </div>
  );
}
