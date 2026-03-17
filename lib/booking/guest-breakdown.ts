export const HOTEL_GUEST_BREAKDOWN_FIELDS = [
  { key: "adult", label: "Adult", pluralLabel: "Adults" },
  { key: "child", label: "Child", pluralLabel: "Children" },
  { key: "infant", label: "Infant", pluralLabel: "Infants" },
  { key: "senior", label: "Senior", pluralLabel: "Seniors" },
  { key: "pwd", label: "PWD", pluralLabel: "PWD" },
  { key: "other", label: "Other", pluralLabel: "Others" },
] as const;

export type GuestBreakdownKey =
  (typeof HOTEL_GUEST_BREAKDOWN_FIELDS)[number]["key"];

export type GuestBreakdown = Record<GuestBreakdownKey, number>;

function normalizeGuestCount(value: unknown) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0;
  }

  return Math.floor(numericValue);
}

export function createGuestBreakdown(
  seed?: Partial<GuestBreakdown> | null,
): GuestBreakdown {
  return HOTEL_GUEST_BREAKDOWN_FIELDS.reduce(
    (acc, field) => {
      acc[field.key] = normalizeGuestCount(seed?.[field.key]);
      return acc;
    },
    {} as GuestBreakdown,
  );
}

export function parseGuestBreakdown(value: unknown): GuestBreakdown | null {
  if (!value) return null;

  let parsedValue = value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      parsedValue = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
    return null;
  }

  return createGuestBreakdown(parsedValue as Partial<GuestBreakdown>);
}

export function getGuestBreakdownTotal(
  breakdown?: Partial<GuestBreakdown> | null,
) {
  const normalized = createGuestBreakdown(breakdown);

  return HOTEL_GUEST_BREAKDOWN_FIELDS.reduce(
    (total, field) => total + normalized[field.key],
    0,
  );
}

export function hasGuestBreakdown(breakdown?: Partial<GuestBreakdown> | null) {
  return getGuestBreakdownTotal(breakdown) > 0;
}

export function serializeGuestBreakdown(
  breakdown?: Partial<GuestBreakdown> | null,
) {
  return JSON.stringify(createGuestBreakdown(breakdown));
}

export function formatGuestBreakdown(
  breakdown?: Partial<GuestBreakdown> | null,
) {
  const normalized = createGuestBreakdown(breakdown);

  return HOTEL_GUEST_BREAKDOWN_FIELDS.map((field) => {
    const count = normalized[field.key];
    if (count <= 0) return null;

    const label = count === 1 ? field.label : field.pluralLabel;
    return `${count} ${label}`;
  })
    .filter(Boolean)
    .join(", ");
}

function parseLooseGuestTotal(value: unknown) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0;
  }

  return Math.floor(numericValue);
}

export function getBookingGuestTotal(input: {
  guest_breakdown?: unknown;
  number_of_guests?: unknown;
}) {
  const breakdown = parseGuestBreakdown(input.guest_breakdown);
  if (breakdown) {
    return getGuestBreakdownTotal(breakdown);
  }

  return parseLooseGuestTotal(input.number_of_guests);
}

export function formatBookingGuestSummary(input: {
  guest_breakdown?: unknown;
  number_of_guests?: unknown;
}) {
  const breakdown = parseGuestBreakdown(input.guest_breakdown);
  const total = getBookingGuestTotal(input);
  const formattedBreakdown = formatGuestBreakdown(breakdown);

  if (total > 0 && formattedBreakdown) {
    return `${total} (${formattedBreakdown})`;
  }

  if (total > 0) {
    return String(total);
  }

  return "-";
}
