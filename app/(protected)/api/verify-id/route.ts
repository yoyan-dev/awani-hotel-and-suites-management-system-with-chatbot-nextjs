import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image uploaded" },
        { status: 400 },
      );
    }

    // Size limit (important)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File too large" },
        { status: 400 },
      );
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
      // 🇵🇭 optional PH IDs
      "philsys",
      "umid",
      "lto",
      "sss",
      "pag-ibig",
      "postal id",
    ];

    const matched = keywords.filter((k) => normalized.includes(k));

    const confidence = Math.min(matched.length / 4, 1); // 0 → 1
    const isLikelyID = matched.length >= 2;

    return NextResponse.json({
      success: true,
      isLikelyID,
      confidence,
      matchedKeywords: matched,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  }
}
