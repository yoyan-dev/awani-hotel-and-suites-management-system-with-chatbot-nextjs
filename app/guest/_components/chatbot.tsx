"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Avatar,
  ScrollShadow,
} from "@heroui/react";
import { MessageCircle, Send } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hello 👋! How can I assist you today?" },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { from: "user", text: message }];
    setChat(newChat);
    setMessage("");

    const res = await fetch("/api/chatbot", {
      method: "POST",
      body: JSON.stringify({ message: message }),
    });

    const reader = res.body!.getReader();
    let botReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      botReply += new TextDecoder().decode(value);
      setChat([...newChat, { from: "bot", text: botReply }]);
    }
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
        size="sm"
        hideCloseButton
        motionProps={{
          variants: {
            enter: { y: 0, opacity: 1 },
            exit: { y: 50, opacity: 0 },
          },
        }}
      >
        <ModalContent className="rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <ModalHeader className="flex items-center gap-2 bg-primary text-white py-3 px-4">
            <Avatar
              name="Chatbot"
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              size="sm"
            />
            <h3 className="font-medium text-base">Hotel Assistant</h3>
          </ModalHeader>

          <ModalBody className="p-0">
            {/* Chat Area */}
            <ScrollShadow className="h-80 p-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-900">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm ${
                      msg.from === "user"
                        ? "bg-primary text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </ScrollShadow>

            {/* Input Area */}
            <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
              <Input
                placeholder="Type your message..."
                variant="bordered"
                size="sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                isIconOnly
                color="primary"
                variant="flat"
                size="sm"
                onPress={handleSend}
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
