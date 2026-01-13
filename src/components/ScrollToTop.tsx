"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="group fixed bottom-8 left-8 z-50 flex size-12 items-center justify-center rounded-full border border-border bg-background/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                    aria-label="Scroll to top"
                >
                    {/* Neon glow on hover */}
                    <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-all duration-300 group-hover:from-primary/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 group-hover:opacity-100" />
                    <ArrowUp className="size-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
