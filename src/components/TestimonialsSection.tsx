"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";
import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
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
    setSlideDirection(-1);
    setCurrentIndex((prev) => {
      const newIndex = prev - cardsPerView;
      return newIndex < 0 ? 0 : newIndex;
    });
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setSlideDirection(1);
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
    <section id="testimonials" className="scroll-mt-28 flex flex-col gap-6">
      <SectionHeader title="What People Say" description="" />

      <div className="relative" onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <AnimatePresence mode="wait" initial={false}>
            {visibleTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${currentIndex}-${idx}`}
                initial={{ opacity: 0, x: slideDirection > 0 ? 40 : -40, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: slideDirection > 0 ? -40 : 40, scale: 0.985 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group flex flex-col gap-4 rounded-xl border border-border/70 bg-card/80 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.25)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-primary/30"
                        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="text-sm font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="min-h-[90px] text-sm leading-relaxed text-foreground/90">
                  {testimonial.quote}
                </p>
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
                  setSlideDirection(index * cardsPerView >= currentIndex ? 1 : -1);
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
