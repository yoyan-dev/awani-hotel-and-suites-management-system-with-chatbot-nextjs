"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import {
  RoomReportFetchParams,
  ReportStatus,
  ReportType,
} from "@/types/room-report";
import { statusOptions } from "@/app/constants/room-reports";

interface RoomReportsFilterProps {
  query: RoomReportFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<RoomReportFetchParams>>;
}

export default function RoomReportsFilter({
  query,
  setQuery,
}: RoomReportsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-sm shadow-sm">
      <Input
        variant="bordered"
        radius="sm"
        startContent={<Search size={16} />}
        placeholder="Search room, item, guest..."
        value={query.query || ""}
        onChange={(e) => setQuery({ ...query, query: e.target.value, page: 1 })}
        className="flex-1"
      />

      <Select
        placeholder="Filter Status"
        selectedKeys={[query.status || "all"]}
        className="sm:max-w-xs w-full"
        onChange={(e) =>
          setQuery({
            ...query,
            status: e.target.value as ReportStatus,
            page: 1,
          })
        }
      >
        {statusOptions.map((opt) => (
          <SelectItem key={opt.uid}>{opt.name}</SelectItem>
        ))}
      </Select>

      <Select
        placeholder="Filter Report Type"
        selectedKeys={[query.report_type || "all"]}
        className="sm:max-w-xs w-full"
        onChange={(e) =>
          setQuery({
            ...query,
            report_type: e.target.value as ReportType,
            page: 1,
          })
        }
      >
        <SelectItem key="all">All</SelectItem>
        <SelectItem key="lost">Lost</SelectItem>
        <SelectItem key="damaged">Damaged</SelectItem>
        <SelectItem key="audit">Audit</SelectItem>
        <SelectItem key="incident">Incident</SelectItem>
      </Select>
    </div>
  );
}
