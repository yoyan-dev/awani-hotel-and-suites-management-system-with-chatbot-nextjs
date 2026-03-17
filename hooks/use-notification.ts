import {
  addNotification,
  deleteNotification,
  deleteSelectedNotifications,
  fetchNotifications,
  fetchNotificationsPage,
  UpdateNotification,
} from "@/features/notifications/notification-thunk";
import { markNotificationsRead } from "@/features/notifications/notification-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Notification } from "@/types/notification";

export function useNotification() {
  const dispatch = useAppDispatch();
  const {
    notifications,
    isLoading,
    isLoadingMore,
    page,
    limit,
    total,
    hasMore,
    error,
  } = useAppSelector((state) => state.notifications);
  return {
    notifications,
    isLoading,
    isLoadingMore,
    page,
    limit,
    total,
    hasMore,
    error,
    fetchNotifications: () => dispatch(fetchNotifications()),
    fetchNotificationsPage: (payload: {
      page: number;
      limit: number;
      append?: boolean;
    }) => dispatch(fetchNotificationsPage(payload)),
    markNotificationsReadLocal: (ids: number[]) =>
      dispatch(markNotificationsRead(ids)),
    updateNotification: (payload: Notification) =>
      dispatch(UpdateNotification(payload)),
    addNotification: (payload: Notification) =>
      dispatch(addNotification(payload)),
    deleteNotification: (id: string) => dispatch(deleteNotification(id)),
    deleteSelectedNotifications: () => deleteSelectedNotifications(),
  };
}
