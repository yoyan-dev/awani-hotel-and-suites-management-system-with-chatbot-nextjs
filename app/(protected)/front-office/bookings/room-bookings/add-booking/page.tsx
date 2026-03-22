"use client";
import { Button, Form, addToast } from "@heroui/react";
import { Copyright } from "lucide-react";
import React from "react";
import BookingDetailsSection from "./_components/booking-details-section";
import GuestInfoSection from "./_components/guest-info-section";
import { useBookings } from "@/hooks/use-bookings";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useRooms } from "@/hooks/use-rooms";
import { useGuests } from "@/hooks/use-guests";
import { addGuest as addGuestThunk } from "@/features/guest/guest-thunk";
import { addBooking as addBookingThunk } from "@/features/booking/hotel-rooms/booking-thunk";
import PaymentSection from "./_components/payment-section";
import { RoomType } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import ViewSummary from "../_components/modals/payment/view-summary-modal";
import { BookingSpecialRequest } from "@/types/add-on";
import { useRouter } from "next/navigation";
import {
  getGuestBreakdownTotal,
  parseGuestBreakdown,
} from "@/lib/booking/guest-breakdown";

export default function AddBookingPage() {
  const router = useRouter();
  const {
    room_types,
    isLoading: typesLoading,
    fetchRoomTypes,
  } = useRoomTypes();
  const { isLoading: bookingIsLoading, addBooking } = useBookings();
  const {
    available_rooms,
    isLoading: roomLoading,
    fetchAvailableRooms,
  } = useRooms();
  const { addGuest } = useGuests();
  const [roomType, setRoomType] = React.useState<RoomType>({});
  const [selectedRoomType, setSelectedRoomType] = React.useState<string>();
  const [specialRequests, setSpecialRequests] = React.useState<
    BookingSpecialRequest[]
  >([]);
  const [checkInDate, setCheckInDate] = React.useState<string>("");
  const [checkOutDate, setCheckOutDate] = React.useState<string>("");
  const [paymentDetail, setPaymentDetail] = React.useState<{
    method: string;
    amountPaid: number;
  }>({ method: "", amountPaid: 0 });
  const [isViewSummaryOpen, setIsViewSummaryOpen] = React.useState(false);

  React.useEffect(() => {
    fetchRoomTypes({});
  }, []);

  React.useEffect(() => {
    if (selectedRoomType && checkInDate && checkOutDate) {
      fetchAvailableRooms({
        roomTypeID: selectedRoomType,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        isStatusSelected: true,
      });
    }
  }, [selectedRoomType, checkInDate, checkOutDate]);

  React.useEffect(() => {
    const room = room_types.find((room) => room.id === selectedRoomType);
    setRoomType(room || {});
    if (room?.room_type_add_ons) {
      setSpecialRequests(
        room.room_type_add_ons.map((item: any) => ({
          room_type_add_on_id: item.id,
          add_on_id: item.add_on_id,
          name: item.add_on?.name,
          price: item.add_on?.price,
          quantity_limit: item.quantity_limit,
          remaining_quantity: item.remaining_quantity ?? item.quantity_limit,
          quantity: 0,
        })),
      );
    } else {
      setSpecialRequests([]);
    }
  }, [selectedRoomType]);

  const summary = React.useMemo(() => {
    if (!roomType?.id || !checkInDate || !checkOutDate) return null;
    return generateSummary(
      {
        checked_in: checkInDate,
        checked_out: checkOutDate,
        room_type: roomType,
        payment_method: paymentDetail.method,
        amount_paid: paymentDetail.amountPaid,
      } as Booking,
      specialRequests,
    );
  }, [specialRequests, roomType, checkInDate, checkOutDate, paymentDetail]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: any,
  ) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const guestBreakdown = parseGuestBreakdown(
        formData.get("guest_breakdown"),
      );
      const totalGuests = guestBreakdown
        ? getGuestBreakdownTotal(guestBreakdown)
        : Number(formData.get("number_of_guests") ?? 0);

      if (!Number.isFinite(totalGuests) || totalGuests <= 0) {
        addToast({
          title: "Invalid Guest Count",
          description:
            "Please provide at least one guest category for this booking.",
          color: "warning",
        });
        return;
      }

      if (roomType?.max_guest && totalGuests > Number(roomType.max_guest)) {
        addToast({
          title: "Guest Limit Exceeded",
          description: `Maximum guests allowed for this room is ${roomType.max_guest}.`,
          color: "warning",
        });
        return;
      }

      const guestId = crypto.randomUUID();
      const guestFormData = new FormData();
      guestFormData.append("id", guestId);
      guestFormData.append(
        "full_name",
        String(formData.get("guest_full_name") ?? ""),
      );
      guestFormData.append(
        "contact_number",
        String(formData.get("guest_contact_number") ?? ""),
      );
      guestFormData.append(
        "address",
        String(formData.get("guest_address") ?? ""),
      );
      guestFormData.append(
        "nationality",
        String(formData.get("guest_nationality") ?? ""),
      );
      guestFormData.append("email", String(formData.get("guest_email") ?? ""));

      const addGuestResult = await addGuest(guestFormData);
      if (!addGuestThunk.fulfilled.match(addGuestResult)) {
        addToast({
          title: "Error",
          description: "Unable to create guest record.",
          color: "danger",
        });
        return;
      }

      formData.append("status", "confirmed");
      formData.append("guest_id", addGuestResult.payload.id || guestId);
      formData.append("total", payload?.total);
      formData.append("total_add_ons", payload?.totalAddOnsPrice);
      formData.append(
        "payment_status",
        payload?.balance >= 0 ? payload?.status : "pending",
      );
      formData.append("special_requests", JSON.stringify(specialRequests));

      const addBookingResult = await addBooking(formData);
      if (!addBookingThunk.fulfilled.match(addBookingResult)) {
        addToast({
          title: "Error",
          description: "Unable to create booking record.",
          color: "danger",
        });
        return;
      }
      router.push("/front-office/bookings/room-bookings");
    } catch (e: any) {
      addToast({
        title: "Error!",
        description: e?.message || "Unknown Error!",
        color: "warning",
      });
    }
  }

  return (
    <>
      <div className="flex-1 px-4 w-full space-y-4 py-4">
        <Form onSubmit={(e) => handleSubmit(e, summary)}>
          <GuestInfoSection />
          <BookingDetailsSection
            room_types={room_types}
            rooms={available_rooms}
            roomType={roomType}
            selectedRoomType={selectedRoomType}
            setSelectedRoomType={setSelectedRoomType}
            specialRequests={specialRequests}
            setSpecialRequests={setSpecialRequests}
            checkInDate={checkInDate}
            setCheckInDate={setCheckInDate}
            checkOutDate={checkOutDate}
            setCheckOutDate={setCheckOutDate}
            typesLoading={typesLoading}
            roomLoading={roomLoading}
          />
          {summary ? (
            <PaymentSection
              paymentDetail={paymentDetail}
              setPaymentDetail={setPaymentDetail}
              summary={summary}
            />
          ) : null}
          <div className="flex gap-4 justify-end w-full pb-4">
            <ViewSummary
              isOpen={isViewSummaryOpen}
              onClose={() => setIsViewSummaryOpen(false)}
              summary={summary}
            />
            {summary ? (
              <Button
                radius="none"
                size="sm"
                fullWidth
                onPress={() => setIsViewSummaryOpen(true)}
              >
                Generate Summary
              </Button>
            ) : null}
            <Button
              type="submit"
              radius="none"
              size="sm"
              color="primary"
              isLoading={bookingIsLoading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
      <div className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin py-2">
        <Copyright size={10} /> Alright reserved Ma. Awani.
      </div>
    </>
  );
}
