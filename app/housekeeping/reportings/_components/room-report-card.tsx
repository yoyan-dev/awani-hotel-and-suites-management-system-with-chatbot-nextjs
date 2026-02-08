"use client";

import React from "react";
import { RoomReport, ReportStatus } from "@/types/room-report";
import DeleteModal from "./modals/delete-modal";
import { Button } from "@heroui/button";

interface RoomStatusCardProps {
  report: RoomReport;
  onUpdateStatus?: (id: string, status: ReportStatus) => void;
}

const statusClasses: Record<ReportStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  returned: "bg-red-100 text-red-800",
};

export default function RoomReportCard({
  report,
  onUpdateStatus,
}: RoomStatusCardProps) {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  return (
    <>
      <DeleteModal
        roomReport={report}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
        {/* Room Info */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Room {report.room_number || "—"}
          </h2>
          {report.guest_name && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Guest: {report.guest_name}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Item: <span className="font-medium">{report.item_name || "—"}</span>
          </p>
          {report.item_category && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Category:{" "}
              <span className="capitalize">{report.item_category}</span>
            </p>
          )}
          {report.damage_type && report.damage_type !== "none" && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Damage:{" "}
              <span className="capitalize font-medium">
                {report.damage_type}
              </span>
            </p>
          )}
        </div>

        {/* Status & Actions */}
        <div className="mt-4 flex items-center justify-between">
          {report.status && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClasses[report.status]}`}
            >
              {report.status.replace("_", " ")}
            </span>
          )}
          <div className="flex gap-4">
            <Button
              onPress={() => setDeleteOpen(true)}
              variant="light"
              color="danger"
              size="sm"
            >
              Delete
            </Button>
            {onUpdateStatus && report.id && (
              <button
                onClick={() => onUpdateStatus(report.id!, report.status!)}
                className="text-sm text-primary hover:underline"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
