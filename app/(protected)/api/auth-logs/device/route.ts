import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ApiResponse } from "@/types/response";

function getIpAddress(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }
  const realIp = headers.get("x-real-ip");
  return realIp ?? null;
}

function deriveDeviceName(userAgent: string | null) {
  if (!userAgent) return "Unknown Device";
  const ua = userAgent.toLowerCase();

  const os =
    ua.includes("windows")
      ? "Windows"
      : ua.includes("mac os") || ua.includes("macintosh")
        ? "macOS"
        : ua.includes("android")
          ? "Android"
          : ua.includes("iphone") || ua.includes("ipad")
            ? "iOS"
            : ua.includes("linux")
              ? "Linux"
              : "Unknown OS";

  const browser =
    ua.includes("edg")
      ? "Edge"
      : ua.includes("chrome")
        ? "Chrome"
        : ua.includes("firefox")
          ? "Firefox"
          : ua.includes("safari")
            ? "Safari"
            : "Browser";

  return `${os} - ${browser}`;
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const userId = body?.userId as string | undefined;
    const deviceName = body?.deviceName as string | undefined;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Missing userId",
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    const userAgent = req.headers.get("user-agent");
    const ipAddress = getIpAddress(req.headers);
    const finalDeviceName = deviceName || deriveDeviceName(userAgent);

    const { data: latestLog, error: latestError } = await supabaseAdmin
      .from("auth_activity_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("event_type", "login")
      .order("event_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: latestError.message,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    if (!latestLog?.id) {
      return NextResponse.json(
        {
          success: true,
          message: {
            title: "Success",
            description: "No login log found to update.",
            color: "success",
          },
        },
        { status: 200 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("auth_activity_logs")
      .update({
        device_name: finalDeviceName,
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .eq("id", latestLog.id);

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: updateError.message,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Login device captured.",
          color: "success",
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
