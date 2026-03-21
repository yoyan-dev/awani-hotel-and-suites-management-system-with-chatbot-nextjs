import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function Header() {
  return (
    <div className="rounded mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Account Management</h1>
        <p className="text-gray-600">
          Manage user accounts, permissions, and access levels for the hotel
          management system.
        </p>
      </div>
      <Button as={Link} href="/admin/accounts/logs" color="primary" size="sm">
        View Login Logs
      </Button>
    </div>
  );
}
