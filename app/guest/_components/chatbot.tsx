"use client";

import { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Avatar,
  ScrollShadow,
  Chip,
} from "@heroui/react";
import { MessageCircle, Send, X, HelpCircle } from "lucide-react";

const CHATBOT_MEMORY_ITEMS = 20;

type ChatMessage = {
  from: "user" | "bot";
  text: string;
};

const QUICK_QUESTIONS = [
  "What are your room types?",
  "How do I make a reservation?",
  "What are the checked_in times?",
  "Do you have function halls?",
  "What amenities are included?",
  "How can I contact Front Office?",
  "Where is the hotel located?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hello! Welcome to Awani Hotel. I'm here to help you with information about our rooms, bookings, amenities, and more. What can I assist you with today?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async (msg: string = message) => {
    if (!msg.trim()) return;

    setIsLoading(true);
    const history = chat.slice(-CHATBOT_MEMORY_ITEMS);
    const userMessage: ChatMessage = { from: "user", text: msg };
    const newChat: ChatMessage[] = [...chat, userMessage];
    setChat(newChat);
    setMessage("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        body: JSON.stringify({ message: msg, history }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botReply += new TextDecoder().decode(value);
        const botMessage: ChatMessage = { from: "bot", text: botReply };
        setChat([...newChat, botMessage]);
      }
    } catch (error) {
      const fallbackMessage: ChatMessage = {
        from: "bot",
        text: "I'm sorry, I'm having trouble connecting right now. Please contact Front Office directly for assistance.",
      };
      setChat([
        ...newChat,
        fallbackMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        isIconOnly
        color="primary"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 w-14 h-14"
        onPress={() => setIsOpen(true)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom"
        size="md"
        scrollBehavior="outside"
        hideCloseButton
        motionProps={{
          variants: {
            enter: { y: 0, opacity: 1 },
            exit: { y: 50, opacity: 0 },
          },
        }}
      >
        <ModalContent className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md">
          <ModalHeader className="flex items-center justify-between gap-2 bg-primary text-white py-3 px-4">
            <div className="flex items-center gap-2">
              <Avatar
                name="Awani"
                src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                size="sm"
              />
              <div>
                <h3 className="font-medium text-base">Awani Assistant</h3>
                <p className="text-xs text-white/80">
                  Hotel & Booking Help · Remembers last {CHATBOT_MEMORY_ITEMS} messages
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              size="sm"
              onPress={() => setIsOpen(false)}
              className="text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </ModalHeader>

          <ModalBody className="p-0">
            {/* Chat Area */}
            <ScrollShadow
              ref={scrollRef}
              className="h-96 p-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-900"
            >
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <Avatar
                      name="Awani"
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                      size="sm"
                      className="mr-2 mt-1 w-8 h-8 min-w-8"
                    />
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap break-words leading-relaxed ${
                      msg.from === "user"
                        ? "bg-primary text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Avatar
                    name="Awani"
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
                    size="sm"
                    className="mr-2 mt-1 w-8 h-8 min-w-8"
                  />
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </ScrollShadow>

            {/* Quick Questions */}
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Quick Questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((question, index) => (
                  <Chip
                    key={index}
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
              <Input
                placeholder="Type your message..."
                variant="bordered"
                size="sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !isLoading && handleSend()
                }
                disabled={isLoading}
              />
              <Button
                isIconOnly
                color="primary"
                variant="flat"
                size="sm"
                onPress={() => handleSend(message)}
                isDisabled={isLoading || !message.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
