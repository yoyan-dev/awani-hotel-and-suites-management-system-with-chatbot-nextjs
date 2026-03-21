"use client";
import Header from "./_components/header";
import UserTable from "./_components/table/user-table";
import { useAdminAccountsPage } from "@/hooks/admin/use-admin-accounts-page";

export default function Accounts() {
  const tableState = useAdminAccountsPage();

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-2">
      <Header />
      <UserTable {...tableState} />
    </div>
  );
}
