"use client";

import { useEffect, useState } from "react";

/**
 * Renders its children only on the client side after the component has mounted.
 * This is useful for components that cause hydration errors or interfere with
 * server-side rendering due to client-specific APIs or complex client-side effects.
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
