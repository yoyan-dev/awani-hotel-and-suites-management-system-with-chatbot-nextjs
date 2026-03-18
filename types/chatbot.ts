export type ChatHistoryItem = {
  from: "user" | "bot";
  text: string;
};

export type ChatbotRequestPayload = {
  message?: string;
  history?: unknown;
};
