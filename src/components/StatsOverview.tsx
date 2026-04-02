"use client";

import { motion } from "framer-motion";
import { DollarSign, Zap, Users, Shield } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";

const stats = [
  {
    icon: DollarSign,
    value: 40,
    suffix: "k+",
    description: "AWS cost savings optimized",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
    borderHover: "hover:border-emerald-500/30",
  },
  {
    icon: Zap,
    value: 40,
    suffix: "%",
    description: "Faster deployments",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
    borderHover: "hover:border-amber-500/30",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    description: "Users & merchants served",
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
    borderHover: "hover:border-blue-500/30",
  },
  {
    icon: Shield,
    value: 99.99,
    decimals: 2,
    suffix: "%",
    description: "Uptime achieved",
    gradient: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
    borderHover: "hover:border-violet-500/30",
  },
];

export default function StatsOverview() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
      }}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
            className={`group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-b ${stat.gradient} p-4 transition-all duration-300 ${stat.borderHover} hover:shadow-lg`}
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-lg bg-background/80 p-1.5`}>
                <Icon className={`size-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                <AnimatedNumber
                  target={stat.value}
                  decimals={stat.decimals || 0}
                  suffix={stat.suffix}
                />
              </span>
            </div>
            <p className="text-[11px] leading-tight text-muted-foreground sm:text-xs">
              {stat.description}
            </p>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
