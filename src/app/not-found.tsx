import type { Metadata } from "next";
import { NotFoundPage } from "@/components/ui/404-page-not-found";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage />;
}
