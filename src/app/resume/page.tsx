import type { Metadata } from "next";
import InteractiveResume from "@/components/InteractiveResume";

export const metadata: Metadata = {
  title: "Interactive Resume | Sahil Bansal",
  description: "Filter-enabled interactive resume highlighting DevOps, cloud infrastructure, and automation experience.",
};

export default function ResumePage() {
  return (
    <div className="pb-16 pt-8">
      <header className="mb-8">
        <div className="mb-2 font-mono text-[11px] tracking-widest text-emerald-500">
          $ cat ~/resume.yaml | grep -i &quot;impact&quot;
        </div>
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">
          Interactive Resume
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Click a technology to highlight matching experience across all roles.
        </p>
      </header>

      <InteractiveResume />
    </div>
  );
}
