"use client";

import { Bot } from "lucide-react";

export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in-up">
      <Bot className="w-12 h-12 mb-4 text-black dark:text-white" />
      <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Sahil&apos;s AI Twin</h2>
      <p className="text-muted-foreground max-w-sm">
        Ask about Sahil&apos;s experience, stack, projects (including ZabeSync), or how to get in touch—short answers, real details from his portfolio.
      </p>
    </div>
  );
}
