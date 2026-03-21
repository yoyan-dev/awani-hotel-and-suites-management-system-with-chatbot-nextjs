import { ChatbotRequestPayload } from "@/types/chatbot";
import { createChatbotStream } from "@/services/api/chatbot";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatbotRequestPayload;
    const prompt = String(body.message ?? "").trim();

    if (!prompt) {
      return new Response("Please provide a message.", { status: 400 });
    }

    const stream = await createChatbotStream(prompt, body.history);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
