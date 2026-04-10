import { CHATBOT_QUICK_REPLIES } from "@/lib/chatbot/quick-replies";
import {
  normalizeChatbotMessage,
  splitNormalizedChatbotMessage,
} from "@/lib/chatbot/normalize-message";
import {
  ChatbotQuickReplyEntry,
  ChatbotQuickReplyMatch,
} from "@/types/chatbot";

function normalizeCandidates(candidates: string[] | undefined): string[] {
  return (candidates ?? [])
    .map((candidate) => normalizeChatbotMessage(candidate))
    .filter(Boolean);
}

function containsTerm(message: string, tokens: Set<string>, term: string): boolean {
  if (term.includes(" ")) {
    return message.includes(term);
  }

  return tokens.has(term);
}

function matchesExactly(
  entry: ChatbotQuickReplyEntry,
  normalizedMessage: string,
): boolean {
  const exactCandidates = normalizeCandidates([
    entry.question,
    ...(entry.exactMatches ?? []),
  ]);

  return exactCandidates.some((candidate) => candidate === normalizedMessage);
}

function matchesLoosely(
  entry: ChatbotQuickReplyEntry,
  normalizedMessage: string,
  tokens: Set<string>,
  wordCount: number,
): boolean {
  const includeCandidates = normalizeCandidates(entry.includesMatches);

  return includeCandidates.some((candidate) => {
    if (!containsTerm(normalizedMessage, tokens, candidate)) {
      return false;
    }

    const candidateWordCount = splitNormalizedChatbotMessage(candidate).length;
    return wordCount <= candidateWordCount + 3;
  });
}

function matchesKeywordGroup(
  entry: ChatbotQuickReplyEntry,
  normalizedMessage: string,
  tokens: Set<string>,
): boolean {
  const groups = (entry.keywordGroups ?? []).map((group) =>
    group.map((keyword) => normalizeChatbotMessage(keyword)).filter(Boolean),
  );

  return groups.some((group) =>
    group.every((keyword) => containsTerm(normalizedMessage, tokens, keyword)),
  );
}

function hasDynamicRequestDetails(message: string): boolean {
  return (
    /\b\d{4}-\d{2}-\d{2}\b/.test(message) ||
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(message) ||
    /\bfor\s+\d+\s+(guest|guests|people|persons|pax)\b/i.test(message) ||
    (/\b(check\s*-?\s*in|check\s*-?\s*out|guest|guests|people|persons|pax|night|nights)\b/i.test(
      message,
    ) && /\b\d+\b/.test(message))
  );
}

export function findChatbotQuickReply(
  message: string,
): ChatbotQuickReplyMatch | null {
  const normalizedMessage = normalizeChatbotMessage(message);

  if (!normalizedMessage) {
    return null;
  }

  const words = splitNormalizedChatbotMessage(normalizedMessage);
  const tokens = new Set(words);

  for (const entry of CHATBOT_QUICK_REPLIES) {
    if (matchesExactly(entry, normalizedMessage)) {
      return {
        entry,
        strategy: "exact",
        normalizedMessage,
      };
    }
  }

  if (hasDynamicRequestDetails(message)) {
    return null;
  }

  for (const entry of CHATBOT_QUICK_REPLIES) {
    if (matchesLoosely(entry, normalizedMessage, tokens, words.length)) {
      return {
        entry,
        strategy: "includes",
        normalizedMessage,
      };
    }
  }

  if (words.length > 8) {
    return null;
  }

  for (const entry of CHATBOT_QUICK_REPLIES) {
    if (matchesKeywordGroup(entry, normalizedMessage, tokens)) {
      return {
        entry,
        strategy: "keyword",
        normalizedMessage,
      };
    }
  }

  return null;
}
