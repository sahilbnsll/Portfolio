import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatDelta({ delta }: { delta: number }) {
  if (delta === 0) return null;
  const isUp = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isUp ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
      }`}
    >
      {isUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {isUp ? "+" : ""}
      {delta}%
    </span>
  );
}
