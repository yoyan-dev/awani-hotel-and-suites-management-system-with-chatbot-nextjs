"use client";

import React from "react";
import { RoomReport, ReportStatus } from "@/types/room-report";
import DeleteModal from "./modals/delete-modal";
import { Button } from "@heroui/button";
import {
  User,
  Box,
  Tag,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Chip, Select, SelectItem } from "@heroui/react";
import { useRoomReports } from "@/hooks/use-room-reports";

interface RoomStatusCardProps {
  report: RoomReport;
  onUpdateStatus?: (id: string, status: string) => void;
}

const statusClasses: Record<
  ReportStatus,
  { bg: string; text: string; icon: any }
> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  in_progress: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: <Box className="w-4 h-4" />,
  },
  resolved: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  returned: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: <XCircle className="w-4 h-4" />,
  },
};

export default function RoomReportCard({
  report,
  onUpdateStatus,
}: RoomStatusCardProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const { isLoading, fetchRoomReports, updateRoomReport } = useRoomReports();

  function handleUpdateStatus(status: ReportStatus) {
    updateRoomReport({
      id: report.id,
      status,
    });
    fetchRoomReports({});
  }

  return (
    <>
      <DeleteModal
        roomReport={report}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />

      <div className="bg-white dark:bg-gray-800 rounded-sm p-6 flex flex-col gap-4 shadow  transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Room {report.room_number || "—"}
          </h2>
          {report.status && (
            <Chip
              className={` ${statusClasses[report.status].bg} ${statusClasses[report.status].text}`}
            >
              <div className="flex items-center gap-1">
                {statusClasses[report.status].icon}
                {report.status.replace("_", " ")}
              </div>
            </Chip>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between gap-2">
            {report.guest_name && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-sm text-sm">{report.guest_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">{report.item_name || "—"}</span>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            {report.item_category && (
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="capitalize text-sm">
                  {report.item_category}
                </span>
              </div>
            )}
            {report.damage_type && report.damage_type !== "none" && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="capitalize font-sm text-sm">
                  {report.damage_type}
                </span>
              </div>
            )}
          </div>

          {report.notes && (
            <div className="flex items-start gap-2">
              <MessageCircle className="w-5 h-5 mt-1 text-gray-500 dark:text-gray-400" />
              <span className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex-1">
                {report.notes}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-end gap-3 ">
          <Button
            onPress={() => setDeleteOpen(true)}
            variant="light"
            color="danger"
            size="sm"
          >
            Delete
          </Button>
          {report.status === "pending" && report.id && (
            <Select
              isLoading={isLoading}
              fullWidth
              name="status"
              placeholder="Select status"
              variant="bordered"
              radius="sm"
              size="sm"
              labelPlacement="outside"
              defaultSelectedKeys={[report.status]}
              onChange={(e) =>
                handleUpdateStatus(e.target.value as ReportStatus)
              }
            >
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="in_progress">In Progress</SelectItem>
              <SelectItem key="resolved">Resolved</SelectItem>
              <SelectItem key="returned">Returned</SelectItem>
            </Select>
          )}
        </div>
      </div>
    </>
  );
}
