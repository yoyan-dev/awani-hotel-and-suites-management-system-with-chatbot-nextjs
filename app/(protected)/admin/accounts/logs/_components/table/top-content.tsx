import React from "react";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import { AuthLogFetchParams } from "@/types/auth-log";

interface AuthLogsTableTopContentProps {
  query: AuthLogFetchParams;
  total: number;
  setQuery: React.Dispatch<React.SetStateAction<AuthLogFetchParams>>;
}

export default function AuthLogsTableTopContent({
  query,
  total,
  setQuery,
}: AuthLogsTableTopContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search email, role, event, device, or user id..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={query.query || ""}
          variant="bordered"
          onClear={() => setQuery((prev) => ({ ...prev, page: 1, query: "" }))}
          onValueChange={(value) =>
            setQuery((prev) => ({ ...prev, page: 1, query: value }))
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {total} events
        </span>
        <span className="text-default-600 dark:text-default-300 text-small">
          Rows per page: 10
        </span>
      </div>
    </div>
  );
}
