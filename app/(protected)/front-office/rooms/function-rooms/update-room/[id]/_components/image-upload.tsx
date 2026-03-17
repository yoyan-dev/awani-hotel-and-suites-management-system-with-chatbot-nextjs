"use client";
import React from "react";
import { Button, Image } from "@heroui/react";
import { Upload, X } from "lucide-react";

interface ImagesUploadProps {
  image: any;
  setImage: React.Dispatch<React.SetStateAction<any>>;
}

export default function ImagesUpload({ image, setImage }: ImagesUploadProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImage(newImage);
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <h2>Room Photos</h2>
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Upload size={28} />
          <span className="text-sm">Click or drag file to upload</span>
        </div>
      </label>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap gap-2">
        {image ? (
          <Image
            src={image}
            alt="Room image"
            width={150}
            className="rounded-lg cursor-pointer"
          />
        ) : null}
      </div>
    </div>
  );
}
