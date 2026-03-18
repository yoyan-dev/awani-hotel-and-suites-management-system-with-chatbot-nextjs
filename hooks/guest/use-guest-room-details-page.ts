"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchRoomType } from "@/features/room-types/room-types-thunk";

export function useGuestRoomDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { room_type, isLoading } = useSelector(
    (state: RootState) => state.room_type,
  );

  React.useEffect(() => {
    if (id) {
      dispatch(fetchRoomType(id as string));
    }
  }, [dispatch, id]);

  const roomImages =
    room_type?.images && room_type.images.length > 0
      ? room_type.images
      : room_type?.image
        ? [room_type.image]
        : ["/bg-awani.jpg"];

  return {
    roomType: room_type,
    isLoading,
    roomImages,
  };
}
