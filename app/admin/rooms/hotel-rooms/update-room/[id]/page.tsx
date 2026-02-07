"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Room } from "@/types/room";
import { uploadRoomImage } from "@/lib/upload-room-image";
import RoomForm from "./_components/room-form";
import Header from "./_components/header";
import { useRooms } from "@/hooks/use-rooms";
import { useRoomTypes } from "@/hooks/use-room-types";
import { LoadingState } from "@/components/dashboard/dashboard-layout";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const {
    room,
    isLoading: roomLoading,
    setLoading,
    fetchRoom,
    updateRoom,
  } = useRooms();
  const {
    room_types,
    isLoading: typesLoading,
    error,
    fetchRoomTypes,
  } = useRoomTypes();

  const [formData, setFormData] = React.useState<Room>({});

  React.useEffect(() => {
    if (id) fetchRoom(id as string);
    fetchRoomTypes({});
  }, [error, id]);

  React.useEffect(() => {
    if (room) {
      setFormData(room);
    }
  }, [room]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading();

    await updateRoom(formData);
    router.push("/admin/rooms/hotel-rooms");
  }

  return (
    <div className="space-y-4">
      <Header />
      {roomLoading && <LoadingState message="Loading room..." />}
      {error && <div className="text-danger">{error}</div>}
      {!roomLoading && !error && (
        <RoomForm
          room={room}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          roomTypes={room_types}
          typesLoading={typesLoading}
          roomLoading={roomLoading}
        />
      )}
    </div>
  );
}
