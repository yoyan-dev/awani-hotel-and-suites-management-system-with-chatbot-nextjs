import {
  addNotification,
  deleteNotification,
  deleteSelectedNotifications,
  fetchNotifications,
  UpdateNotification,
} from "@/features/notifications/notification-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Notification } from "@/types/notification";

export function useNotification() {
  const dispatch = useAppDispatch();
  const { notifications, isLoading, error } = useAppSelector(
    (state) => state.notifications,
  );
  return {
    notifications,
    isLoading,
    error,
    fetchNotifications: () => dispatch(fetchNotifications()),
    updateNotification: (payload: Notification) =>
      dispatch(UpdateNotification(payload)),
    addNotification: (payload: Notification) =>
      dispatch(addNotification(payload)),
    deleteNotification: (id: string) => dispatch(deleteNotification(id)),
    deleteSelectedNotifications: () => deleteSelectedNotifications(),
  };
}
