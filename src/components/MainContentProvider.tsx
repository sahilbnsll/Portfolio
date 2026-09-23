"use client";

import React from "react";

export default function MainContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="grow">
      {children}
    </main>
  );
}
