import { ApiRouteError } from "@/lib/api/route-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

function getIpAddress(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }

  return headers.get("x-real-ip") ?? null;
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

export async function listAuthLogs(
  page: number,
  limit: number,
  userId: string | null,
  queryText: string,
) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = supabaseAdmin
    .from("auth_activity_logs")
    .select("*", { count: "exact" })
    .order("event_at", { ascending: false })
    .range(from, to);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (queryText) {
    const escaped = queryText.replace(/,/g, "");
    query = query.or(
      [
        `email.ilike.%${escaped}%`,
        `role.ilike.%${escaped}%`,
        `event_type.ilike.%${escaped}%`,
        `device_name.ilike.%${escaped}%`,
        `user_id.ilike.%${escaped}%`,
      ].join(","),
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new ApiRouteError(error.message, { status: 400 });
  }

  return {
    items: data ?? [],
    total: count ?? 0,
    page,
    limit,
  };
}

export async function captureLoginDevice(
  headers: Headers,
  body: { userId?: string; deviceName?: string },
) {
  if (!body.userId) {
    throw new ApiRouteError("Missing userId", { status: 400 });
  }

  const userAgent = headers.get("user-agent");
  const ipAddress = getIpAddress(headers);
  const finalDeviceName = body.deviceName || deriveDeviceName(userAgent);

  const { data: latestLog, error: latestError } = await supabaseAdmin
    .from("auth_activity_logs")
    .select("id")
    .eq("user_id", body.userId)
    .eq("event_type", "login")
    .order("event_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    throw new ApiRouteError(latestError.message, { status: 400 });
  }

  if (!latestLog?.id) {
    return {
      description: "No login log found to update.",
    };
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
    throw new ApiRouteError(updateError.message, { status: 400 });
  }

  return {
    description: "Login device captured.",
  };
}
