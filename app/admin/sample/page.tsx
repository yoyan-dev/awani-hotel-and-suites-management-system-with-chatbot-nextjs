"use client";

import { useState, useRef, useEffect } from "react";

export default function IDVerifier() {
  const [progress, setProgress] = useState(0);
  const [resultText, setResultText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isID, setIsID] = useState<boolean | null>(null);
  const [Tesseract, setTesseract] = useState<any>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load Tesseract.js from CDN (avoids Node worker issues)
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js";
    script.onload = () => setTesseract((window as any).Tesseract);
    document.body.appendChild(script);
  }, []);

  const keywords = [
    "id",
    "identification",
    "license",
    "passport",
    "date of birth",
    "dob",
    "expiry",
    "signature",
    "republic",
    "government",
    "philsys",
    "umid",
    "lto",
    "sss",
    "pag-ibig",
    "postal id",
  ];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!Tesseract) return alert("Tesseract not loaded yet");

    const file = e.target.files?.[0];
    if (!file) return;

    setResultText("");
    setProgress(0);
    setIsID(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      const imgSrc = event.target.result as string;

      if (imageRef.current) imageRef.current.src = imgSrc;

      try {
        const { data } = await Tesseract.recognize(imgSrc, "eng", {
          logger: (m: any) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        setResultText(data.text);

        // Keyword check
        const matched = keywords.filter((k) =>
          data.text.toLowerCase().includes(k),
        );
        setIsID(matched.length >= 2);
      } catch (err) {
        console.error(err);
        setResultText("Failed to analyze image");
        setIsID(false);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>ID Verification (Free & Client-side)</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              height: 20,
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#4caf50",
                transition: "width 0.2s",
              }}
            />
          </div>
          <p>Analyzing image... {progress}%</p>
        </div>
      )}

      <img
        ref={imageRef}
        alt="Uploaded"
        style={{ marginTop: 20, maxWidth: "300px" }}
      />

      {resultText && (
        <pre
          style={{
            marginTop: 20,
            padding: 10,
            background: "#f5f5f5",
            borderRadius: 6,
          }}
        >
          {resultText}
        </pre>
      )}

      {isID !== null && (
        <p style={{ marginTop: 20, fontSize: 18 }}>
          {isID ? "Likely ID ✅" : "Not ID ❌"}
        </p>
      )}
    </main>
  );
}
