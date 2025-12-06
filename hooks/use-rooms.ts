import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addRoom,
  deleteRoom,
  deleteRooms,
  fetchAnalytics,
  fetchAvailableRooms,
  fetchRoom,
  fetchRooms,
  updateRoom,
} from "@/features/room/room-thunk";
import { FetchRoomsParams, Room } from "@/types/room";
import { setLoading } from "@/features/room/room-slice";

export function useRooms() {
  const dispatch = useAppDispatch();
  const {
    analytics,
    rooms,
    room,
    available_rooms,
    pagination,
    isLoading,
    error,
  } = useAppSelector((state) => state.room);
  return {
    analytics,
    rooms,
    room,
    available_rooms,
    pagination,
    isLoading,
    error,
    setLoading: () => dispatch(setLoading(true)),
    fetchAnalytics: () => dispatch(fetchAnalytics()),
    fetchRooms: (payload: FetchRoomsParams | null) =>
      dispatch(fetchRooms(payload || {})),
    fetchRoom: (id: string) => dispatch(fetchRoom(id)),
    fetchAvailableRooms: (payload: FetchRoomsParams) =>
      dispatch(fetchAvailableRooms(payload)),
    addRoom: (payload: FormData) => dispatch(addRoom(payload)),
    updateRoom: (payload: Room) => dispatch(updateRoom(payload)),
    deleteRoom: (id: string) => dispatch(deleteRoom(id)),
    deleteSelectedRooms: (selectedKeys: Set<number> | "all") =>
      deleteRooms({ selectedValues: selectedKeys }),
  };
}
