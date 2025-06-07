/* eslint-disable @typescript-eslint/no-explicit-any */
import "highlight.js/styles/github.css";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";

function extractTextFromChildren(children: any): any {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (
    React.isValidElement(children) &&
    children.props &&
    (children.props as any).children
  ) {
    return extractTextFromChildren((children.props as any).children);
  }
  return "";
}

export default function MessageResponse({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ className, children, ...props }) {
          const isBlockCode = className !== undefined;
          const codeString = extractTextFromChildren(children);

          return (
            <div
              className={`relative ${isBlockCode ? "block" : "inline-block"}`}
            >
              {isBlockCode && (
                <Button
                  onClick={() => handleCopy(codeString)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-accent"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
              <pre className={!isBlockCode ? "inline-block" : ""}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
