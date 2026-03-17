"use client";
import React from "react";
import RoomForm from "./_components/room-form";
import Header from "./_components/header";
import { useRooms } from "@/hooks/use-rooms";
import { useRoomTypes } from "@/hooks/use-room-types";

export default function Page() {
  const {
    room_types,
    isLoading: typesLoading,
    error,
    fetchRoomTypes,
  } = useRoomTypes();
  const { isLoading: roomLoading, addRoom } = useRooms();

  const [images, setImages] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchRoomTypes({});
  }, [error]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // images.forEach((img) => {
    //   formData.append("images", img.file);
    // });
    addRoom(formData);
  }

  return (
    <div className="space-y-4">
      <Header />
      <RoomForm
        onSubmit={handleSubmit}
        images={images}
        setImages={setImages}
        roomTypes={room_types}
        typesLoading={typesLoading}
        roomLoading={roomLoading}
      />
    </div>
  );
}
