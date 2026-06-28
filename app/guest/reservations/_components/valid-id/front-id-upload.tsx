"use client";

import React, { useState, useRef, useEffect } from "react";
import { Image } from "@heroui/react";
import { CloudDownloadIcon } from "lucide-react";
import { useOCR } from "@/hooks/use-id-verification";
import { handleFileChange } from "@/app/utils/image-file-handler";

export default function FrontIDUpload({
  setIsFrontId,
}: {
  setIsFrontId: React.Dispatch<React.SetStateAction<boolean | null>>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { progress, result, isID, loading, analyze: analyzeOCR } = useOCR();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(handleFileChange(e));
    analyzeOCR(file);
  }

  useEffect(() => {
    setIsFrontId(isID);
  }, [isID, setIsFrontId]);

  return (
    <div className="w-full">
      <span>Front ID</span>
      <label
        htmlFor="image-upload-front"
        className="p-2 w-full min-h-40 sm:h-32 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 flex justify-center items-center cursor-pointer hover:border-primary transition"
      >
        {preview ? (
          <Image
            src={preview}
            radius="none"
            className="h-40 sm:h-32 object-cover"
            ref={imageRef}
          />
        ) : (
          <div className="flex flex-col items-center">
            <CloudDownloadIcon
              size={28}
              className="text-gray-400 dark:text-gray-300"
            />
            <span className="text-xs text-gray-500 dark:text-gray-300">
              Click or drag to upload photo
            </span>
          </div>
        )}
      </label>

      <input
        id="image-upload-front"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        name="front"
        onChange={handleChange}
      />

      {loading && (
        <div className="w-full mt-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded">
            <div
              className="h-4 bg-green-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs mt-1 dark:text-gray-300">
            Analyzing ID... {progress}%
          </p>
        </div>
      )}

      {result && (
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
          {isID !== null
            ? isID
              ? "Front ID Verified"
              : "Not a Front ID (Please upload a Front ID or try a clearer/different photo)"
            : ""}
        </p>
      )}
    </div>
  );
}
