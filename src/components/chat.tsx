"use client";

import InputChat from "@/components/input-chat";
import Message from "@/components/message";
import { useCanvasStore } from "@/store/canvas";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export default function Chat() {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { content: canvasContent, clearContent: clearCanvasContent } =
    useCanvasStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setIsConversationStarted(true);
    setIsLoading(true);
    clearCanvasContent(); // Clear canvas content when new message is sent

    try {
      // Add an empty AI message that we'll update as we receive chunks
      setMessages((prev) => [...prev, { content: "", isUser: false }]);

      // Get the last 8 messages from the conversation
      const lastMessages = messages.slice(-8);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history: lastMessages,
        }),
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

  const handleClearChat = () => {
    setMessages([]);
    setIsConversationStarted(false);
    clearCanvasContent();
  };

  return (
    <div className="min-h-screen bg-[#f0eeed]">
      <div
        className={`${
          canvasContent ? "max-w-full" : "max-w-2xl"
        } min-h-screen mx-auto`}
      >
        {isConversationStarted ? (
          <div className="min-h-screen p-4 flex flex-col justify-between">
            <div
              className={`flex-1 overflow-y-auto space-y-4 mb-[100px] ${
                canvasContent ? "w-1/2" : "w-full"
              }`}
            >
              {messages.map((message, index) => (
                <Message
                  key={index}
                  content={message.content}
                  isUser={message.isUser}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            {canvasContent && (
              <div className="fixed right-0 top-0 w-1/2 h-screen bg-white p-4 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{canvasContent}</pre>
              </div>
            )}
            <InputChat
              fixed
              onSend={handleSendMessage}
              isLoading={isLoading}
              onClear={handleClearChat}
            />
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
