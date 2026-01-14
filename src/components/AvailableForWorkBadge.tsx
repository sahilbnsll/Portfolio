"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AvailableForWorkBadge() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href="/contact">
            <motion.div
                className="relative inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 backdrop-blur-sm transition-all duration-300 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/20 dark:text-green-400"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{
                    scale: 1.05,
                    transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                    }
                }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Pulsing indicator dot */}
                <motion.span
                    className="relative flex size-2 shrink-0"
                    animate={{
                        scale: isHovered ? 0.9 : 1
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }}
                >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                </motion.span>

                {/* Text container with smooth width transition */}
                <motion.div
                    className="relative whitespace-nowrap"
                    animate={{
                        width: "auto"
                    }}
                    transition={{
                        duration: 0.25,
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                >
                    <motion.span
                        animate={{
                            opacity: isHovered ? 0 : 1,
                            x: isHovered ? -10 : 0
                        }}
                        transition={{
                            duration: 0.2,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="inline-block"
                    >
                        Available for work
                    </motion.span>

                    <motion.span
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : 10
                        }}
                        transition={{
                            duration: 0.2,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="absolute inset-0 flex items-center gap-1.5"
                    >
                        Reach out
                        <motion.div
                            animate={{
                                rotate: isHovered ? -10 : 0
                            }}
                            transition={{
                                duration: 0.3,
                                type: "spring",
                                stiffness: 400,
                                damping: 20
                            }}
                        >
                            <Mail className="size-3.5" />
                        </motion.div>
                    </motion.span>
                </motion.div>
            </motion.div>
        </Link>
    );
}
