"use client";

import { motion } from "framer-motion";
import { DollarSign, Zap, Users, Shield } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    label: "$40k+",
    description: "AWS cost savings optimized",
    color: "text-green-500"
  },
  {
    icon: Zap,
    label: "40%",
    description: "Faster deployments",
    color: "text-yellow-500"
  },
  {
    icon: Users,
    label: "500+",
    description: "Users & merchants served",
    color: "text-blue-500"
  },
  {
    icon: Shield,
    label: "99.99%",
    description: "Uptime achieved",
    color: "text-purple-500"
  }
];

export default function StatsOverview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Icon className={`size-5 ${stat.color}`} />
              <span className="text-xl font-bold sm:text-2xl">{stat.label}</span>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {stat.description}
            </p>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
