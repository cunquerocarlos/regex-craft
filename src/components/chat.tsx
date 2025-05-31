"use client";

import InputChat from "@/components/input-chat";
import Message from "@/components/message";
import { useState } from "react";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export default function Chat() {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setIsConversationStarted(true);

    // TODO: Add AI response here
    // For now, we'll just echo back a simple response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { content: "This is a sample response", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f0eeed]">
      <div className="max-w-2xl min-h-screen mx-auto">
        {isConversationStarted ? (
          <div className="min-h-screen p-4 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  content={message.content}
                  isUser={message.isUser}
                />
              ))}
            </div>
            <InputChat onSend={handleSendMessage} />
          </div>
        ) : (
          <div className="min-h-screen p-4 w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-center text-black/80">
              What can I help with?
            </h1>
            <InputChat onSend={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
