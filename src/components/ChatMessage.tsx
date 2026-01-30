"use client";

import { cn } from "@/lib/utils";
import { Message } from "ai";
import { Bot } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { memo, useState, useEffect } from "react";

interface ChatMessageProps {
  message: Message;
}

export default memo(function ChatMessage({
  message: { role, content, id },
}: ChatMessageProps) {
  const isBot = role === "assistant";
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isBot) {
      setDisplayedContent(content);
      setIsComplete(true);
      return;
    }

    // Reset state for new message
    setDisplayedContent("");
    setIsComplete(false);
    let index = 0;
    const speed = 15; // Slightly slower for better readability

    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [id, isBot, content]);

  return (
    <div
      className={cn(
        "mb-3 flex items-start sm:mb-4",
        isBot ? "justify-start" : "justify-end",
      )}
    >
      {isBot && <Bot className="mr-2 mt-0.5 size-4 sm:mr-2.5 sm:size-5" />}
      <div
        className={cn(
          "min-w-0 max-w-[220px] break-words rounded-lg border px-3 py-2 text-sm shadow-sm sm:max-w-72 sm:px-4 sm:py-2.5 sm:text-base",
          isBot ? "bg-background" : "bg-foreground text-background",
        )}
      >
        <Markdown
          components={{
            a: ({ node, href, ...props }) => (
              <Link
                href={href ?? ""}
                className="break-words underline underline-offset-2"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="mt-3 first:mt-0" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="mt-3 list-inside list-disc first:mt-0"
                {...props}
              />
            ),
          }}
        >
          {displayedContent}
        </Markdown>
        {!isComplete && isBot && (
          <span className="animate-pulse inline-block ml-0.5">▚</span>
        )}
      </div>
    </div>
  );
});
