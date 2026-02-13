import { useCallback, useMemo } from "react";
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

  const onSetSelectedRoom = useCallback(
    (room: typeof state.selectedRoom) => dispatch(setSelectedRoom(room)),
    [dispatch],
  );

  const onClearError = useCallback(() => dispatch(clearError()), [dispatch]);
  const onClearHousekeepingState = useCallback(
    () => dispatch(clearHousekeepingState()),
    [dispatch],
  );
  const onFetchRoomList = useCallback(
    (params: RoomListParams | null) => dispatch(fetchRoomList(params || {})),
    [dispatch],
  );
  const onFetchTodayOperations = useCallback(
    (params: TodayOperationsParams | null) =>
      dispatch(fetchTodayOperations(params || {})),
    [dispatch],
  );
  const onUpdateRoomStatus = useCallback(
    (room_id: string, payload: RoomUpdatePayload) =>
      dispatch(updateRoomStatus({ room_id, payload })),
    [dispatch],
  );

  return useMemo(
    () => ({
      roomList: state.roomList,
      todayOperations: state.todayOperations,
      summary: state.summary,
      selectedRoom: state.selectedRoom,
      isLoading: state.isLoading,
      error: state.error,
      setSelectedRoom: onSetSelectedRoom,
      clearError: onClearError,
      clearHousekeepingState: onClearHousekeepingState,
      fetchRoomList: onFetchRoomList,
      fetchTodayOperations: onFetchTodayOperations,
      updateRoomStatus: onUpdateRoomStatus,
    }),
    [
      state.roomList,
      state.todayOperations,
      state.summary,
      state.selectedRoom,
      state.isLoading,
      state.error,
      onSetSelectedRoom,
      onClearError,
      onClearHousekeepingState,
      onFetchRoomList,
      onFetchTodayOperations,
      onUpdateRoomStatus,
    ],
  );
}
