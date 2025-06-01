import { cn } from "@/lib/utils";
import MessageResponse from "./message-response";

interface MessageProps {
  content: string;
  isUser: boolean;
}

export default function Message({ content, isUser }: MessageProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          " px-5 py-3 rounded-2xl text-base overflow-x-auto",
          isUser
            ? "bg-[#e6e4e0] text-black rounded-xl max-w-[75%]"
            : "text-black rounded-bl-md"
        )}
        style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        <MessageResponse content={content} />
      </div>
    </div>
  );
}
