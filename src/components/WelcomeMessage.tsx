"use client";

import { Bot } from "lucide-react";

export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in-up">
      <Bot className="w-12 h-12 mb-4 text-black dark:text-white" />
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Welcome to my Portfolio!</h2>
      <p className="text-muted-foreground">
        I&apos;m a chatbot here to help you. You can ask me about my skills, projects, or anything else you&apos;d like to know.
      </p>
    </div>
  );
}
