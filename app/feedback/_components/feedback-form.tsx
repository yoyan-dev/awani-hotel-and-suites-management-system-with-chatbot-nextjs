"use client";
import React from "react";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  RadioGroup,
  Radio,
  Divider,
} from "@heroui/react";
import clsx from "clsx";
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
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-100 rounded-lg shadow-sm">
      <CardBody className="p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Guest Info */}
          <section className="space-y-4">
            <Input
              name="full_name"
              label="Full Name"
              variant="bordered"
              isRequired
            />
            <Input
              name="email"
              type="email"
              label="Email Address"
              variant="bordered"
              isRequired
            />
          </section>

          <Divider className="bg-gray-100" />

          {/* Stay Details */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="room_number"
                label="Room Number"
                variant="bordered"
                isRequired
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="check_in"
                type="date"
                label="Check-in"
                variant="bordered"
                isRequired
              />
              <Input
                name="check_out"
                type="date"
                label="Check-out"
                variant="bordered"
                isRequired
              />
            </div>
          </section>

          <Divider className="bg-gray-100" />

          {/* Rating */}
          <section className="space-y-6">
            <div className="text-sm font-medium text-gray-700">
              Overall Rating
            </div>
            <div className="flex justify-between gap-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = hovered
                  ? star <= hovered
                  : star <= Number(rating || 0);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setRating(star as RatingScale)}
                    className={clsx(
                      "flex-1 rounded-md text-2xl transition-all duration-150",
                      active
                        ? "text-amber-500 scale-105"
                        : "text-gray-300 hover:text-amber-400",
                    )}
                    aria-label={`Rate ${star} star`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
            {rating && (
              <p className="text-sm text-gray-600">{ratingMessages[rating]}</p>
            )}
          </section>

          {/* Comments */}
          <Textarea
            name="comments"
            label="Additional Comments"
            minRows={4}
            variant="bordered"
          />

          {/* Recommend */}
          <RadioGroup
            label="Would you recommend Awani Hotel?"
            orientation="horizontal"
            value={recommend}
            onValueChange={(value) =>
              setRecommend(value as RecommendationValue)
            }
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </RadioGroup>

          <Button
            isLoading={isLoading}
            type="submit"
            color="primary"
            className="w-full font-medium"
            isDisabled={!rating || !recommend}
          >
            Submit Feedback
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
