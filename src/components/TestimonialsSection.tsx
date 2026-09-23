"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";
import SectionHeader from "./SectionHeader";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

type Testimonial = {
  name: string;
  title: string;
  quote: string;
  avatar: string;
  rating: number;
  linkedInUrl?: string;
};

type StaggerItem = Testimonial & { tempId: number };

function TestimonialCard({
  position,
  testimonial,
  handleMove,
  cardSize,
}: {
  position: number;
  testimonial: StaggerItem;
  handleMove: (steps: number) => void;
  cardSize: number;
}) {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out sm:p-8",
        isCenter
          ? "z-10 border-primary bg-primary text-primary-foreground"
          : "z-0 border-border bg-card text-card-foreground hover:border-primary/50",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px hsl(var(--border))"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />

      <div className="mb-4 flex items-center justify-between">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full text-sm font-semibold ring-1",
            isCenter
              ? "bg-primary-foreground/15 text-primary-foreground ring-primary-foreground/30"
              : "bg-primary/10 text-primary ring-primary/20",
          )}
        >
          {testimonial.avatar}
        </div>
        {testimonial.linkedInUrl && (
          <a
            href={testimonial.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`View ${testimonial.name} on LinkedIn`}
            className={cn(
              "shrink-0 rounded-lg p-1.5 transition-colors",
              isCenter
                ? "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                : "text-muted-foreground/60 hover:bg-[#0077b5]/10 hover:text-[#0077b5]",
            )}
          >
            <Linkedin className="size-4" aria-hidden />
          </a>
        )}
      </div>

      <h3
        className={cn(
          "line-clamp-5 text-sm font-medium leading-relaxed sm:text-base",
          isCenter ? "text-primary-foreground" : "text-foreground",
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </h3>

      <p
        className={cn(
          "absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8",
          "text-sm italic",
          isCenter ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        <span className="block truncate font-medium not-italic">{testimonial.name}</span>
        <span className="block truncate text-xs">{testimonial.title}</span>
      </p>
    </div>
  );
}

export default function TestimonialsSection() {
  const testimonials = testimonialsData.testimonials as Testimonial[];
  const [cardSize, setCardSize] = useState(365);
  const [list, setList] = useState<StaggerItem[]>(() =>
    testimonials.map((t, i) => ({ ...t, tempId: i })),
  );

  const handleMove = (steps: number) => {
    setList((prev) => {
      const next = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift();
          if (!item) return prev;
          next.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = next.pop();
          if (!item) return prev;
          next.unshift({ ...item, tempId: Math.random() });
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <section id="testimonials" className="scroll-mt-28 flex flex-col gap-6">
      <SectionHeader title="What People Say" description="" />

      <div
        className="relative w-full overflow-hidden rounded-[28px] bg-muted/30"
        style={{ height: 600 }}
      >
        {list.map((testimonial, index) => {
          const position = list.length % 2
            ? index - (list.length + 1) / 2
            : index - list.length / 2;
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-12 w-12 items-center justify-center transition-colors sm:h-14 sm:w-14",
              "border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-12 w-12 items-center justify-center transition-colors sm:h-14 sm:w-14",
              "border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
