"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { uploadRoomImage } from "@/lib/upload-room-image";
import RoomForm from "./_components/room-form";
import Header from "./_components/header";
import { useFunctionRooms } from "@/hooks/use-function-rooms";
import { FunctionRoom } from "@/types/function-room";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const {
    function_room,
    isLoading: roomLoading,
    setLoading,
    error,
    fetchFunctionRoom,
    updateFunctionRoom,
  } = useFunctionRooms();

  const [formData, setFormData] = React.useState<FunctionRoom>({});
  const [image, setImage] = React.useState<any>();

  React.useEffect(() => {
    if (id) fetchFunctionRoom(id as string);
  }, [error, id]);

  React.useEffect(() => {
    if (function_room) {
      setFormData(function_room);
      setImage(function_room.image);
    }
  }, [function_room]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading();

    const data = new FormData(e.currentTarget);
    const file = data.get("image") as File;

    const updatedRoom: FunctionRoom = {
      ...formData,
      image:
        file && file.size > 0
          ? await uploadRoomImage(file, "FRN" + Number(formData.room_number))
          : formData.image,
    };

    await updateFunctionRoom(updatedRoom);
    if (!error) router.push("/admin/rooms/function-rooms");
  }

  return (
    <div className="space-y-4">
      <Header />
      <RoomForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        image={image}
        setImage={setImage}
        roomLoading={roomLoading}
      />
    </div>
  );
}
