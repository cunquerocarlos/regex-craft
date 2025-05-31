"use client";

import InputChat from "@/components/input-chat";
import { useState } from "react";

export default function Chat() {
  const [isConversationStarted, setIsConversationStarted] = useState(false);

  const handleSendMessage = (message: string) => {
    console.log(message);
    setIsConversationStarted(true);
  };

  return (
    <div className="min-h-screen  bg-[#f0eeed]">
      <div className="max-w-2xl min-h-screen mx-auto ">
        {isConversationStarted ? (
          <div className="min-h-screen p-4 flex flex-col justify-between ">
            <div>chat history</div>
            <InputChat onSend={handleSendMessage} />
          </div>
        ) : (
          <div className="min-h-screen p-4 w-full flex flex-col items-center justify-center ">
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
