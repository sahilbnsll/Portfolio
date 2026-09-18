"use client";

import { cn } from "@/lib/utils";
import { Message } from "ai";
import { Bot } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import { memo, useState, useEffect, useMemo } from "react";
import ChatActionCard, { type ActionDirective } from "./ChatActionCard";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ACTION_REGEX = /<<<ACTION:([\s\S]*?)>>>/g;

function parseActionsAndCleanText(raw: string): {
  cleanText: string;
  actions: ActionDirective[];
} {
  const actions: ActionDirective[] = [];
  const cleanText = raw
    .replace(ACTION_REGEX, (_, jsonStr) => {
      try {
        const parsed = JSON.parse(jsonStr.trim());
        if (parsed && typeof parsed === "object") {
          actions.push(parsed as ActionDirective);
        }
      } catch (e) {
        console.warn("[AI Action Parser] Failed to parse directive:", jsonStr, e);
      }
      return "";
    })
    // Strip trailing incomplete action tag while streaming
    .replace(/<<<ACTION:[\s\S]*$/, "")
    // Strip empty code fences that may surround action tags
    .replace(/```(?:json)?\s*```/g, "")
    .trim();

  return { cleanText, actions };
}

export default memo(function ChatMessage({
  message: { role, content, id },
  isLatest = false,
}: ChatMessageProps) {
  const isBot = role === "assistant";
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const { cleanText, actions } = useMemo(
    () => parseActionsAndCleanText(content),
    [content]
  );

  useEffect(() => {
    if (!isBot) {
      setDisplayedContent(cleanText);
      setIsComplete(true);
      return;
    }

    // Reset state for new message
    setDisplayedContent("");
    setIsComplete(false);
    let index = 0;
    const speed = 12; // Fast typing speed

    const interval = setInterval(() => {
      if (index < cleanText.length) {
        setDisplayedContent(cleanText.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [id, isBot, cleanText]);

  const hasActions = actions.length > 0;

  return (
    <div
      className={cn(
        "mb-3 flex items-start sm:mb-4 animate-fade-in-up",
        isBot ? "justify-start" : "justify-end",
        !isBot && "animate-pop-in"
      )}
    >
      {isBot && <Bot className="mr-2 mt-0.5 size-4 text-primary shrink-0 sm:mr-2.5 sm:size-5" />}
      <div
        className={cn(
          "min-w-0 break-words rounded-xl border px-3.5 py-2.5 text-sm shadow-sm sm:px-4 sm:py-3 sm:text-base transition-all",
          isBot
            ? "bg-secondary/90 text-secondary-foreground border-border/60"
            : "bg-primary text-primary-foreground border-primary",
          hasActions ? "max-w-[280px] sm:max-w-80" : "max-w-[240px] sm:max-w-72"
        )}
      >
        <Markdown
          components={{
            a: ({ node, href, ...props }) => (
              <Link
                href={href ?? ""}
                className="break-words font-semibold underline underline-offset-2 hover:text-primary"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="mt-2.5 first:mt-0 leading-relaxed" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="mt-2.5 list-inside list-disc first:mt-0 space-y-1 text-sm"
                {...props}
              />
            ),
          }}
        >
          {displayedContent}
        </Markdown>

        {!isComplete && isBot && (
          <span className="animate-pulse inline-block ml-0.5 text-primary">▚</span>
        )}

        {isBot && hasActions && (
          <ChatActionCard actions={actions} isLatest={isLatest} />
        )}
      </div>
    </div>
  );
});
