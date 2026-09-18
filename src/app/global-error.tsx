"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-4 text-center font-sans bg-background text-foreground">
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-4">
          A critical application error occurred.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-sm rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
