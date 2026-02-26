import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase/supabase-client";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";
import { filterAvailableRoomTypes } from "@/lib/room-availability/room-type-availability";
import {
  collectRequestedQuantities,
  resolveRoomTypeAddOnAvailability,
} from "@/lib/add-ons/availability";
import { RoomType } from "@/types/room";

const CHATBOT_MEMORY_ITEMS = 20;

type ChatHistoryItem = {
  from: "user" | "bot";
  text: string;
};

const ROOM_TYPE_KEYWORDS = [
  "room type",
  "room types",
  "rooms",
  "suite",
  "suites",
  "accommodation",
  "accommodations",
];

const AVAILABILITY_KEYWORDS = [
  "available",
  "availability",
  "check in",
  "check-in",
  "check out",
  "check-out",
  "book",
  "booking",
  "guest",
  "guests",
  "pax",
];

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeDateToken(token: string): string | null {
  const cleaned = token.trim();

  if (isIsoDate(cleaned)) {
    return cleaned;
  }

  const slashMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);
    const yearRaw = Number(slashMatch[3]);
    const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }

    const asDate = new Date(Date.UTC(year, month - 1, day));
    if (
      asDate.getUTCFullYear() !== year ||
      asDate.getUTCMonth() !== month - 1 ||
      asDate.getUTCDate() !== day
    ) {
      return null;
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`;
  }

  return null;
}

function extractAvailabilityParams(message: string): {
  checkIn?: string;
  checkOut?: string;
  maxGuest?: number;
} {
  const datePattern = "(\\d{4}-\\d{2}-\\d{2}|\\d{1,2}\\/\\d{1,2}\\/\\d{2,4})";

  const checkInMatch = message.match(
    new RegExp(`(?:check\\s*-?\\s*in|from)\\s*(?:date)?\\s*[:=]?\\s*${datePattern}`, "i"),
  );
  const checkOutMatch = message.match(
    new RegExp(`(?:check\\s*-?\\s*out|to|until)\\s*(?:date)?\\s*[:=]?\\s*${datePattern}`, "i"),
  );

  const allDateMatches = Array.from(
    message.matchAll(new RegExp(datePattern, "gi")),
    (entry) => entry[1],
  );

  const checkIn = normalizeDateToken(checkInMatch?.[1] ?? allDateMatches[0] ?? "");
  const checkOut = normalizeDateToken(checkOutMatch?.[1] ?? allDateMatches[1] ?? "");

  const guestsMatch =
    message.match(
      /(?:max(?:imum)?\s*)?(?:guest|guests|people|persons|pax)\s*(?:is|are|=|:)?\s*(\d{1,2})/i,
    ) ?? message.match(/for\s+(\d{1,2})\s*(?:guest|guests|people|persons|pax)/i);

  const maxGuest = guestsMatch?.[1] ? Number(guestsMatch[1]) : undefined;

  return {
    checkIn: checkIn ?? undefined,
    checkOut: checkOut ?? undefined,
    maxGuest: Number.isFinite(maxGuest) ? maxGuest : undefined,
  };
}

function formatRoomTypeForPrompt(roomType: any): string {
  const name = roomType?.name || "Unnamed room type";
  const maxGuest = roomType?.max_guest ?? "N/A";
  const price = roomType?.price != null ? Number(roomType.price) : null;
  const roomSize = roomType?.room_size || "N/A";
  const description = roomType?.description || "No description provided.";
  const roomsCount = Array.isArray(roomType?.rooms) ? roomType.rooms.length : 0;

  const addOns = Array.isArray(roomType?.room_type_add_ons)
    ? roomType.room_type_add_ons
    : [];

  const addOnSummary = addOns
    .map((entry: any) => {
      const label = entry?.add_on?.name || "Unknown add-on";
      const limit = entry?.quantity_limit ?? 0;
      const addOnPrice =
        entry?.add_on?.price != null ? `PHP ${Number(entry.add_on.price)}` : "No price";
      const remaining =
        entry?.remaining_quantity != null ? `, remaining ${entry.remaining_quantity}` : "";
      return `${label} (limit ${limit}${remaining}, ${addOnPrice})`;
    })
    .join("; ");

  return [
    `- ${name}`,
    `  max guests: ${maxGuest}`,
    `  base price: ${price != null ? `PHP ${price}` : "N/A"}`,
    `  room size: ${roomSize}`,
    `  available rooms in set: ${roomsCount}`,
    `  description: ${description}`,
    `  add-ons: ${addOnSummary || "None"}`,
  ].join("\n");
}

async function getRoomTypes(maxGuest?: number): Promise<any[]> {
  let query = supabase
    .from("room_types")
    .select(
      `
        ${ROOM_TYPE_ADD_ONS_SELECT},
        rooms (
          id,
          room_number
        )
      `,
    )
    .order("max_guest", { ascending: true });

  if (maxGuest && maxGuest > 0) {
    query = query.gte("max_guest", maxGuest);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function getAvailableRoomTypes(params: {
  checkIn: string;
  checkOut: string;
  maxGuest?: number;
}): Promise<RoomType[]> {
  const maxGuest = params.maxGuest && params.maxGuest > 0 ? params.maxGuest : 1;

  const roomTypes = await getRoomTypes(maxGuest);
  const roomTypeIds = roomTypes
    .map((roomType) => roomType.id)
    .filter((id): id is string => Boolean(id));

  if (roomTypeIds.length === 0) {
    return [];
  }

  const checkInDate = new Date(params.checkIn);
  const checkOutDate = new Date(params.checkOut);
  const normalizedCheckOut = checkOutDate < checkInDate ? params.checkIn : params.checkOut;

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .in("room_type_id", roomTypeIds)
    .neq("status", "cancelled")
    .neq("status", "checked_out")
    .lte("checked_in", normalizedCheckOut)
    .gte("checked_out", params.checkIn);

  if (bookingsError) {
    throw new Error(bookingsError.message);
  }

  const roomTypesWithBookings: RoomType[] = roomTypes.map((roomType) => {
    const overlappingBookings =
      bookings?.filter(
        (booking) => booking.room_type_id === roomType.id && booking.status !== "cancelled",
      ) ?? [];

    const totals = collectRequestedQuantities(
      overlappingBookings.flatMap((booking) => booking.special_requests ?? []),
    );
    const availableAddOns = resolveRoomTypeAddOnAvailability(roomType, totals);

    return {
      ...roomType,
      room_type_add_ons: (roomType.room_type_add_ons ?? []).map((relation: any) => {
        const matched = availableAddOns.find(
          (row) => row.room_type_add_on_id === relation.id,
        );

        return {
          ...relation,
          reserved_quantity: matched?.reserved_quantity ?? 0,
          remaining_quantity: matched?.remaining_quantity ?? 0,
        };
      }),
      bookings: overlappingBookings,
    };
  });

  return filterAvailableRoomTypes(roomTypesWithBookings);
}

function buildSystemInstructions(liveContext: string): string {
  return `You are Awani, a friendly and professional hotel assistant chatbot for Awani Hotel Management System.

You can answer general hotel questions, but when live room context is provided below, prioritize that data and do not invent room types, prices, availability, or add-on limits.

LIVE ROOM CONTEXT
${liveContext || "No live room data was loaded for this request."}

RESPONSE RULES
- Be concise and clear.
- If availability dates or guest count are missing, ask for check-in date, check-out date, and max guest count.
- Use date format YYYY-MM-DD when asking the guest.
- Do not use markdown syntax (no asterisks, bold markers, headings, or tables).
- For lists, use simple plain-text lines starting with a hyphen.
- If no rooms are available, say that clearly and suggest adjusting dates or guest count.
- For policies or details not in context, suggest contacting Front Office at +63 917 302 4794.`;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const prompt = String(message ?? "").trim();

    if (!prompt) {
      return new Response("Please provide a message.", { status: 400 });
    }

    const safeHistory: ChatHistoryItem[] = Array.isArray(history)
      ? history
          .filter(
            (item: unknown): item is ChatHistoryItem =>
              Boolean(
                item &&
                  typeof item === "object" &&
                  (item as ChatHistoryItem).from &&
                  (item as ChatHistoryItem).text,
              ),
          )
          .map((item) => ({
            from: (item.from === "bot" ? "bot" : "user") as ChatHistoryItem["from"],
            text: String(item.text ?? "").trim(),
          }))
          .filter((item) => item.text.length > 0)
          .slice(-CHATBOT_MEMORY_ITEMS)
      : [];

    const lowerPrompt = prompt.toLowerCase();
    const wantsRoomTypes = ROOM_TYPE_KEYWORDS.some((word) => lowerPrompt.includes(word));
    const wantsAvailability = AVAILABILITY_KEYWORDS.some((word) => lowerPrompt.includes(word));

    const params = extractAvailabilityParams(prompt);
    const liveSections: string[] = [];

    if (wantsAvailability) {
      if (params.checkIn && params.checkOut && params.maxGuest) {
        const available = await getAvailableRoomTypes({
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          maxGuest: params.maxGuest,
        });

        liveSections.push(
          [
            `Availability query params: checkIn=${params.checkIn}, checkOut=${params.checkOut}, maxGuest=${params.maxGuest ?? 1}`,
            `Available room types found: ${available.length}`,
            ...(available.length
              ? available.map((roomType) => formatRoomTypeForPrompt(roomType))
              : ["No available room types for the requested dates/guest count."]),
          ].join("\n"),
        );
      } else {
        liveSections.push(
          "MISSING_AVAILABILITY_PARAMS: Ask for check-in date, check-out date, and max guest count using YYYY-MM-DD.",
        );
      }
    }

    if (wantsRoomTypes || !liveSections.length) {
      const roomTypes = await getRoomTypes(params.maxGuest);
      liveSections.push(
        [
          `Room types found: ${roomTypes.length}${
            params.maxGuest ? ` (filtered by maxGuest >= ${params.maxGuest})` : ""
          }`,
          ...roomTypes.map((roomType) => formatRoomTypeForPrompt(roomType)),
        ].join("\n"),
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: buildSystemInstructions(liveSections.join("\n\n")),
            },
          ],
        },
        ...safeHistory.map((item) => ({
          role: item.from === "bot" ? ("model" as const) : ("user" as const),
          parts: [{ text: item.text }],
        })),
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.6,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          controller.enqueue(encoder.encode(chunk.text()));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Error: Unknown Error!", { status: 500 });
  }
}

