import { Select, SelectItem, Input, Chip, Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import React from "react";
import { Booking } from "@/types/booking";
import { BookingSpecialRequest } from "@/types/add-on";
import GuestBreakdownFields from "@/app/guest/reservations/hotel-rooms/reservation/[id]/_components/guest-breakdown-fields";
import {
  createGuestBreakdown,
  getGuestBreakdownTotal,
  parseGuestBreakdown,
} from "@/lib/booking/guest-breakdown";

interface Props {
  formData: Booking;
  setFormData: React.Dispatch<React.SetStateAction<Booking>>;
  room_types: any[];
  rooms: any[];
  specialRequests: BookingSpecialRequest[];
  setSpecialRequests: React.Dispatch<
    React.SetStateAction<BookingSpecialRequest[]>
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
    formData.checked_in,
  );
  const [checkOutDate, setCheckOutDate] = React.useState<string>(
    formData.checked_out,
  );
  const [guestBreakdown, setGuestBreakdown] = React.useState(() =>
    createGuestBreakdown({
      adult: Number(formData.number_of_guests ?? 1),
    }),
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
      checked_in: checkInDate,
      checked_out: checkOutDate,
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

  React.useEffect(() => {
    const parsedBreakdown = parseGuestBreakdown(formData.guest_breakdown);
    if (parsedBreakdown) {
      setGuestBreakdown(parsedBreakdown);
      return;
    }

    const totalGuests = Number(formData.number_of_guests ?? 0);
    setGuestBreakdown(
      createGuestBreakdown({
        adult:
          Number.isFinite(totalGuests) && totalGuests > 0 ? totalGuests : 1,
      }),
    );
  }, [formData.guest_breakdown, formData.number_of_guests]);

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
          label="checked_in Date"
          name="checked_in"
          value={checkInDate || formData.checked_in}
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
          label="checked_out Date"
          name="checked_out"
          value={checkOutDate || formData.checked_out}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCheckOutDate(e.target.value)
          }
          min={minCheckout}
          disabled={!checkInDate}
        />
      </div>

      {formData.room_type_id && (checkInDate || formData.checked_in) ? (
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
                  key={
                    request.room_type_add_on_id ??
                    request.add_on_id ??
                    request.name
                  }
                >
                  <div className="flex items-center gap-4 ">
                    <span className="text-tiny text-default-700 dark:text-default-400">
                      {request.name} (remaining{" "}
                      {request.remaining_quantity ??
                        request.quantity_limit ??
                        0}
                      )
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
                            (req.room_type_add_on_id ?? req.name) ===
                            (request.room_type_add_on_id ?? request.name)
                              ? {
                                  ...req,
                                  quantity: req.quantity - 1,
                                }
                              : req,
                          ),
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
                        request.quantity >=
                        Number(
                          request.remaining_quantity ??
                            request.quantity_limit ??
                            0,
                        )
                      }
                      onPress={() =>
                        setSpecialRequests((prev) =>
                          prev.map((req) =>
                            (req.room_type_add_on_id ?? req.name) ===
                            (request.room_type_add_on_id ?? request.name)
                              ? {
                                  ...req,
                                  quantity: req.quantity + 1,
                                }
                              : req,
                          ),
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
      <GuestBreakdownFields
        value={guestBreakdown}
        onChange={(nextBreakdown) => {
          setGuestBreakdown(nextBreakdown);
          setFormData({
            ...formData,
            guest_breakdown: nextBreakdown,
            number_of_guests: getGuestBreakdownTotal(nextBreakdown),
          });
        }}
        maxGuests={
          room_types.find((type) => type.id === formData.room_type_id)
            ?.max_guest
        }
        radius="none"
        variant="bordered"
        helperText="Specify categories like adult, child, infant, senior, PWD, or other."
      />
    </div>
  );
}
