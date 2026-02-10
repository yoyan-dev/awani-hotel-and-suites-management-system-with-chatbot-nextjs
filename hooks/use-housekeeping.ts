import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedRoom,
  clearError,
  clearHousekeepingState,
} from "@/features/housekeeping/housekeeping-slice";
import type {
  RoomListParams,
  TodayOperationsParams,
  RoomUpdatePayload,
} from "@/types/housekeeping";
import {
  fetchRoomList,
  fetchTodayOperations,
  updateRoomStatus,
} from "@/features/housekeeping/housekeeping-thunk";

export function useHousekeeping() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.housekeeping);

  return {
    roomList: state.roomList,
    todayOperations: state.todayOperations,
    summary: state.summary,
    selectedRoom: state.selectedRoom,
    isLoading: state.isLoading,
    error: state.error,
    setSelectedRoom: (room: typeof state.selectedRoom) =>
      dispatch(setSelectedRoom(room)),
    clearError: () => dispatch(clearError()),
    clearHousekeepingState: () => dispatch(clearHousekeepingState()),
    fetchRoomList: (params: RoomListParams | null) =>
      dispatch(fetchRoomList(params || {})),
    fetchTodayOperations: (params: TodayOperationsParams | null) =>
      dispatch(fetchTodayOperations(params || {})),
    updateRoomStatus: (room_id: string, payload: RoomUpdatePayload) =>
      dispatch(updateRoomStatus({ room_id, payload })),
  };
}
