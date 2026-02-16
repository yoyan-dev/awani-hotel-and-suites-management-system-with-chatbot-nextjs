"use client";
import React, { useState } from "react";
import FeedbackHeader from "./_components/feedback-header";
import FeedbackForm from "./_components/feedback-form";
import SuccessScreen from "./_components/success-screen";
import { RatingScale, RecommendationValue } from "@/types/feedback";
import { useGuestFeedback } from "@/hooks/use-feedback";

export default function FeedbackPage() {
  const { isLoading, error, addGuestFeedback } = useGuestFeedback();
  const [rating, setRating] = useState<RatingScale | "">("");
  const [hovered, setHovered] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<RecommendationValue | "">("");
  const [submitted, setSubmitted] = useState(false);

  const ratingMessages: Record<RatingScale, string> = {
    1: "We're truly sorry your experience wasn’t ideal.",
    2: "Thank you — we’ll work on improving.",
    3: "Glad your stay was good.",
    4: "Wonderful! We're happy you enjoyed it.",
    5: "Amazing! We’re thrilled you loved your stay.",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rating || !recommend) return;

    const formData = new FormData(e.currentTarget);
    formData.append("rating", rating.toString());
    formData.append("recommend", recommend);
    console.log({
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      room_number: formData.get("room_number"),
      check_in: formData.get("check_in"),
      check_out: formData.get("check_out"),
      comments: formData.get("comments"),
      rating,
      recommend,
      created_at: new Date().toISOString(),
    });

    await addGuestFeedback(formData);
    setSubmitted(true);
  }

  if (submitted) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <FeedbackHeader />
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
  );
}
