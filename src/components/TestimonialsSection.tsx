"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";
import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const testimonials = testimonialsData.testimonials;
  const cardsPerView = 2;

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + cardsPerView) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - cardsPerView;
      return newIndex < 0 ? 0 : newIndex;
    });
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, testimonials.length - cardsPerView);
      const newIndex = prev + cardsPerView;
      return newIndex > maxIndex ? maxIndex : newIndex;
    });
    setIsAutoPlay(false);
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < Math.max(0, testimonials.length - cardsPerView);

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length]
  ];

  return (
    <section className="flex flex-col gap-6">
      <SectionHeader title="what others say" description="Feedback from colleagues and leaders I've worked with" />

      <div className="relative" onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {visibleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-foreground/90 italic min-h-[80px] flex items-center">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center mt-8 gap-4">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className="flex items-center justify-center size-10 rounded-full border border-border/50 bg-background transition-all duration-200 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-accent/10 hover:enabled:text-accent"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(testimonials.length / cardsPerView) }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentIndex(index * cardsPerView);
                  setIsAutoPlay(false);
                }}
                disabled={index * cardsPerView > Math.max(0, testimonials.length - cardsPerView)}
                className={`h-2 rounded-full transition-all duration-300 disabled:hidden ${index * cardsPerView === currentIndex ? "bg-accent w-6" : "bg-border/50 w-2 hover:bg-border"}`}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className="flex items-center justify-center size-10 rounded-full border border-border/50 bg-background transition-all duration-200 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-accent/10 hover:enabled:text-accent"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
