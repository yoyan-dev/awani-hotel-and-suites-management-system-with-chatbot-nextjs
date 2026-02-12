"use client";

import { useEffect } from "react";
import { XCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-sm w-full text-center border border-red-500">
        <XCircle className="mx-auto mb-4 text-red-600 w-16 h-16 animate-pulse" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Don't worry, you can try again.
        </p>
      </div>
    </div>
  );
}
