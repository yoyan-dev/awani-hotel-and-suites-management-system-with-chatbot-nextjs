import {
  addGuestFeedback,
  deleteGuestFeedback,
  deleteSelectedGuestFeedback,
  fetchGuestFeedback,
  fetchGuestFeedbacks,
  updateGuestFeedback,
} from "@/features/feedback/feedback-request-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  FeedbackFetchParams,
  FeedbackPayload,
  FeedbackUpdatePayload,
} from "@/types/feedback";

export function useGuestFeedback() {
  const dispatch = useAppDispatch();
  const { guest_feedbacks, guest_feedback, pagination, isLoading, error } =
    useAppSelector((state) => state.feedback);
  return {
    guest_feedback,
    guest_feedbacks,
    pagination,
    isLoading,
    error,
    fetchGuestFeedbacks: (payload: FeedbackFetchParams | undefined) =>
      dispatch(fetchGuestFeedbacks(payload)),
    fetchGuestFeedback: (id: string) => dispatch(fetchGuestFeedback(id)),
    addGuestFeedback: (payload: FormData) =>
      dispatch(addGuestFeedback(payload)),
    updateGuestFeedback: (payload: FeedbackUpdatePayload) =>
      dispatch(updateGuestFeedback(payload)),
    deleteGuestFeedback: (id: string) => dispatch(deleteGuestFeedback(id)),
    deleteSelectedGuestFeedback: (selectedKeys: Set<number> | "all") =>
      deleteSelectedGuestFeedback({ selectedValues: selectedKeys }),
  };
}
