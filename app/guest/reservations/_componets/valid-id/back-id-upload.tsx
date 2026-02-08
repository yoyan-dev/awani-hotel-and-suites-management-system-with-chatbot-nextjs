"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CloudDownloadIcon } from "lucide-react";
import { loadImage } from "@/utils/id-identifier/image-reader";
import { analyzeBackId, useTesseract } from "@/hooks/use-back-id-analyzer";

export default function BackIdUpload({
  setIsBackId,
}: {
  setIsBackId: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    useTesseract();
  }, []);

  async function handleFile(file: File) {
    setStatus("Analyzing back ID… ⏳");

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const reader = new FileReader();

      reader.onload = async (e) => {
        if (!e.target?.result) return;

        const img = await loadImage(e.target.result as string);

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const result = await analyzeBackId(canvas);

        console.log("OCR TEXT:", result.text);
        console.log("MATCHED:", result.keywords);

        if (result.isBack) {
          setStatus(`Back ID verified ✅ `);
          setIsBackId(true);
        } else {
          setStatus(
            `Not a back ID ❌ (Please upload a Back ID or try a clearer/different photo)`,
          );
          setIsBackId(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setStatus("Failed to analyze image");
      setIsBackId(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-sm font-medium">Back ID</span>

      <label
        htmlFor="back-id-upload"
        className="p-2 min-h-40 border-2 border-dashed rounded-md flex justify-center items-center cursor-pointer hover:border-primary "
      >
        {preview ? (
          <Image
            src={preview}
            alt="Back ID preview"
            width={220}
            height={150}
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <CloudDownloadIcon size={28} />
            <span className="text-xs">Click to upload back ID</span>
          </div>
        )}
      </label>

      <input
        ref={inputRef}
        id="back-id-upload"
        type="file"
        accept="image/*"
        name="back"
        hidden
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
