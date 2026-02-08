import { analyzeBackText } from "@/utils/id-identifier/analyze-id-back-text";

let Tesseract: any = null;

export function useTesseract() {
  let loaded = false;

  if (Tesseract) return (loaded = true);

  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js";
  script.onload = () => {
    Tesseract = (window as any).Tesseract;
    loaded = true;
  };
  document.body.appendChild(script);

  return loaded;
}

export async function analyzeBackId(canvas: HTMLCanvasElement) {
  if (!Tesseract) throw new Error("Tesseract not loaded yet");

  const {
    data: { text },
  } = await Tesseract.recognize(canvas, "eng");

  const keywordResult = analyzeBackText(text);

  let confidence = keywordResult.score;

  if (text.length > 80) confidence += 10; // text-heavy
  confidence = Math.min(confidence, 100);

  return {
    isBack: confidence >= 50,
    confidence,
    text,
    keywords: keywordResult.matched,
  };
}
