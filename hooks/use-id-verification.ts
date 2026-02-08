"use client";
import { FRONT_KEYWORDS } from "@/utils/id-identifier/front-id-keywords";
import { useState, useEffect } from "react";

export function useOCR() {
  const [Tesseract, setTesseract] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [isID, setIsID] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js";
    script.onload = () => setTesseract((window as any).Tesseract);
    document.body.appendChild(script);
  }, []);

  async function analyze(file: File) {
    if (!Tesseract) return;

    setLoading(true);
    setProgress(0);
    setResult("");
    setIsID(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      const imgSrc = event.target.result as string;

      try {
        const { data } = await Tesseract.recognize(imgSrc, "eng", {
          logger: (m: any) => {
            if (m.status === "recognizing text")
              setProgress(Math.round(m.progress * 100));
          },
        });

        setResult(data.text);

        const matched = FRONT_KEYWORDS.filter((k) =>
          data.text.toLowerCase().includes(k),
        );
        setIsID(matched.length >= 2);
      } catch (err) {
        console.error(err);
        setResult("Failed to analyze image");
        setIsID(false);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    reader.readAsDataURL(file);
  }

  return { progress, result, isID, loading, analyze };
}
