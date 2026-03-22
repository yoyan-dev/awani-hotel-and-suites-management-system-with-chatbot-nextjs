"use client";

import React from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Search, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

interface BookingFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function BookingFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onRefresh,
  isLoading,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
      <Input
        placeholder="Search guest, booking #..."
        value={searchQuery}
        onValueChange={setSearchQuery}
        startContent={<Search className="w-4 h-4" />}
        size="sm"
        className="w-full md:w-64"
        isDisabled={isLoading}
      />
      <Select
        placeholder="All Status"
        size="sm"
        className="w-full md:w-40"
        selectedKeys={statusFilter ? [statusFilter] : []}
        onChange={(e) => setStatusFilter(e.target.value)}
        isDisabled={isLoading}
      >
        <SelectItem key="pending">Pending</SelectItem>
        <SelectItem key="confirmed">Confirmed</SelectItem>
        <SelectItem key="checked_in">Checked In</SelectItem>
        <SelectItem key="checked_out">Checked Out</SelectItem>
        <SelectItem key="cancelled">Cancelled</SelectItem>
      </Select>
      <Select
        placeholder="Date Range"
        size="sm"
        className="w-full md:w-40"
        selectedKeys={dateFilter ? [dateFilter] : []}
        onChange={(e) => setDateFilter(e.target.value)}
        isDisabled={isLoading}
      >
        <SelectItem key="today">Today</SelectItem>
        <SelectItem key="week">This Week</SelectItem>
        <SelectItem key="month">This Month</SelectItem>
      </Select>
      <Button
        isIconOnly
        variant="flat"
        size="sm"
        onPress={onRefresh}
        isLoading={isLoading}
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
      <Button
        as={Link}
        href="/front-office/bookings/room-bookings/add-booking"
        color="primary"
        size="sm"
        startContent={<Plus className="w-4 h-4" />}
      >
        New Booking
      </Button>
    </div>
  );
}
