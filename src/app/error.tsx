"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error caught by boundary:", error);
  }, [error]);

  return (
    <article className="mt-8 flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-xl font-bold tracking-tight">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="black_white">
          Back to home
        </Button>
      </div>
    </article>
  );
}
