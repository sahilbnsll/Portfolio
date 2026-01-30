"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function MainContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="grow" key={pathname}>
      {children}
    </main>
  );
}
