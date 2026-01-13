"use client";

import { useChatbot } from "@/contexts/ChatContext";
import { Bot, BotOff } from "lucide-react";
import { Button } from "./ui/Button";
import { useSound } from "@/hooks/useSound";

export default function ChatToggle() {
  const { isVisible, toggleChatbot } = useChatbot();
  const playClick = useSound("/sounds/click.mp3", 0.25);

  const handleClick = () => {
    playClick();
    toggleChatbot();
  };

  return (
    <Button size="icon" variant="ghost" onClick={handleClick}>
      {isVisible ? <Bot className="size-5" /> : <BotOff className="size-5" />}
      <span className="sr-only">Chat Toggle</span>
    </Button>
  );
}
