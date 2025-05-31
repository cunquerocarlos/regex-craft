import { ArrowUp } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface InputChatProps {
  onSend: (message: string) => void;
}

export default function InputChat({ onSend }: InputChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = () => {
    if (textareaRef.current && textareaRef.current.value.trim()) {
      onSend(textareaRef.current.value.trim());
      textareaRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-end gap-2 bg-white/80 rounded-xl shadow-lg p-2 border 
          border-border focus-within:ring-4 focus-within:ring-[#d1d2cd] focus-within:border-[#d1d2cd]"
    >
      <Textarea
        ref={textareaRef}
        rows={1}
        placeholder="Ask anything"
        onKeyDown={handleKeyDown}
        className="shadow-none focus-visible:ring-0 border-none focus-visible:none w-full focus:ring-0 focus:border-none focus:outline-none"
      />
      <Button type="submit">
        <ArrowUp />
      </Button>
    </form>
  );
}
