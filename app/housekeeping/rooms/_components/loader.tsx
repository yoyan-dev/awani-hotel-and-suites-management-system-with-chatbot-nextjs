import { Skeleton } from "@heroui/react";
import React from "react";

export default function Loader() {
  return (
    <Skeleton className="rounded-sm">
      <div className="h-24 rounded-lg bg-default-300" />
    </Skeleton>
  );
}
