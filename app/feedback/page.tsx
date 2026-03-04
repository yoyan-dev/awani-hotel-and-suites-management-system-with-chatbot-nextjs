"use client";

import React, { useState } from "react";

import FeedbackForm from "./_components/feedback-form";
import FeedbackHeader from "./_components/feedback-header";
import SuccessScreen from "./_components/success-screen";
import { useGuestFeedback } from "@/hooks/use-feedback";
import { RatingScale, RecommendationValue } from "@/types/feedback";

export default function FeedbackPage() {
  const { isLoading, error, addGuestFeedback } = useGuestFeedback();
  const [rating, setRating] = useState<RatingScale | "">("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<RecommendationValue | "">("");
  const [submitted, setSubmitted] = useState(false);

  const ratingMessages: Record<RatingScale, string> = {
    1: "We are sorry your experience was not ideal.",
    2: "Thank you for sharing this. We will improve.",
    3: "Glad your stay was good overall.",
    4: "Wonderful. We are happy you enjoyed your visit.",
    5: "Amazing. We are thrilled you loved your stay.",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rating || !recommend) return;

    const formData = new FormData(e.currentTarget);
    formData.append("rating", rating.toString());
    formData.append("recommend", recommend);

    await addGuestFeedback(formData);
    setSubmitted(true);
  }

  if (submitted) return <SuccessScreen />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4eee3] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(176,138,83,0.22),transparent_38%),radial-gradient(circle_at_90%_85%,rgba(112,85,47,0.14),transparent_36%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <FeedbackHeader />
        <div className="space-y-4">
          {error ? (
            <div className="rounded-2xl border border-[#dfc8b0] bg-[#fff7ef] px-4 py-3 text-sm text-[#7b4a2a]">
              {error}
            </div>
          ) : null}
          <FeedbackForm
            rating={rating}
            hovered={hovered}
            setHovered={setHovered}
            setRating={setRating}
            recommend={recommend}
            setRecommend={setRecommend}
            handleSubmit={handleSubmit}
            ratingMessages={ratingMessages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
