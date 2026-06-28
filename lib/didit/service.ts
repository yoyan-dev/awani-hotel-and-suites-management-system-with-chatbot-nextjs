import { ApiRouteError } from "@/lib/api/route-error";
import {
  DIDIT_API_BASE_URL,
  DIDIT_WORKFLOW_ID,
  DiditStatus,
  isDiditStatus,
} from "@/lib/didit/config";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CreateDiditSessionPayload = {
  vendorData: string;
  callback: string;
  bookingType?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

type DiditSessionResponse = {
  session_id: string;
  session_token?: string;
  url: string;
  status: DiditStatus;
  workflow_id: string;
  vendor_data: string;
};

function requireDiditApiKey() {
  const apiKey = process.env.DIDIT_API_KEY;
  if (!apiKey) {
    throw new ApiRouteError("Missing DIDIT_API_KEY.", {
      status: 500,
      title: "Configuration Error",
    });
  }

  return apiKey;
}

function toCleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function assertVendorData(value: string) {
  if (!value || value.length > 120) {
    throw new ApiRouteError("A valid verification reference is required.", {
      status: 400,
      title: "Invalid Verification",
      color: "warning",
    });
  }
}

function buildContactDetails(payload: CreateDiditSessionPayload) {
  const contactDetails: Record<string, string> = {};
  const email = toCleanString(payload.email);
  const phone = toCleanString(payload.phone);

  if (email) contactDetails.email = email;
  if (phone) contactDetails.phone = phone;

  return Object.keys(contactDetails).length ? contactDetails : undefined;
}

export async function createDiditSession(payload: CreateDiditSessionPayload) {
  const vendorData = toCleanString(payload.vendorData);
  assertVendorData(vendorData);

  const res = await fetch(`${DIDIT_API_BASE_URL}/v3/session/`, {
    method: "POST",
    headers: {
      "x-api-key": requireDiditApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflow_id: DIDIT_WORKFLOW_ID,
      vendor_data: vendorData,
      callback: payload.callback,
      callback_method: "both",
      language: "en",
      contact_details: buildContactDetails(payload),
      metadata: {
        booking_type: payload.bookingType ?? "guest_reservation",
        full_name: toCleanString(payload.fullName) || undefined,
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new ApiRouteError("Could not start identity verification.", {
      status: 502,
      title: "Didit Verification Error",
      extra: { detail },
    });
  }

  const session = (await res.json()) as DiditSessionResponse;

  const { error } = await (supabaseAdmin.from("guest_id_verifications" as any) as any)
    .upsert(
      {
        vendor_data: vendorData,
        session_id: session.session_id,
        status: isDiditStatus(session.status) ? session.status : "Not Started",
        metadata: {
          workflow_id: session.workflow_id,
          booking_type: payload.bookingType ?? "guest_reservation",
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "vendor_data" },
    );

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return {
    url: session.url,
    session_id: session.session_id,
  };
}

export async function getDiditVerification(vendorData: string) {
  const cleanedVendorData = toCleanString(vendorData);
  if (!cleanedVendorData) return null;

  const { data, error } = await (supabaseAdmin
    .from("guest_id_verifications" as any) as any)
    .select("*")
    .eq("vendor_data", cleanedVendorData)
    .maybeSingle();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data as
    | {
        vendor_data: string;
        session_id: string | null;
        status: DiditStatus;
        decision: unknown;
        metadata: unknown;
        resubmit_info: unknown;
        verified_at: string | null;
      }
    | null;
}

export async function assertDiditApproved(vendorData: string) {
  const verification = await getDiditVerification(vendorData);

  if (verification?.status !== "Approved") {
    throw new ApiRouteError(
      "Please complete identity verification before submitting your reservation.",
      {
        status: 400,
        title: "ID Verification Required",
        color: "warning",
      },
    );
  }

  return verification;
}

export async function recordDiditWebhookEvent(event: {
  event_id: string;
  session_id?: string;
  webhook_type?: string;
  status?: string;
}) {
  const { error } = await (supabaseAdmin.from("didit_webhook_events" as any) as any)
    .insert({
      event_id: event.event_id,
      session_id: event.session_id ?? null,
      webhook_type: event.webhook_type ?? null,
      status: event.status ?? null,
    });

  if (!error) return { isDuplicate: false };
  if (error.code === "23505") return { isDuplicate: true };

  throw new ApiRouteError(error.message);
}

export async function applyDiditWebhookDecision(event: {
  vendor_data: string;
  session_id?: string;
  status: DiditStatus;
  decision?: unknown;
  metadata?: unknown;
  resubmit_info?: unknown;
}) {
  const verifiedAt =
    event.status === "Approved" ? new Date().toISOString() : null;

  const { error } = await (supabaseAdmin.from("guest_id_verifications" as any) as any)
    .upsert(
      {
        vendor_data: event.vendor_data,
        session_id: event.session_id ?? null,
        status: event.status,
        decision: event.decision ?? null,
        metadata: event.metadata ?? null,
        resubmit_info: event.resubmit_info ?? null,
        verified_at: verifiedAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "vendor_data" },
    );

  if (error) {
    throw new ApiRouteError(error.message);
  }

  await (supabaseAdmin.from("guest" as any) as any)
    .update({
      valid_id: {
        provider: "didit",
        session_id: event.session_id ?? null,
        status: event.status,
        verified_at: verifiedAt,
      },
    })
    .eq("id", event.vendor_data);
}
