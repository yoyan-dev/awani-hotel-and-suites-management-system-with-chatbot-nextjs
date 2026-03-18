"use client";

import BookingForm from "./_components/booking-form";
import SelectedRoom from "./_components/selected-room";
import { Card, CardBody, CardHeader } from "@heroui/react";
import AvailableRooms from "./_components/available-rooms";
import { useGuestHotelRoomReservationPage } from "@/hooks/guest/use-guest-hotel-room-reservation-page";

export default function Page() {
  const {
    query,
    setQuery,
    selectedRoom,
    setSelectedRoom,
    addGuestIsLoading,
    rooms,
    isLoading,
    room,
    specialRequests,
    setSpecialRequests,
    summary,
    bookingIsLoading,
    handleSubmit,
  } = useGuestHotelRoomReservationPage();

  return (
    <div className="min-h-screen pb-12 pt-6 md:pt-8">
      <Card className="mx-auto w-full max-w-[1320px] rounded-4xl border border-[#e3d8c8] bg-[#fffdf8] shadow-[0_32px_70px_-50px_rgba(31,26,19,0.54)]">
        <CardHeader className="flex flex-col items-start gap-3 border-b border-[#eadfce] bg-[#f8f1e8] px-5 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#987345]">
            Secure Reservation
          </p>
          <h1 className="font-serif text-3xl tracking-tight text-[#231f1a] md:text-4xl">
            Hotel Reservation
          </h1>
          <p className="text-sm text-[#645b4e]">
            Complete your details and select your preferred room arrangement.
          </p>
        </CardHeader>
        <CardBody className="w-full gap-8 p-4 sm:p-6 lg:p-8">
          <div className="grid w-full grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
            <BookingForm
              onSubmit={(e) => handleSubmit(e, summary)}
              query={query}
              setQuery={setQuery}
              roomTypes={rooms}
              room={room || null}
              summary={summary}
              isLoading={isLoading}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              bookingIsLoading={bookingIsLoading}
              addGuestIsLoading={addGuestIsLoading}
            />
            {room ? (
              <SelectedRoom room={room} isLoading={isLoading} />
            ) : query.checkIn && query.checkOut ? (
              <AvailableRooms
                rooms={rooms}
                isLoading={isLoading}
                setSelectedRoom={setSelectedRoom}
              />
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
