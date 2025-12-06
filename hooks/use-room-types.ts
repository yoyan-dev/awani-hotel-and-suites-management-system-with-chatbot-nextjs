import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FetchRoomTypesParams, RoomType } from "@/types/room";
import {
  addRoomType,
  deleteRoomType,
  fetchAvailableRoomTypes,
  fetchRoomType,
  fetchRoomTypes,
  updateRoomType,
} from "@/features/room-types/room-types-thunk";

export function useRoomTypes() {
  const dispatch = useAppDispatch();
  const { room_types, availabel_room_types, room_type, isLoading, error } =
    useAppSelector((state) => state.room_type);
  return {
    room_types,
    availabel_room_types,
    room_type,
    isLoading,
    error,
    fetchRoomTypes: (payload: FetchRoomTypesParams) =>
      dispatch(fetchRoomTypes(payload)),
    fetchAvailableRoomTypes: (payload: FetchRoomTypesParams) =>
      dispatch(fetchAvailableRoomTypes(payload)),
    fetchRoomTType: (id: string) => dispatch(fetchRoomType(id)),
    addRoomType: (payload: FormData) => dispatch(addRoomType(payload)),
    updateRoomType: (payload: RoomType) => dispatch(updateRoomType(payload)),
    deleteRoomType: (id: string) => dispatch(deleteRoomType(id)),
  };
}
