import { ApiRouteError } from "@/lib/api/route-error";
import Tesseract from "tesseract.js";

export async function verifyIdImage(formData: FormData) {
  const file = formData.get("image") as File;

  if (!file) {
    throw new ApiRouteError("No image uploaded", { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new ApiRouteError("File too large", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const {
    data: { text },
  } = await Tesseract.recognize(buffer, "eng");

  const normalized = text.toLowerCase();
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

  const matched = keywords.filter((keyword) => normalized.includes(keyword));

  return {
    isLikelyID: matched.length >= 2,
    confidence: Math.min(matched.length / 4, 1),
    matchedKeywords: matched,
  };
}
