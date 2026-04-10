import { findChatbotQuickReply } from "@/lib/chatbot/match-quick-reply";
import {
  createGeminiChatbotStream,
  createGeminiFallbackStream,
} from "@/services/chatbot/gemini";
import { createTextStream } from "@/services/chatbot/text-stream";

export async function createChatbotStream(
  prompt: string,
  history: unknown,
): Promise<ReadableStream<Uint8Array>> {
  const quickReplyMatch = findChatbotQuickReply(prompt);

  if (quickReplyMatch?.entry.answer) {
    return createTextStream(quickReplyMatch.entry.answer);
  }

  try {
    return await createGeminiChatbotStream(prompt, history);
  } catch (error) {
    console.error("Chatbot Gemini fallback triggered:", error);
    return createGeminiFallbackStream();
  }
}
