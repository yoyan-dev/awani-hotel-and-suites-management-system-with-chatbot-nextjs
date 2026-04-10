export type ChatHistoryItem = {
  from: "user" | "bot";
  text: string;
};

export type ChatbotRequestPayload = {
  message?: string;
  history?: unknown;
};

export type ChatbotQuickReplyMatchStrategy = "exact" | "includes" | "keyword";

export type ChatbotQuickReplyEntry = {
  id: string;
  category: string;
  question: string;
  answer: string;
  exactMatches?: string[];
  includesMatches?: string[];
  keywordGroups?: string[][];
  showInQuickQuestions?: boolean;
};

export type ChatbotQuickReplyMatch = {
  entry: ChatbotQuickReplyEntry;
  strategy: ChatbotQuickReplyMatchStrategy;
  normalizedMessage: string;
};
