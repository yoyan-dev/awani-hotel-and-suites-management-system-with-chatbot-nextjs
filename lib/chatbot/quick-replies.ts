import { ChatbotQuickReplyEntry } from "@/types/chatbot";

export const CHATBOT_QUICK_REPLIES: ChatbotQuickReplyEntry[] = [
  {
    id: "greeting",
    category: "greetings",
    question: "Hello",
    answer:
      "Hello! Welcome to Awani Hotel & Suites. I can help with room information, reservations, amenities, contact details, and location.",
    exactMatches: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ],
    includesMatches: ["hello", "hi", "hey", "good morning", "good afternoon"],
  },
  {
    id: "room-types",
    category: "room-types",
    question: "What are your room types?",
    answer:
      "We offer hotel room options through our hotel rooms reservation page. If you want the best fit, share your check-in date, check-out date, and number of guests and I can guide you from there.",
    exactMatches: ["what are your room types", "room types"],
    includesMatches: [
      "what are your room types",
      "room types",
      "types of rooms",
      "what rooms do you have",
    ],
    keywordGroups: [["room", "types"]],
    showInQuickQuestions: true,
  },
  {
    id: "booking-reservation",
    category: "booking",
    question: "How do I make a reservation?",
    answer:
      "You can make a reservation from the Hotel Rooms page. Select your stay dates, choose the number of guests and room type, complete your guest details, upload and verify both front and back ID images, review the summary, and submit. Our front desk will contact you shortly for confirmation.",
    exactMatches: [
      "how do i make a reservation",
      "how can i make a reservation",
      "how do i book",
    ],
    includesMatches: [
      "make a reservation",
      "how do i book",
      "how can i book",
      "book a room",
      "room reservation",
    ],
    keywordGroups: [
      ["make", "reservation"],
      ["book", "room"],
    ],
    showInQuickQuestions: true,
  },
  {
    id: "check-in-times",
    category: "hours",
    question: "What are the check-in times?",
    answer:
      "Check-in and check-out hours are not defined in the current guest-facing system content. For the official schedule, please contact Front Office at +63 917 302 4794 or awanihotel2019@yahoo.com.",
    exactMatches: [
      "what are the check in times",
      "what are the check-in times",
      "check in time",
      "check-in time",
    ],
    includesMatches: [
      "check in time",
      "check-in time",
      "check out time",
      "check-out time",
      "check in times",
      "check-in times",
    ],
    showInQuickQuestions: true,
  },
  {
    id: "function-halls",
    category: "available-services",
    question: "Do you have function halls?",
    answer:
      "Yes. Awani accepts function room reservation requests. You can submit a request through the Function Room Reservation page, and our events team will review it and contact you for confirmation.",
    exactMatches: [
      "do you have function halls",
      "function hall",
      "function halls",
      "function room",
      "function rooms",
    ],
    includesMatches: [
      "do you have function halls",
      "function hall",
      "function room",
      "event reservation",
    ],
    keywordGroups: [
      ["function", "hall"],
      ["function", "room"],
    ],
    showInQuickQuestions: true,
  },
  {
    id: "amenities",
    category: "available-services",
    question: "What amenities are included?",
    answer:
      "Featured amenities currently highlighted by Awani include concierge assistance, high-speed Wi-Fi, fitness and wellness access, and secure parking. Specific in-room amenities can vary by room type.",
    exactMatches: [
      "what amenities are included",
      "amenities",
      "hotel amenities",
    ],
    includesMatches: [
      "what amenities are included",
      "amenities",
      "included amenities",
      "hotel amenities",
    ],
    keywordGroups: [
      ["hotel", "amenities"],
      ["included", "amenities"],
    ],
    showInQuickQuestions: true,
  },
  {
    id: "contact-information",
    category: "contact-information",
    question: "How can I contact Front Office?",
    answer:
      "You can reach Awani Hotel & Suites through Front Office at +63 917 302 4794 or by email at awanihotel2019@yahoo.com.",
    exactMatches: [
      "how can i contact front office",
      "contact information",
      "contact details",
      "front office contact",
    ],
    includesMatches: [
      "contact front office",
      "contact information",
      "contact details",
      "phone number",
      "email address",
    ],
    keywordGroups: [
      ["front", "office"],
      ["phone", "number"],
      ["email", "address"],
    ],
    showInQuickQuestions: true,
  },
  {
    id: "location",
    category: "location",
    question: "Where is the hotel located?",
    answer:
      "Awani Hotel & Suites is located at Corner-East Euzkara Avenue, San Carlos City, Philippines 6127.",
    exactMatches: [
      "where is the hotel located",
      "where are you located",
      "hotel location",
      "location",
    ],
    includesMatches: [
      "where is the hotel located",
      "where are you located",
      "hotel location",
      "hotel address",
      "location",
      "address",
    ],
    keywordGroups: [
      ["where", "located"],
      ["hotel", "address"],
    ],
    showInQuickQuestions: true,
  },
  {
    id: "room-availability",
    category: "fallback-faq",
    question: "Room availability?",
    answer:
      "I can help with live room availability. Please send your check-in date, check-out date, and number of guests in YYYY-MM-DD format so I can check the current room options.",
    exactMatches: ["room availability", "room availability?"],
    includesMatches: ["room availability"],
    showInQuickQuestions: true,
  },
  {
    id: "booking-requirements",
    category: "appointment-requirements",
    question: "What are the booking requirements?",
    answer:
      "To complete a hotel room reservation, the form currently requires your full name, contact number, home address, nationality, gender, email, stay dates, selected room type, guest count, and verified front and back ID images.",
    exactMatches: [
      "what are the booking requirements",
      "booking requirements",
      "reservation requirements",
    ],
    includesMatches: [
      "booking requirements",
      "reservation requirements",
      "what do i need to book",
      "what do i need for reservation",
    ],
    keywordGroups: [
      ["booking", "requirements"],
      ["reservation", "requirements"],
    ],
  },
  {
    id: "available-services",
    category: "available-services",
    question: "What services do you offer?",
    answer:
      "Awani currently supports hotel room stays, function room reservations, concierge assistance, high-speed Wi-Fi, fitness and wellness access, and secure parking.",
    exactMatches: [
      "what services do you offer",
      "available services",
      "services",
    ],
    includesMatches: [
      "what services do you offer",
      "available services",
      "services offered",
    ],
    keywordGroups: [
      ["available", "services"],
      ["services", "offer"],
    ],
  },
  {
    id: "payment-methods",
    category: "payment-methods",
    question: "What payment methods do you accept?",
    answer:
      "Payment methods are not listed in the current guest-facing system content. For the official payment options, please contact Front Office at +63 917 302 4794.",
    exactMatches: [
      "what payment methods do you accept",
      "payment methods",
      "how can i pay",
    ],
    includesMatches: [
      "payment methods",
      "accepted payments",
      "how can i pay",
      "payment options",
    ],
    keywordGroups: [
      ["payment", "methods"],
      ["payment", "options"],
    ],
  },
  {
    id: "faq-fallback",
    category: "fallback-faq",
    question: "What can you help me with?",
    answer:
      "I can help with rooms, reservations, amenities, function rooms, contact details, and location. If you need live room availability or something more specific, send the details and I will check it for you.",
    exactMatches: [
      "what can you help me with",
      "help",
      "faq",
      "questions",
    ],
    includesMatches: [
      "what can you help me with",
      "what can you do",
      "help me",
      "faq",
    ],
    keywordGroups: [["help"]],
  },
];

export const CHATBOT_QUICK_QUESTION_LABELS = CHATBOT_QUICK_REPLIES.filter(
  (entry) => entry.showInQuickQuestions,
).map((entry) => entry.question);
