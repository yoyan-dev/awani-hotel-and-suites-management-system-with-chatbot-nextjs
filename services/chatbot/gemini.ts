import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildLiveSections } from "@/services/chatbot/live-room-context";
import { createTextStream } from "@/services/chatbot/text-stream";
import { ChatHistoryItem } from "@/types/chatbot";

const CHATBOT_MEMORY_ITEMS = 20;

export const CHATBOT_GEMINI_FALLBACK_MESSAGE =
  "I'm sorry, I couldn't generate a live answer right now. For immediate help, please contact Front Office at +63 917 302 4794 or awanihotel2019@yahoo.com.";

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

function sanitizeHistory(history: unknown): ChatHistoryItem[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item: unknown): item is ChatHistoryItem =>
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
    .slice(-CHATBOT_MEMORY_ITEMS);
}

export function createGeminiFallbackStream(): ReadableStream<Uint8Array> {
  return createTextStream(CHATBOT_GEMINI_FALLBACK_MESSAGE);
}

export async function createGeminiChatbotStream(
  prompt: string,
  history: unknown,
): Promise<ReadableStream<Uint8Array>> {
  const safeHistory = sanitizeHistory(history);
  const liveSections = await buildLiveSections(prompt);

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
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
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.6,
    },
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });
}
