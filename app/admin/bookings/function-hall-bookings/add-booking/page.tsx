"use client";
import { Guest } from "@/types/guest";
import { Button, Form, addToast } from "@heroui/react";
import { Copyright } from "lucide-react";
import React from "react";
import BookingDetailsSection from "./_components/booking-details-section";
import HealthDeclarationSection from "./_components/health-declaration-section";
import GuestInfoSection from "./_components/guest-info-section";
import { useBookings } from "@/hooks/use-bookings";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useRooms } from "@/hooks/use-rooms";
import { useGuests } from "@/hooks/use-guests";
import PaymentSection from "./_components/payment-section";
import { RoomType } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import ViewSummary from "../_components/modals/payment/view-summary-modal";
import { formatPHP } from "@/lib/format-php";

export default function AddBookingPage() {
  const {
    room_types,
    isLoading: typesLoading,
    fetchRoomTypes,
  } = useRoomTypes();
  const { isLoading: bookingIsLoading, error, addBooking } = useBookings();
  const { rooms, isLoading: roomLoading, fetchAvailableRooms } = useRooms();
  const { guests, isLoading: guestLoading, fetchGuests } = useGuests();
  const [selectedGuest, setSelectedGuest] = React.useState<string>();
  const [roomType, setRoomType] = React.useState<RoomType>({});
  const [selectedPurpose, setSelectedPurpose] = React.useState<string>();
  const [selectedRoomType, setSelectedRoomType] = React.useState<string>();
  const [specialRequests, setSpecialRequests] = React.useState<
    { name: string; price: string; quantity: number }[]
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
    fetchGuests();
  }, []);

  React.useEffect(() => {
    if (selectedRoomType) {
      fetchAvailableRooms({
        roomTypeID: selectedRoomType,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
    }
  }, [selectedRoomType, checkInDate, checkOutDate]);

  const filteredGuest = React.useMemo(
    () =>
      guests.find((guest) => guest.id === selectedGuest) ||
      ({ full_name: "", contact_number: "", address: "" } as Guest),
    [selectedGuest]
  );

  React.useEffect(() => {
    const room = room_types.find((room) => room.id === selectedRoomType);
    setRoomType(room || {});
    if (room?.add_ons) {
      setSpecialRequests(
        room.add_ons.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: 0,
        }))
      );
    } else {
      setSpecialRequests([]);
    }
  }, [selectedRoomType]);

  const summary = React.useMemo(() => {
    if (
      specialRequests.length === 0 ||
      !roomType ||
      !checkInDate ||
      !checkOutDate
    )
      return null;
    return generateSummary(
      {
        check_in: checkInDate,
        check_out: checkOutDate,
        room_type: roomType,
        payment_method: paymentDetail.method,
        amount_paid: paymentDetail.amountPaid,
      } as Booking,
      specialRequests
    );
  }, [specialRequests, roomType, checkInDate, checkOutDate, paymentDetail]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: any
  ) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      if (!selectedGuest) {
        addToast({
          title: "Error",
          description: "Please select or register guest.",
          color: "warning",
        });
        return;
      }

      formData.append("status", "confirmed");
      formData.append("guest_id", selectedGuest);
      formData.append("total", payload?.total);
      formData.append("total_add_ons", payload?.totalAddOnsPrice);
      formData.append(
        "payment_status",
        payload?.balance >= 0 ? payload?.status : "pending"
      );
      console.log(formData);
      formData.append("special_requests", JSON.stringify(specialRequests));
      await addBooking(formData);
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
        <GuestInfoSection
          guests={guests}
          selectedGuest={selectedGuest}
          setSelectedGuest={setSelectedGuest}
          filteredGuest={filteredGuest}
          loading={guestLoading}
        />
        <Form onSubmit={(e) => handleSubmit(e, summary)}>
          <BookingDetailsSection
            room_types={room_types}
            rooms={rooms}
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
          <HealthDeclarationSection
            selectedPurpose={selectedPurpose}
            setSelectedPurpose={setSelectedPurpose}
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
