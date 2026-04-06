"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";
import { useEffect, useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function TestimonialsSection() {
  const testimonials = testimonialsData.testimonials;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [cardsPerView, setCardsPerView] = useState(2);
  const [pageIndex, setPageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const syncCardsPerView = () => {
      setCardsPerView(window.innerWidth < 768 ? 1 : 2);
    };

    syncCardsPerView();
    window.addEventListener("resize", syncCardsPerView);
    return () => window.removeEventListener("resize", syncCardsPerView);
  }, []);

  const pages = useMemo(() => {
    const result = [];

    for (let i = 0; i < testimonials.length; i += cardsPerView) {
      result.push(testimonials.slice(i, i + cardsPerView));
    }

    return result;
  }, [cardsPerView, testimonials]);

  useEffect(() => {
    setPageIndex((prev) => Math.min(prev, Math.max(0, pages.length - 1)));
  }, [pages.length]);

  useEffect(() => {
    if (!isAutoPlay || pages.length <= 1) return;

    const timer = setInterval(() => {
      setSlideDirection(1);
      setPageIndex((prev) => (prev + 1) % pages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlay, pages.length]);

  const goToPrevious = () => {
    if (pageIndex === 0) return;
    setSlideDirection(-1);
    setPageIndex((prev) => Math.max(0, prev - 1));
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    if (pageIndex >= pages.length - 1) return;
    setSlideDirection(1);
    setPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
    setIsAutoPlay(false);
  };

  const canGoPrevious = pageIndex > 0;
  const canGoNext = pageIndex < pages.length - 1;
  const activePage = pages[pageIndex] ?? [];

  return (
    <section id="testimonials" className="scroll-mt-28 flex flex-col gap-6">
      <SectionHeader title="What People Say" description="" />

      <div
        className="relative"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        <div className="overflow-hidden rounded-[28px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${cardsPerView}-${pageIndex}`}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: slideDirection > 0 ? 56 : -56 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: slideDirection > 0 ? -56 : 56 }
              }
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.42, ease: "easeOut" }}
              className={`grid grid-cols-1 gap-4 sm:gap-6 ${cardsPerView > 1 ? "md:grid-cols-2" : ""}`}
            >
              {activePage.map((testimonial, idx) => (
                <motion.article
                  key={`${testimonial.name}-${cardsPerView}-${pageIndex}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: prefersReducedMotion ? 0 : idx * 0.08 }}
                  whileHover={cardsPerView > 1 ? { y: -4 } : undefined}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-card/85 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.2)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-full border border-primary/30"
                          animate={prefersReducedMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
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

                  <p className="text-sm leading-7 text-foreground/90 sm:min-h-[104px] sm:leading-relaxed">
                    {testimonial.quote}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background transition-all duration-200 text-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-accent/10 hover:enabled:text-accent"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {pages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setSlideDirection(index >= pageIndex ? 1 : -1);
                  setPageIndex(index);
                  setIsAutoPlay(false);
                }}
                aria-label={`Go to testimonial page ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${index === pageIndex ? "w-6 bg-accent" : "w-2 bg-border/50 hover:bg-border"}`}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-background transition-all duration-200 text-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-accent/10 hover:enabled:text-accent"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
