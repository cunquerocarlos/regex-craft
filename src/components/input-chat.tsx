import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface InputChatProps {
  onSend: (message: string) => void;
  fixed?: boolean;
  isLoading?: boolean;
}

export default function InputChat({
  onSend,
  fixed = false,
  isLoading = false,
}: InputChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const sendMessage = () => {
    if (textareaRef.current && textareaRef.current.value.trim()) {
      onSend(textareaRef.current.value.trim());
      textareaRef.current.value = "";
      setMessage("");
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full flex items-end gap-2 bg-white rounded-xl shadow-lg p-2 border ",
        "border-border focus-within:ring-4 focus-within:ring-[#d1d2cd] focus-within:border-[#d1d2cd]",
        fixed && "fixed bottom-4 max-w-2xl "
      )}
    >
      <Textarea
        ref={textareaRef}
        rows={1}
        placeholder="Ask anything"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className="shadow-none focus-visible:ring-0 border-none focus-visible:none w-full focus:ring-0 focus:border-none focus:outline-none"
      />
      <Button type="submit" disabled={!message.trim() || isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
      </Button>
    </form>
  );
}
