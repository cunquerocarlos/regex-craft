import { cn } from "@/lib/utils";

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
          "max-w-[75%] px-5 py-3 rounded-2xl text-base",
          isUser
            ? "bg-[#e6e4e0] text-black rounded-xl"
            : "text-black rounded-bl-md"
        )}
        style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
      >
        {content}
      </div>
    </div>
  );
}
