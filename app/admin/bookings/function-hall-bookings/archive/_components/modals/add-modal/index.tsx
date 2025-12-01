import { addBooking } from "@/features/booking/booking-thunk";
import { fetchGuests } from "@/features/guest/guest-thunk";
import { fetchRoomTypes } from "@/features/room-types/room-types-thunk";
import { fetchRooms } from "@/features/room/room-thunk";
import { formatPHP } from "@/lib/format-php";
import { AppDispatch, RootState } from "@/store/store";
import { Guest } from "@/types/guest";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  addToast,
} from "@heroui/react";
import { Copyright, Minus, Plus } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectedGuest from "../../selected-guest";
import GuestForm from "../guest/guest-form";
import BookingDetailsSection from "./booking-details-section";
import HealthDeclarationSection from "./health-declaration-section";
import GuestInfoSection from "./guest-info-section";

export default function AddModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const { room_types, isLoading: typesLoading } = useSelector(
    (state: RootState) => state.room_type
  );
  const { isLoading: bookingIsLoading, error } = useSelector(
    (state: RootState) => state.booking
  );
  const { rooms, isLoading: roomLoading } = useSelector(
    (state: RootState) => state.room
  );
  const { guests, isLoading: guestLoading } = useSelector(
    (state: RootState) => state.guests
  );
  const [selectedGuest, setSelectedGuest] = React.useState<string>();
  const [selectedPurpose, setSelectedPurpose] = React.useState<string>();
  const [selectedRoomType, setSelectedRoomType] = React.useState<string>();
  const [specialRequests, setSpecialRequests] = React.useState<
    { name: string; price: string; quantity: number }[]
  >([]);

  React.useEffect(() => {
    dispatch(fetchRoomTypes());
    dispatch(fetchGuests());
  }, [dispatch]);

  React.useEffect(() => {
    if (selectedRoomType) {
      dispatch(
        fetchRooms({ roomTypeID: selectedRoomType, status: "available" })
      );
    }
  }, [dispatch, selectedRoomType]);

  const filteredGuest = React.useMemo(
    () =>
      guests.find((guest) => guest.id === selectedGuest) ||
      ({ full_name: "", contact_number: "", address: "" } as Guest),
    [selectedGuest]
  );

  React.useEffect(() => {
    const room = room_types.find((room) => room.id === selectedRoomType);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!selectedGuest) {
      addToast({
        title: "Error",
        description: "Please select or register guest.",
        color: "warning",
      });
      return;
    }
    formData.append("guest_id", selectedGuest);
    console.log(formData);
    await dispatch(addBooking(formData));
    if (error === undefined) {
      onClose();
    }
  }

  return (
    <>
      <Button color="primary" endContent={<Plus />} size="sm" onPress={onOpen}>
        Booking
      </Button>
      <Modal
        isOpen={isOpen}
        size="3xl"
        scrollBehavior="outside"
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-primary text-white w-full">
                Add New Booking
              </ModalHeader>
              <ModalBody>
                <div className="flex-1 px-4 w-full space-y-4 py-4">
                  <GuestInfoSection
                    guests={guests}
                    selectedGuest={selectedGuest}
                    setSelectedGuest={setSelectedGuest}
                    filteredGuest={filteredGuest}
                    loading={guestLoading}
                  />
                  <Form onSubmit={handleSubmit}>
                    <BookingDetailsSection
                      room_types={room_types}
                      rooms={rooms}
                      selectedRoomType={selectedRoomType}
                      setSelectedRoomType={setSelectedRoomType}
                      specialRequests={specialRequests}
                      setSpecialRequests={setSpecialRequests}
                      typesLoading={typesLoading}
                      roomLoading={roomLoading}
                    />
                    <HealthDeclarationSection
                      selectedPurpose={selectedPurpose}
                      setSelectedPurpose={setSelectedPurpose}
                    />
                    <div className="flex gap-4 justify-end w-full pb-4">
                      <Button
                        onPress={onClose}
                        variant="bordered"
                        color="warning"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        isLoading={bookingIsLoading}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
              </ModalBody>
              <ModalFooter className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin">
                <Copyright size={10} /> Alright reserved Ma. Awani.
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
