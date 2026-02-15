import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Awani API",
    version: "1.0",
  });
}
