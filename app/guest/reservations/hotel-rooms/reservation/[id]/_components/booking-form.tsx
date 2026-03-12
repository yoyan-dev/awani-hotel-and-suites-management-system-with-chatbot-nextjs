import { FetchRoomTypesParams, RoomType } from "@/types/room";
import {
  addToast,
  Button,
  Chip,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
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

function formatDateLabel(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfTomorrow() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return date;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [previewData, setPreviewData] = useState({
    full_name: "",
    contact_number: "",
    address: "",
    nationality: "",
    gender: "",
    email: "",
    checked_in: "",
    checked_out: "",
    room_name: "",
    company: "",
    number_of_guests: "",
  });
  const formRef = React.useRef<HTMLFormElement>(null);
  const minCheckInDate = React.useMemo(
    () => toDateInputValue(startOfTomorrow()),
    [],
  );
  const minCheckOutDate = React.useMemo(() => {
    const checkIn = parseLocalDate(String(query.checkIn || ""));
    const minimum = checkIn ? addDays(checkIn, 1) : startOfTomorrow();
    return toDateInputValue(minimum);
  }, [query.checkIn]);

  const selectedAddOns = React.useMemo(
    () => (summary?.specialRequests ?? []).filter((item) => item.quantity > 0),
    [summary],
  );

  const readField = React.useCallback((name: string) => {
    const form = formRef.current;
    if (!form) return "";
    const value = new FormData(form).get(name);
    return typeof value === "string" ? value.trim() : "";
  }, []);

  function validateGuestStep() {
    const required: Array<{ name: string; label: string }> = [
      { name: "full_name", label: "full name" },
      { name: "contact_number", label: "contact number" },
      { name: "address", label: "home address" },
      { name: "nationality", label: "nationality" },
      { name: "gender", label: "gender" },
      { name: "email", label: "email" },
    ];

    for (const field of required) {
      if (!readField(field.name)) {
        addToast({
          title: "Missing Information",
          description: `Please provide your ${field.label}.`,
          color: "warning",
        });
        return false;
      }
    }

    if (!isGuestIdVerified) {
      addToast({
        title: "ID Verification Required",
        description:
          "Please upload and verify both front and back ID images to continue.",
        color: "warning",
      });
      return false;
    }

    return true;
  }

  function validateBookingStep() {
    if (!query.checkIn || !query.checkOut) {
      addToast({
        title: "Missing Dates",
        description: "Please select check-in and check-out dates.",
        color: "warning",
      });
      return false;
    }

    const checkedIn = new Date(String(query.checkIn));
    const checkedOut = new Date(String(query.checkOut));
    if (
      Number.isNaN(checkedIn.getTime()) ||
      Number.isNaN(checkedOut.getTime()) ||
      checkedIn >= checkedOut
    ) {
      addToast({
        title: "Invalid Date Range",
        description: "Check-out date must be later than check-in date.",
        color: "warning",
      });
      return false;
    }

    if (!selectedRoom) {
      addToast({
        title: "Room Required",
        description: "Please select a room type.",
        color: "warning",
      });
      return false;
    }

    const guests = Number(readField("number_of_guests"));
    if (!Number.isFinite(guests) || guests <= 0) {
      addToast({
        title: "Invalid Number of Guests",
        description: "Please enter a valid number of guests.",
        color: "warning",
      });
      return false;
    }

    if (room?.max_guest && guests > Number(room.max_guest)) {
      addToast({
        title: "Guest Limit Exceeded",
        description: `Maximum guests allowed for this room: ${room.max_guest}.`,
        color: "warning",
      });
      return false;
    }

    return true;
  }

  function capturePreviewData() {
    setPreviewData({
      full_name: readField("full_name"),
      contact_number: readField("contact_number"),
      address: readField("address"),
      nationality: readField("nationality"),
      gender: readField("gender"),
      email: readField("email"),
      checked_in: formatDateLabel(String(query.checkIn || "")),
      checked_out: formatDateLabel(String(query.checkOut || "")),
      room_name: room?.name || "-",
      company: readField("company"),
      number_of_guests: readField("number_of_guests"),
    });
  }

  function handleNext() {
    if (step === 1) {
      if (!validateGuestStep()) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!validateBookingStep()) return;
      capturePreviewData();
      setStep(3);
    }
  }

  function handlePrevious() {
    if (step === 2) {
      setStep(1);
      return;
    }
    if (step === 3) {
      setStep(2);
    }
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (step !== 3) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  }

  return (
    <Form
      ref={formRef}
      onSubmit={handleFormSubmit}
      className="flex-1 w-full space-y-6 rounded-3xl border border-[#e7dccd] bg-[#fffefb] p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full px-3 py-1 font-medium ${
            step >= 1
              ? "bg-[#b08a53] text-white"
              : "bg-[#f0e6d7] text-[#7a6e5f]"
          }`}
        >
          1. Guest Info
        </span>
        <span
          className={`rounded-full px-3 py-1 font-medium ${
            step >= 2
              ? "bg-[#b08a53] text-white"
              : "bg-[#f0e6d7] text-[#7a6e5f]"
          }`}
        >
          2. Booking Details
        </span>
        <span
          className={`rounded-full px-3 py-1 font-medium ${
            step >= 3
              ? "bg-[#b08a53] text-white"
              : "bg-[#f0e6d7] text-[#7a6e5f]"
          }`}
        >
          3. Preview
        </span>
      </div>

      <div className={step === 1 ? "w-full" : "hidden"}>
        <GuestForm onIdVerificationChange={setIsGuestIdVerified} />
      </div>

      <div className={step === 2 ? "space-y-4 w-full" : "hidden"}>
        <h1 className="font-serif text-2xl text-[#271f14]">
          <Chip className="mr-2 bg-[#b08a53] text-sm text-white">2</Chip>
          Booking Details
        </h1>
        <p className="mb-3 text-xs text-[#6c6254]">
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
            variant="bordered"
            isRequired
            type="date"
            label="checked in Date"
            name="checked_in"
            radius="lg"
            value={query.checkIn}
            min={minCheckInDate}
            onChange={(e) => setQuery({ ...query, checkIn: e.target.value })}
          />

          <Input
            fullWidth
            variant="bordered"
            isRequired
            type="date"
            label="checked out Date"
            name="checked_out"
            radius="lg"
            isDisabled={!query.checkIn}
            value={query.checkOut}
            min={minCheckOutDate}
            onChange={(e) => setQuery({ ...query, checkOut: e.target.value })}
          />
        </div>
        {query.checkIn && query.checkOut && roomTypes.length <= 0 ? (
          <div>No available rooms on selected dates.</div>
        ) : null}
        <div className="py-4">
          <Select
            isRequired
            fullWidth
            isLoading={isLoading}
            radius="lg"
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
          radius="lg"
          label="Company (Optional)"
          placeholder="Company name"
        />

        {specialRequests ? (
          <div className="rounded-2xl border border-[#e8ddcc] bg-[#fcf8f2] p-4">
            <label>Special requests</label>
            <p className="mb-2 text-xs text-[#6b6153]">
              Select optional add-ons for this room. Use the plus/minus buttons
              to adjust the quantity.
            </p>

            <div className="flex flex-wrap gap-4 py-2">
              {specialRequests.map((request: any) => (
                <div
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#eadfce] bg-white p-3"
                  key={
                    request.room_type_add_on_id ??
                    request.add_on_id ??
                    request.name
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-tiny text-[#5f5548]">
                      {request.name} (remaining{" "}
                      {request.remaining_quantity ??
                        request.quantity_limit ??
                        0}
                      )
                    </span>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-[#e6f4ea] text-[#2f7b4f]"
                    >
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
          radius="lg"
          type="number"
          placeholder="0"
          label="Number of Guests"
          name="number_of_guests"
          min={1}
          max={room?.max_guest}
          errorMessage={`Maximum guests allowed: ${room?.max_guest}`}
        />
      </div>

      <div className={step === 3 ? "space-y-4 w-full" : "hidden"}>
        <h1 className="font-serif text-2xl text-[#281f14]">Preview Details</h1>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e7dccd] bg-[#fcf8f2] p-4 text-sm md:grid-cols-2">
          <div>
            <p className="text-[#7a6f62]">Full Name</p>
            <p className="font-medium">{previewData.full_name || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Contact Number</p>
            <p className="font-medium">{previewData.contact_number || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Email</p>
            <p className="font-medium">{previewData.email || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Gender</p>
            <p className="font-medium">{previewData.gender || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Nationality</p>
            <p className="font-medium">{previewData.nationality || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Number of Guests</p>
            <p className="font-medium">{previewData.number_of_guests || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Check-in</p>
            <p className="font-medium">{previewData.checked_in || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Check-out</p>
            <p className="font-medium">{previewData.checked_out || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Room Type</p>
            <p className="font-medium">{previewData.room_name || "-"}</p>
          </div>
          <div>
            <p className="text-[#7a6f62]">Company</p>
            <p className="font-medium">{previewData.company || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[#7a6f62]">Address</p>
            <p className="font-medium">{previewData.address || "-"}</p>
          </div>
        </div>

        {summary ? (
          <BookingSummary
            summary={summary}
            query={query}
            room={room}
            selectedAddOns={selectedAddOns}
          />
        ) : null}

        <div className="space-y-4">
          <h1 className="rounded-xl bg-[#1f1d19] px-4 py-2 font-serif text-lg text-white md:text-xl">
            Declaration
          </h1>
          <div>
            <p className="text-sm text-[#655b4e]">
              The information I have given is true, correct and complete. I
              understand failure to answer any question may have serious
              consequences.
            </p>
          </div>
          <div className="flex justify-between">
            <PolicyModal onConfirm={(sig) => setPolicySignature(sig)} />
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <Button
          variant="flat"
          type="button"
          onPress={handlePrevious}
          isDisabled={step === 1}
          className="rounded-full bg-[#f2e8d9] text-[#5e5447]"
        >
          Previous
        </Button>

        {step < 3 ? (
          <Button
            type="button"
            onPress={handleNext}
            className="rounded-full bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
          >
            {step === 2 ? "Preview" : "Next"}
          </Button>
        ) : (
          <Button
            isLoading={bookingIsLoading || addGuestIsLoading}
            isDisabled={!policySignature || !isGuestIdVerified}
            type="submit"
            className="rounded-full bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
          >
            Submit
          </Button>
        )}
      </div>
    </Form>
  );
}
