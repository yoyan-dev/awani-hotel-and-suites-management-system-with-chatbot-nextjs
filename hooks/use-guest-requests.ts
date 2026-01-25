import {
  deleteGuestRequest,
  deleteSelectedGuestRequest,
  fetchGuestRequest,
  fetchGuestRequests,
  updateGuestRequest,
  addGuestRequest,
} from "@/features/guest-requests/guest-request-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { GuestRequest } from "@/types/gues-request";

export function useGuestRequests() {
  const dispatch = useAppDispatch();
  const { guest_requests, guest_request, isLoading, error } = useAppSelector(
    (state) => state.guest_requests,
  );
  return {
    guest_request,
    guest_requests,
    isLoading,
    error,
    fetchGuestRequests: () => dispatch(fetchGuestRequests()),
    fetchGuestRequest: (id: string) => dispatch(fetchGuestRequest(id)),
    addGuestRequest: (payload: FormData) => dispatch(addGuestRequest(payload)),
    updateGuestRequest: (payload: GuestRequest) =>
      dispatch(updateGuestRequest(payload)),
    deleteGuestRequest: (id: string) => dispatch(deleteGuestRequest(id)),
    deleteSelectedGuestRequest: (selectedKeys: Set<number> | "all") =>
      deleteSelectedGuestRequest({ selectedValues: selectedKeys }),
  };
}
