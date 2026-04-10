export function normalizeChatbotMessage(message: string): string {
  return message
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitNormalizedChatbotMessage(message: string): string[] {
  if (!message) {
    return [];
  }

  return message.split(" ").filter(Boolean);
}
