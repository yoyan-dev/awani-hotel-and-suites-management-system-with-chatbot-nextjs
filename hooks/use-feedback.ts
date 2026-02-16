import {
  addGuestFeedback,
  deleteGuestFeedback,
  deleteSelectedGuestFeedback,
  fetchGuestFeedback,
  fetchGuestFeedbacks,
  updateGuestFeedback,
} from "@/features/feedback/feedback-request-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FeedbackPayload } from "@/types/feedback";

export function useGuestFeedback() {
  const dispatch = useAppDispatch();
  const { guest_feedbacks, guest_feedback, isLoading, error } = useAppSelector(
    (state) => state.feedback,
  );
  return {
    guest_feedback,
    guest_feedbacks,
    isLoading,
    error,
    fetchGuestFeedbacks: () => dispatch(fetchGuestFeedbacks()),
    fetchGuestFeedback: (id: string) => dispatch(fetchGuestFeedback(id)),
    addGuestFeedback: (payload: FormData) =>
      dispatch(addGuestFeedback(payload)),
    updateGuestFeedback: (payload: FeedbackPayload) =>
      dispatch(updateGuestFeedback(payload)),
    deleteGuestFeedback: (id: string) => dispatch(deleteGuestFeedback(id)),
    deleteSelectedGuestFeedback: (selectedKeys: Set<number> | "all") =>
      deleteSelectedGuestFeedback({ selectedValues: selectedKeys }),
  };
}
