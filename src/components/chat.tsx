"use client";

import InputChat from "@/components/input-chat";
import Message from "@/components/message";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export default function Chat() {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    console.log(messages);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Add user message

    if (message.trim() === "") return;

    console.log(message);

    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setIsConversationStarted(true);
    setIsLoading(true);

    try {
      // Add an empty AI message that we'll update as we receive chunks
      setMessages((prev) => [...prev, { content: "", isUser: false }]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        // Update the last message with the accumulated content
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            content: accumulatedContent,
            isUser: false,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          content: "Sorry, I encountered an error. Please try again.",
          isUser: false,
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0eeed]">
      <div className=" max-w-2xl min-h-screen mx-auto">
        {isConversationStarted ? (
          <div className="min-h-screen p-4 flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 mb-[100px]">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  content={message.content}
                  isUser={message.isUser}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <InputChat fixed onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        ) : (
          <div className="min-h-screen p-4 w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-semibold mb-10 text-center text-black/80">
              What can I help with?
            </h1>
            <InputChat onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
