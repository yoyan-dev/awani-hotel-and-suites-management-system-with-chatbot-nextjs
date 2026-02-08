import { BACK_KEYWORDS } from "./back-id-keywords";

export function analyzeBackText(text: string) {
  const upper = text.toUpperCase();
  const matched = BACK_KEYWORDS.filter((k) => upper.includes(k));

  return {
    matched,
    score: matched.length * 15,
  };
}
