"use client";
import React from "react";
import RoomForm from "./_components/room-form";
import Header from "./_components/header";
import { useFunctionRooms } from "@/hooks/use-function-rooms";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isLoading, error, addFunctionRoom } = useFunctionRooms();
  const router = useRouter();
  const [image, setImage] = React.useState<any>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("status", "available");
    addFunctionRoom(formData);
    if (!error) router.push("/admin/rooms/function-rooms");
  }

  return (
    <div className="space-y-4">
      <Header />
      <RoomForm
        onSubmit={handleSubmit}
        image={image}
        setImage={setImage}
        isLoading={isLoading}
      />
    </div>
  );
}
