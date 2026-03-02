import { FetchRoomTypesParams, RoomType } from "@/types/room";
import { Button, Chip, Form, Input, Select, SelectItem } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import ViewModal from "./modals/view-modal";
import PolicyModal from "./modals/policy-modal";
import { formatPHP } from "@/lib/format-php";
import GuestForm from "./guest-form";
import { BookingSpecialRequest } from "@/types/add-on";
import BookingSummary from "./booking-summary";

interface BookingFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  query: FetchRoomTypesParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchRoomTypesParams>>;
  roomTypes: RoomType[];
  room: RoomType | null;
  summary: {
    roomPrice: number;
    totalAddOnsPrice: number;
    nights: number;
    totalPerNights: number;
    total: number;
    specialRequests: BookingSpecialRequest[];
  } | null;
  isLoading: boolean;
  selectedRoom: any;
  setSelectedRoom: React.Dispatch<React.SetStateAction<any>>;
  specialRequests: BookingSpecialRequest[];
  setSpecialRequests: React.Dispatch<
    React.SetStateAction<BookingSpecialRequest[]>
  >;
  bookingIsLoading: boolean;
  addGuestIsLoading: boolean;
}

export default function BookingForm({
  onSubmit,
  query,
  setQuery,
  roomTypes,
  room,
  summary,
  isLoading,
  selectedRoom,
  setSelectedRoom,
  specialRequests,
  setSpecialRequests,
  bookingIsLoading,
  addGuestIsLoading,
}: BookingFormProps) {
  const [policySignature, setPolicySignature] = useState("");
  const [isGuestIdVerified, setIsGuestIdVerified] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState("1");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const selectedAddOns = React.useMemo(
    () => (summary?.specialRequests ?? []).filter((item) => item.quantity > 0),
    [summary],
  );

  const evaluateFormCompletion = React.useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    setIsFormComplete(form.checkValidity() && isGuestIdVerified);
  }, [isGuestIdVerified]);

  React.useEffect(() => {
    evaluateFormCompletion();
  }, [
    evaluateFormCompletion,
    query.checkIn,
    query.checkOut,
    selectedRoom,
    specialRequests,
    numberOfGuests,
  ]);

  return (
    <Form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex-1 px-4 w-full space-y-4"
    >
      <GuestForm onIdVerificationChange={setIsGuestIdVerified} />

      <div className="space-y-4 w-full">
        <h1>
          <Chip color="primary" className="text-sm">
            2
          </Chip>
          -Booking Details
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">
          Fill in your booking preferences below. All fields are editable.
        </p>
        {room ? (
          <div className="flex w-full justify-end md:hidden">
            <ViewModal room={room} />
          </div>
        ) : null}
        <div className="flex gap-4">
          <Input
            fullWidth
            variant="underlined"
            isRequired
            type="date"
            label="checked_in Date"
            name="checked_in"
            value={query.checkIn}
            onChange={(e) => setQuery({ ...query, checkIn: e.target.value })}
          />

          <Input
            fullWidth
            variant="underlined"
            isRequired
            type="date"
            label="checked_out Date"
            name="checked_out"
            value={query.checkOut}
            onChange={(e) => setQuery({ ...query, checkOut: e.target.value })}
          />
        </div>
        {query.checkIn && query.checkOut && roomTypes.length <= 0 ? (
          <div>No Available rooms on a selected date</div>
        ) : null}
        <div className="py-4">
          <Select
            isRequired
            fullWidth
            isLoading={isLoading}
            radius="none"
            className="flex-1 w-full min-w-40"
            name="room_type_id"
            label="Room type"
            value={selectedRoom}
            defaultSelectedKeys={[selectedRoom]}
            onChange={(e) => setSelectedRoom(e.target.value)}
            labelPlacement="outside"
            placeholder="Select Room Type"
            variant="bordered"
          >
            {roomTypes.map((type) => (
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

        <Input
          fullWidth
          variant="bordered"
          name="company"
          labelPlacement="outside"
          radius="none"
          label="Company (Optional)"
          placeholder="Company name"
        />

        {specialRequests ? (
          <div>
            <label>Special requests</label>
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
                              ? { ...req, quantity: req.quantity - 1 }
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
                              ? { ...req, quantity: req.quantity + 1 }
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
          </div>
        ) : null}

        <Input
          variant="bordered"
          isRequired
          labelPlacement="outside"
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
          radius="none"
          type="number"
          placeholder="0"
          label="Number of Guests"
          name="number_of_guests"
          min={1}
          max={room?.max_guest}
          errorMessage={`Maximum guests allowed: ${room?.max_guest}`}
        />

        {isFormComplete && summary ? (
          <BookingSummary
            summary={summary}
            query={query}
            room={room}
            selectedAddOns={selectedAddOns}
          />
        ) : null}
      </div>

      <div className="space-y-4">
        <h1 className="px-2 bg-primary text-white md:text-xl">Declaration</h1>
        <div>
          <p className="text-sm text-gray-600">
            The information I have given is true, correct and complete. I
            understand failure to answer any question may have serious
            consequences.
          </p>
        </div>
        <div className="flex justify-between">
          <PolicyModal onConfirm={(sig) => setPolicySignature(sig)} />

          <Button
            isLoading={bookingIsLoading || addGuestIsLoading}
            isDisabled={!policySignature || !isGuestIdVerified}
            type="submit"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
}
