import { fetchAuthLogs } from "@/features/auth-logs/auth-log-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AuthLogFetchParams } from "@/types/auth-log";

export function useAuthLogs() {
  const dispatch = useAppDispatch();
  const { logs, pagination, isLoading, error } = useAppSelector(
    (state) => state.auth_logs,
  );

  return {
    logs,
    pagination,
    isLoading,
    error,
    fetchAuthLogs: (payload: AuthLogFetchParams | undefined) =>
      dispatch(fetchAuthLogs(payload)),
  };
}
