"use client";
import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/contexts/ChatContext";
import ErrorBoundary from "./ErrorBoundary";
import Chat from "./Chat";
import ClientOnly from "./ClientOnly";
import { Toaster } from "sonner";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
      <ErrorBoundary>
        <ChatProvider>
          {children}
          <ClientOnly>
            <Chat />
          </ClientOnly>
        </ChatProvider>
      </ErrorBoundary>
      <Toaster className="mt-12" position="top-right" />
    </ThemeProvider>
  );
}
