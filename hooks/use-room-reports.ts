import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/features/room/room-slice";
import { RoomReport, RoomReportFetchParams } from "@/types/room-report";
import {
  addRoomReport,
  deleteRoomReport,
  deleteRoomReports,
  fetchRoomReport,
  fetchRoomReports,
  updateRoomReport,
} from "@/features/room-reports/room-report-thunk";

export function useRoomReports() {
  const dispatch = useAppDispatch();
  const { room_report, room_reports, pagination, isLoading, error } =
    useAppSelector((state) => state.room_reports);
  return {
    room_report,
    room_reports,
    pagination,
    isLoading,
    error,
    setLoading: () => dispatch(setLoading(true)),
    fetchRoomReports: (payload: RoomReportFetchParams | null) =>
      dispatch(fetchRoomReports(payload || {})),
    fetchRoomReport: (id: string) => dispatch(fetchRoomReport(id)),
    addRoomReport: (payload: FormData) => dispatch(addRoomReport(payload)),
    updateRoomReport: (payload: RoomReport) =>
      dispatch(updateRoomReport(payload)),
    deleteRoomReport: (id: string) => dispatch(deleteRoomReport(id)),
    deleteSelectedRoomReports: (selectedKeys: Set<number> | "all") =>
      deleteRoomReports({ selectedValues: selectedKeys }),
  };
}
