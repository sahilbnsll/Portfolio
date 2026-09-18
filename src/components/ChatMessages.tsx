import { Message } from "ai";
import { Bot, Loader2 } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatPrompts from "./ChatPrompts";
import WelcomeMessage from "./WelcomeMessage";
import TypingIndicator from "./TypingIndicator";

interface ChatMessagesProps {
  messages: Message[];
  error: Error | undefined;
  isLoading: boolean;
  onPromptClick?: (prompt: string) => void;
}

export default memo(function ChatMessages({
  messages,
  error,
  isLoading,
  onPromptClick,
}: ChatMessagesProps) {
  const isLastMessageUser = messages[messages.length - 1]?.role === "user";

  // Scroll to new messages automatically with smooth behavior
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div
      className="h-full min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth p-2 sm:p-3"
      ref={scrollRef}
    >
      <ul>
        {messages.map((msg, idx) => (
          <li key={msg.id}>
            <ChatMessage message={msg} isLatest={idx === messages.length - 1} />
          </li>
        ))}
      </ul>

      {/* empty */}
      {!error && messages.length === 0 && (
        <div className="flex flex-col items-center pb-2">
          <WelcomeMessage />
          {onPromptClick && <ChatPrompts onPromptClick={onPromptClick} />}
        </div>
      )}

      {/* loading */}
      {isLoading && isLastMessageUser && <TypingIndicator />}

      {/* error */}
      {error && (
        <div className="px-3 py-2 text-center text-xs text-rose-500 bg-rose-500/10 rounded-md my-2 border border-rose-500/20">
          {error.message && !error.message.includes("<") && error.message.length < 120
            ? error.message
            : "The AI assistant encountered a temporary connection issue. Please try asking again!"}
        </div>
      )}
    </div>
  );
});
