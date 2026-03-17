import { Skeleton } from "@heroui/react";
import React from "react";

export default function Loader() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Skeleton className="rounded-sm">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
      <div className="flex gap-4">
        <Skeleton className="rounded-sm flex-1 ">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-sm flex-1 ">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
      <Skeleton className="rounded-sm">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
    </div>
  );
}
