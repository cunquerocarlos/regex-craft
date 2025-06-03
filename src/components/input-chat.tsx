import { cn } from "@/lib/utils";
import { ArrowUp, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface InputChatProps {
  onSend: (message: string) => void;
  onClear?: () => void;
  fixed?: boolean;
  isLoading?: boolean;
}

export default function InputChat({
  onSend,
  onClear,
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
        "w-full flex flex-col  gap-2 bg-white rounded-xl shadow-lg p-2 border ",
        "border-border focus-within:ring-4 focus-within:ring-[#d1d2cd] focus-within:border-[#d1d2cd]",
        fixed && "fixed bottom-4 max-w-2xl "
      )}
    >
      <div>
        <Textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask anything"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="shadow-none min-h-10 focus-visible:ring-0 border-none focus-visible:none w-full focus:ring-0 focus:border-none focus:outline-none"
        />
      </div>

      <div className="flex">
        {onClear && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 rounded-full px-4 py-1 shadow-none hover:bg-gray-100 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear chat
          </Button>
        )}

        <Button
          className="ml-auto"
          type="submit"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
        </Button>
      </div>
    </form>
  );
}
