import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/features/room/room-slice";
import { FetchFunctionRoomParams, FunctionRoom } from "@/types/function-room";
import {
  addFunctionRoom,
  deleteFunctionRoom,
  deleteFunctionRooms,
  fetchFunctionRoom,
  fetchFunctionRooms,
  updateFunctionRoom,
} from "@/features/function-room/function-room-thunk";

export function useFunctionRooms() {
  const dispatch = useAppDispatch();
  const { function_rooms, function_room, pagination, isLoading, error } =
    useAppSelector((state) => state.function_room);
  return {
    function_rooms,
    function_room,
    pagination,
    isLoading,
    error,
    setLoading: () => dispatch(setLoading(true)),
    fetchFunctionRooms: (payload: FetchFunctionRoomParams | null) =>
      dispatch(fetchFunctionRooms(payload || {})),
    fetchFunctionRoom: (id: string) => dispatch(fetchFunctionRoom(id)),
    addFunctionRoom: (payload: FormData) => dispatch(addFunctionRoom(payload)),
    updateFunctionRoom: (payload: FunctionRoom) =>
      dispatch(updateFunctionRoom(payload)),
    deleteFunctionRoom: (id: string) => dispatch(deleteFunctionRoom(id)),
    deleteFunctionRooms: (selectedKeys: Set<number> | "all") =>
      deleteFunctionRooms({ selectedValues: selectedKeys }),
  };
}
