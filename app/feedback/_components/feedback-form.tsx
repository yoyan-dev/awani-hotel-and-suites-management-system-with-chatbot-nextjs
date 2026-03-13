"use client";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from "@heroui/react";
import clsx from "clsx";
import { Star } from "lucide-react";

import { RatingScale, RecommendationValue } from "@/types/feedback";

interface FeedbackFormProps {
  rating: RatingScale | "";
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  setRating: React.Dispatch<React.SetStateAction<RatingScale | "">>;
  recommend: RecommendationValue | "";
  setRecommend: React.Dispatch<React.SetStateAction<RecommendationValue | "">>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  ratingMessages: Record<RatingScale, string>;
  isLoading: boolean;
}

const inputClassNames = {
  label: "text-[#6b6153] font-medium",
  input: "text-[#1f1e1b] placeholder:text-[#8a7f71]",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] group-data-[focus=true]:border-[#b08a53]",
};

export default function FeedbackForm({
  rating,
  hovered,
  setHovered,
  setRating,
  recommend,
  setRecommend,
  handleSubmit,
  ratingMessages,
  isLoading,
}: FeedbackFormProps) {
  return (
    <Card className="overflow-hidden rounded-4xl border border-[#e3d4c2] bg-[#fffdf9] shadow-[0_24px_60px_-40px_rgba(36,28,20,0.48)]">
      <CardBody className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-[#251f18]">Your Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="full_name"
                label="Full Name"
                variant="bordered"
                isRequired
                classNames={inputClassNames}
              />
              <Input
                name="email"
                type="email"
                label="Email Address"
                variant="bordered"
                isRequired
                classNames={inputClassNames}
              />
            </div>
          </section>

          <Divider className="bg-[#eadfce]" />

          <section className="space-y-4">
            <h3 className="font-serif text-xl text-[#251f18]">Stay Details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                name="room_number"
                label="Room Number"
                variant="bordered"
                isRequired
                classNames={inputClassNames}
              />
              <Input
                name="check_in"
                type="date"
                label="Check-in"
                variant="bordered"
                isRequired
                className="sm:col-span-1"
                classNames={inputClassNames}
              />
              <Input
                name="check_out"
                type="date"
                label="Check-out"
                variant="bordered"
                isRequired
                className="sm:col-span-1"
                classNames={inputClassNames}
              />
            </div>
          </section>

          <Divider className="bg-[#eadfce]" />

          <section className="space-y-5">
            <h3 className="font-serif text-xl text-[#251f18]">
              Overall Rating
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((value) => {
                const active = hovered
                  ? value <= hovered
                  : value <= Number(rating || 0);

                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHovered(value)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setRating(value as RatingScale)}
                    className={clsx(
                      "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 sm:h-12 sm:w-12",
                      active
                        ? "border-[#b08a53] bg-[#b08a53] text-white shadow-[0_12px_24px_-14px_rgba(98,68,30,0.75)]"
                        : "border-[#d9c6ab] bg-[#fff8ee] text-[#a08f78] hover:border-[#c9ad86] hover:text-[#8b6a3e]",
                    )}
                    aria-label={`Rate ${value} star`}
                  >
                    <Star
                      size={20}
                      className={clsx(active && "fill-current")}
                    />
                  </button>
                );
              })}
            </div>

            {rating ? (
              <p className="rounded-xl border border-[#e2d4bf] bg-[#fbf4e9] px-3 py-2 text-sm text-[#6e5535]">
                {ratingMessages[rating]}
              </p>
            ) : (
              <p className="text-sm text-[#867560]">
                Select a rating from 1 to 5.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <Textarea
              name="comments"
              label="Additional Comments"
              minRows={4}
              variant="bordered"
              classNames={inputClassNames}
              placeholder="Tell us anything that made your stay great or needs attention."
            />
          </section>

          <section className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7a6444]">
              Recommendation
            </p>
            <RadioGroup
              label="Would you recommend Awani Hotel?"
              orientation="horizontal"
              value={recommend}
              onValueChange={(value) =>
                setRecommend(value as RecommendationValue)
              }
              classNames={{ label: "text-[#2d251c] font-medium" }}
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </section>

          <Button
            isLoading={isLoading}
            type="submit"
            radius="full"
            className="h-12 w-full bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
            isDisabled={!rating || !recommend}
          >
            Submit Feedback
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
