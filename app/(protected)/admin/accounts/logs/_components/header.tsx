import { Input } from "@heroui/react";
import { Search } from "lucide-react";

interface HeaderProps {
  query: string;
  setQuery: (value: string) => void;
  setPage: (page: number) => void;
}

export default function Header({ query, setQuery, setPage }: HeaderProps) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Login Activity Logs</h1>
        <p className="text-gray-600">
          Monitor user logins and logouts across the system.
        </p>
      </div>
      <div className="flex items-end justify-between gap-3">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search email, role, device, or user id..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={query}
          variant="bordered"
          onClear={() => {
            setQuery("");
            setPage(1);
          }}
          onValueChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
      </div>
    </>
  );
}
