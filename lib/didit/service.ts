import { ApiRouteError } from "@/lib/api/route-error";
import {
  DIDIT_API_BASE_URL,
  DIDIT_WORKFLOW_ID,
  DiditStatus,
  isDiditStatus,
} from "@/lib/didit/config";
import { supabase } from "@/lib/supabase/supabase-client";
import { uploadValidIDImageFromUrls } from "@/lib/upload-valid-id";

function throwSupabaseError(message: string): never {
  const normalized = message.toLowerCase();
  const description =
    normalized.includes("invalid api key") ||
    normalized.includes("jwt") ||
    normalized.includes("unauthorized")
      ? "Supabase rejected the configured API key. Check that SUPABASE_URL and SUPABASE_ANON_KEY belong to the same Supabase project, then restart the dev server."
      : message;

  throw new ApiRouteError(description);
}

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

type DiditIdVerificationDecision = {
  status?: DiditStatus;
  front_image?: string | null;
  back_image?: string | null;
  full_front_image?: string | null;
  full_back_image?: string | null;
  [key: string]: unknown;
};

type DiditSessionDecision = {
  status?: DiditStatus;
  id_verifications?: DiditIdVerificationDecision[];
  [key: string]: unknown;
};

type DiditVerificationRecord = {
  vendor_data: string;
  session_id: string | null;
  status: DiditStatus;
  decision: unknown;
  metadata: unknown;
  resubmit_info: unknown;
  verified_at: string | null;
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

function asRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function getStoredMedia(metadata: unknown) {
  const record = asRecord(metadata);

  return {
    front: typeof record.front === "string" ? record.front : null,
    back: typeof record.back === "string" ? record.back : null,
  };
}

function getSessionDecisionFromWebhook(decision: unknown) {
  const record = asRecord(decision);
  return Array.isArray(record.id_verifications)
    ? (record as DiditSessionDecision)
    : null;
}

function getIdVerificationMedia(decision: DiditSessionDecision | null) {
  const idVerification = decision?.id_verifications?.find(
    (item) => item.front_image || item.full_front_image,
  );

  if (!idVerification) {
    return { frontImageUrl: null, backImageUrl: null };
  }

  return {
    frontImageUrl:
      idVerification.front_image ?? idVerification.full_front_image ?? null,
    backImageUrl:
      idVerification.back_image ?? idVerification.full_back_image ?? null,
  };
}

function getDecisionStatus(decision: DiditSessionDecision) {
  if (isDiditStatus(decision.status)) {
    return decision.status;
  }

  const status = decision.id_verifications?.find((item) =>
    isDiditStatus(item.status),
  )?.status;

  return isDiditStatus(status) ? status : null;
}

async function retrieveDiditSessionDecision(sessionId: string) {
  const res = await fetch(`${DIDIT_API_BASE_URL}/v3/session/${sessionId}/decision/`, {
    headers: {
      "x-api-key": requireDiditApiKey(),
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new ApiRouteError("Could not retrieve Didit verification decision.", {
      status: 502,
      title: "Didit Verification Error",
      extra: { detail },
    });
  }

  return (await res.json()) as DiditSessionDecision;
}

async function persistDiditCapturedIdImages(params: {
  sessionId: string | null;
  decision: unknown;
  metadata: unknown;
}) {
  const storedMedia = getStoredMedia(params.metadata);

  if (storedMedia.front || storedMedia.back || !params.sessionId) {
    return {
      decision: params.decision,
      metadata: params.metadata,
      front: storedMedia.front,
      back: storedMedia.back,
    };
  }

  const sessionDecision =
    getSessionDecisionFromWebhook(params.decision) ??
    (await retrieveDiditSessionDecision(params.sessionId));
  const { frontImageUrl, backImageUrl } = getIdVerificationMedia(sessionDecision);

  if (!frontImageUrl && !backImageUrl) {
    return {
      decision: sessionDecision,
      metadata: {
        ...asRecord(params.metadata),
        mode: "hosted_session",
        media_sync_status: "no_media_urls",
      },
      front: null,
      back: null,
    };
  }

  const uploadedMedia = await uploadValidIDImageFromUrls(
    frontImageUrl,
    backImageUrl,
  );

  return {
    decision: sessionDecision,
    metadata: {
      ...asRecord(params.metadata),
      mode: "hosted_session",
      front: uploadedMedia.front,
      back: uploadedMedia.back,
    },
    front: uploadedMedia.front,
    back: uploadedMedia.back,
  };
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

  const { error } = await (
    supabase.from("guest_id_verifications" as any) as any
  ).upsert(
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
    throwSupabaseError(error.message);
  }

  return {
    url: session.url,
    session_id: session.session_id,
  };
}

export async function getDiditVerification(vendorData: string) {
  const cleanedVendorData = toCleanString(vendorData);
  if (!cleanedVendorData) return null;

  const { data, error } = await (
    supabase.from("guest_id_verifications" as any) as any
  )
    .select("*")
    .eq("vendor_data", cleanedVendorData)
    .maybeSingle();

  if (error) {
    throwSupabaseError(error.message);
  }

  return data as DiditVerificationRecord | null;
}

export async function refreshDiditVerificationFromSession(vendorData: string) {
  const verification = await getDiditVerification(vendorData);

  if (!verification?.session_id) {
    return verification;
  }

  let decision: DiditSessionDecision;
  try {
    decision = await retrieveDiditSessionDecision(verification.session_id);
  } catch {
    return verification;
  }
  const status = getDecisionStatus(decision) ?? verification.status;
  const verifiedAt =
    status === "Approved"
      ? verification.verified_at ?? new Date().toISOString()
      : verification.verified_at;
  const media =
    status === "Approved"
      ? await persistDiditCapturedIdImages({
          sessionId: verification.session_id,
          decision,
          metadata: verification.metadata,
        })
      : {
          decision,
          metadata: verification.metadata,
        };

  const updatedVerification = {
    ...verification,
    status,
    decision: media.decision,
    metadata: media.metadata,
    verified_at: verifiedAt,
  };

  const { error } = await (
    supabase.from("guest_id_verifications" as any) as any
  )
    .update({
      status: updatedVerification.status,
      decision: updatedVerification.decision,
      metadata: updatedVerification.metadata,
      verified_at: updatedVerification.verified_at,
      updated_at: new Date().toISOString(),
    })
    .eq("vendor_data", verification.vendor_data);

  if (error) {
    throwSupabaseError(error.message);
  }

  return updatedVerification;
}

export async function assertDiditApproved(vendorData: string) {
  const verification = await refreshDiditVerificationFromSession(vendorData);

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

  const media = await persistDiditCapturedIdImages({
    sessionId: verification.session_id,
    decision: verification.decision,
    metadata: verification.metadata,
  });

  if (media.front || media.back) {
    const { error } = await (
      supabase.from("guest_id_verifications" as any) as any
    ).update({
      decision: media.decision,
      metadata: media.metadata,
      updated_at: new Date().toISOString(),
    }).eq("vendor_data", verification.vendor_data);

    if (error) {
      throwSupabaseError(error.message);
    }

    return {
      ...verification,
      decision: media.decision,
      metadata: media.metadata,
    };
  }

  return verification;
}

export async function recordDiditWebhookEvent(event: {
  event_id: string;
  session_id?: string;
  webhook_type?: string;
  status?: string;
}) {
  const { error } = await (
    supabase.from("didit_webhook_events" as any) as any
  ).insert({
    event_id: event.event_id,
    session_id: event.session_id ?? null,
    webhook_type: event.webhook_type ?? null,
    status: event.status ?? null,
  });

  if (!error) return { isDuplicate: false };
  if (error.code === "23505") return { isDuplicate: true };

  throwSupabaseError(error.message);
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
  const media =
    event.status === "Approved"
      ? await persistDiditCapturedIdImages({
          sessionId: event.session_id ?? null,
          decision: event.decision,
          metadata: event.metadata,
        })
      : {
          decision: event.decision ?? null,
          metadata: event.metadata ?? null,
          front: null,
          back: null,
        };

  const { error } = await (
    supabase.from("guest_id_verifications" as any) as any
  ).upsert(
    {
      vendor_data: event.vendor_data,
      session_id: event.session_id ?? null,
      status: event.status,
      decision: media.decision,
      metadata: media.metadata,
      resubmit_info: event.resubmit_info ?? null,
      verified_at: verifiedAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "vendor_data" },
  );

  if (error) {
    throwSupabaseError(error.message);
  }

  await (supabase.from("guest" as any) as any)
    .update({
      valid_id: {
        provider: "didit",
        session_id: event.session_id ?? null,
        status: event.status,
        verified_at: verifiedAt,
        front: media.front,
        back: media.back,
        decision: media.decision,
        metadata: media.metadata,
      },
    })
    .eq("id", event.vendor_data);
}
