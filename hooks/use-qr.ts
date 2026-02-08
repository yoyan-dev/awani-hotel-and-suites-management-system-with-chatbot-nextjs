"use client";
import { useState } from "react";
import jsQR from "jsqr";

export function useQR() {
  const [qrResult, setQrResult] = useState<string | null>(null);

  function analyze(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) setQrResult(code.data);
        else setQrResult(null); // no QR found
      };
      img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  return { qrResult, analyze };
}
