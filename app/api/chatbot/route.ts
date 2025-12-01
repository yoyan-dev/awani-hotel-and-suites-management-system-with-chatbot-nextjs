import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContentStream({
      contents: [
        { role: "user", parts: [{ text: message }] },
        {
          role: "model",
          parts: [
            {
              text: `You are a friendly and professional hotel assistant chatbot. 
                      You provide accurate and polite responses about:
                      - Hotel room types and suites, including amenities and rates
                      - How to make hotel reservations
                      - Banquet reservations and event inquiries
                      - Frequently asked questions (FAQs) about the hotel, services, and policies
                      Answer clearly and concisely. If you don't know the answer, politely suggest contacting the front desk or hotel staff.
                      Always maintain a friendly and professional tone.
                      `,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 350,
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
    return new Response(`Error: Unknown Error!`, { status: 500 });
  }
}
