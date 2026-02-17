import React from "react";

export default function feedbackHeader() {
  return (
    <div className="text-center mb-12">
      <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-200">
        Awani Hotel
      </p>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-400 mt-2">
        How was your stay?
      </h1>
      <p className="text-sm text-gray-500 mt-3">
        Your feedback helps us refine our guest experience.
      </p>
    </div>
  );
}
