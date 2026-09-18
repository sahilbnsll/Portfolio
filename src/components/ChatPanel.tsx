"use client";

import { useChat } from "ai/react";
import { useCallback, useEffect, useRef, type ChangeEvent } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

type ChatPanelProps = {
  isExpanded: boolean;
};

export default function ChatPanel({ isExpanded }: ChatPanelProps) {
  const chatIdRef = useRef<string | null>(null);

  const chatFetch = useCallback<typeof fetch>(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const baseInit: RequestInit = init || {};
      const headers = new Headers(baseInit.headers);
      const originalBody = baseInit.body;
      let bodyToSend = originalBody;

      const addSessionToPayload = (chatId: string | null) => {
        if (!chatId) return;
        headers.set("X-Chat-Id", chatId);

        if (typeof bodyToSend === "string") {
          try {
            const parsedBody = JSON.parse(bodyToSend);
            parsedBody.chat_id = chatId;
            bodyToSend = JSON.stringify(parsedBody);
          } catch (error) {
            console.error("[chat] failed to attach chat_id", error);
          }
        }
      };

      addSessionToPayload(chatIdRef.current);

      const performFetch = async (
        headersOverride: HeadersInit,
        bodyOverride: BodyInit | null | undefined,
      ) =>
        fetch(input, {
          ...baseInit,
          headers: headersOverride,
          body: bodyOverride,
        });

      const captureSessionId = (res: Response) => {
        const newChatId = res.headers.get("X-Chat-Id");
        if (newChatId) {
          chatIdRef.current = newChatId;
        }
      };

      let response = await performFetch(headers, bodyToSend);

      if (response.status === 400) {
        const errorText = await response
          .clone()
          .text()
          .catch(() => "");

        if (errorText.includes("Invalid X-Chat-Id")) {
          chatIdRef.current = null;

          const retryHeaders = new Headers(baseInit.headers);
          retryHeaders.delete("X-Chat-Id");
          retryHeaders.delete("x-chat-id");
          let retryBody = originalBody;

          if (typeof originalBody === "string") {
            try {
              const parsedRetryBody = JSON.parse(originalBody);
              delete parsedRetryBody.chat_id;
              retryBody = JSON.stringify(parsedRetryBody);
            } catch (error) {
              console.error("[chat] failed to strip chat_id", error);
            }
          }

          response = await performFetch(retryHeaders, retryBody);
          captureSessionId(response);
          return response;
        }
      }

      captureSessionId(response);
      return response;
    },
    [],
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
    append,
  } = useChat({ fetch: chatFetch });

  // Restore previous messages from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("portfolio_chat_messages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (err) {
      console.warn("[ChatPanel] Failed to restore messages from localStorage", err);
    }
  }, [setMessages]);

  // Sync active messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem("portfolio_chat_messages", JSON.stringify(messages.slice(-16)));
      } catch (err) {
        console.warn("[ChatPanel] Failed to save messages to localStorage", err);
      }
    }
  }, [messages]);

  const handleClearChat = () => {
    chatIdRef.current = null;
    try {
      localStorage.removeItem("portfolio_chat_messages");
    } catch (err) {
      console.warn("[ChatPanel] Failed to clear messages from localStorage", err);
    }
  };

  const handlePromptClick = (prompt: string) => {
    append({ role: "user", content: prompt });
  };

  return (
    <>
      <ChatMessages
        messages={messages}
        error={error}
        isLoading={isLoading}
        onPromptClick={handlePromptClick}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        setMessages={setMessages}
        onClearChat={handleClearChat}
        isLoading={isLoading}
        messages={messages}
      />
    </>
  );
}
