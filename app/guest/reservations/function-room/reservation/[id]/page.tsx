"use client";

import BookingForm from "./_components/booking-form";
import SelectedRoom from "./_components/selected-room";
import { addToast, Card, CardBody, CardHeader } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import AvailableRooms from "./_components/available-rooms";
import { supabase } from "@/lib/supabase/supabase-client";
import { useGuests } from "@/hooks/use-guests";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useBookings } from "@/hooks/use-bookings";
import { FetchRoomTypesParams } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import { BanquetPackageFetchParams } from "@/types/banquet-package";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = React.useState(id || null);
  const [guestId, setGuestId] = React.useState<string | null>(null);
  const { items, isLoading, fetchBanquetPackages } = useBanquetPackages();
  const {
    bookings,
    isLoading: bookingIsLoading,
    error,
    fetchBookings,
    addBooking,
  } = useBookings();

  const [specialRequests, setSpecialRequests] = React.useState<
    { name: string; price: string; quantity: number }[]
  >([]);

  React.useEffect(() => {
    fetchBanquetPackages({} as BanquetPackageFetchParams);
  }, []);

  const banquetPackage = React.useMemo(() => {
    if (selectedPackage) {
      return items.find((pkg) => pkg.id === selectedPackage);
    }
    return null;
  }, [items, selectedPackage]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: any
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const filtereSpecialRequest = specialRequests.filter(
      (req) => req.quantity > 0
    );

    const check_in_date = formData.get("check_in") || "";
    await fetchBookings({ guest_id: guestId || "", check_in: check_in_date });
    if (!bookingIsLoading && bookings.length > 0) {
      addToast({
        title: "Error!",
        description:
          "You still have a pending booking reservation. Please contact awani customer service for assistance.",
        color: "warning",
      });
      return;
    }
    formData.append("guest_id", guestId || "");
    formData.append("total", payload?.total);
    formData.append("total_add_ons", payload?.totalAddOnsPrice);
    formData.append(
      "special_requests",
      JSON.stringify(filtereSpecialRequest || [])
    );
    console.log(formData);
    await addBooking(formData);
    if (error === undefined) {
      addToast({
        title: "Booking Successful",
        description:
          "Your reservation has been submitted successfully. Our team will review your request and contact you shortly for confirmation. Thank you for choosing our hotel!",
        color: "success",
      });
      router.push("/");
    }
  }

  return (
    <div>
      <Card className="border-none shadow-none">
        <CardHeader className="text-xl font-semibold text-center dark:bg-gray-900 ">
          Hotel Reservation
        </CardHeader>
        <CardBody className="dark:bg-gray-900  w-full flex flex-col lg:flex-row items-start gap-8">
          <BookingForm
            onSubmit={(e) => handleSubmit(e, {})}
            guestId={guestId}
            setGuestId={setGuestId}
            items={items}
            banquetPackage={banquetPackage || null}
            isLoading={isLoading}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            bookingIsLoading={bookingIsLoading}
          />
          {/* {room ? (
            <SelectedRoom room={room} isLoading={isLoading} />
          ) : (
            <AvailableRooms
              rooms={availabel_room_types}
              isLoading={isLoading}
              setSelectedRoom={setSelectedRoom}
            />
          )} */}
        </CardBody>
      </Card>
    </div>
  );
}
