import crypto from "node:crypto";
import { applyDiditWebhookDecision, recordDiditWebhookEvent } from "@/lib/didit/service";
import { isDiditStatus } from "@/lib/didit/config";

export const runtime = "nodejs";

function shortenFloats(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shortenFloats);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, x]) => [
        k,
        shortenFloats(x),
      ]),
    );
  }
  if (typeof v === "number" && !Number.isInteger(v) && v % 1 === 0) {
    return Math.trunc(v);
  }
  return v;
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    return Object.keys(v as object)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortKeys((v as Record<string, unknown>)[k]);
        return acc;
      }, {});
  }
  return v;
}

function getWebhookSecret() {
  return process.env.DIDIT_WEBHOOK_SECRET ?? "";
}

function hasValidSignature(raw: string, signature: string) {
  const parsed = JSON.parse(raw);
  const canonical = JSON.stringify(sortKeys(shortenFloats(parsed)));
  const expected = crypto
    .createHmac("sha256", getWebhookSecret())
    .update(canonical, "utf8")
    .digest("hex");

  return (
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-signature-v2") ?? "";
  const timestamp = Number(req.headers.get("x-timestamp"));

  if (!getWebhookSecret()) {
    return new Response("missing secret", { status: 500 });
  }

  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) {
    return new Response("stale", { status: 401 });
  }

  if (!hasValidSignature(raw, signature)) {
    return new Response("bad sig", { status: 401 });
  }

  const event = JSON.parse(raw);
  const eventId = String(event.event_id ?? "");

  if (!eventId) {
    return new Response("missing event_id", { status: 400 });
  }

  const { isDuplicate } = await recordDiditWebhookEvent({
    event_id: eventId,
    session_id: event.session_id,
    webhook_type: event.webhook_type,
    status: event.status,
  });

  if (isDuplicate) {
    return new Response("ok");
  }

  if (
    event.webhook_type === "status.updated" &&
    isDiditStatus(event.status) &&
    typeof event.vendor_data === "string"
  ) {
    await applyDiditWebhookDecision({
      vendor_data: event.vendor_data,
      session_id: event.session_id,
      status: event.status,
      decision: event.decision,
      metadata: event.metadata,
      resubmit_info: event.resubmit_info,
    });
  }

  return new Response("ok");
}
