"use client";

import { Experience } from "@/lib/schemas";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import Icon from "./Icon";

interface Props {
  experience: Experience;
  type?: "work" | "education";
}

export default function TimelineItem({ experience, type = "work" }: Props) {
  const { name, href, logo, positions } = experience;

  // Color scheme based on type
  const colors = type === "work"
    ? { from: "orange-500", via: "amber-500", to: "yellow-500" }
    : { from: "emerald-500", via: "green-500", to: "teal-500" };

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className="group relative ml-10 py-4"
    >
      {/* Neon glow background on hover */}
      <div className={`absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-${colors.from}/0 via-${colors.via}/0 to-${colors.to}/0 opacity-0 transition-all duration-500 group-hover:from-${colors.from}/5 group-hover:via-${colors.via}/5 group-hover:to-${colors.to}/5 group-hover:opacity-100`} />

      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="absolute -left-16 top-4 flex items-center justify-center rounded-full bg-white transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg"
      >
        <Avatar className={`size-12 border transition-all duration-500 ease-out group-hover:border-${colors.from}/60 group-hover:shadow-lg group-hover:shadow-${colors.from}/30`}>
          <AvatarImage
            src={logo}
            alt={name}
            loading="lazy"
            decoding="async"
            className="bg-background object-contain transition-all duration-500 ease-out group-hover:scale-105"
          />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-1 flex-col justify-start gap-2">
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          className="w-fit"
        >
          <h2 className={`text-base font-semibold leading-none transition-all duration-500 group-hover:text-${colors.from} group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]`}>
            {name}
          </h2>
        </Link>
        <div className="flex flex-col gap-2">
          {positions.map((position) => (
            <div key={`${position.title}-${position.start}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  {position.title}
                </p>
                <time className="whitespace-nowrap pr-8 text-xs tabular-nums text-muted-foreground">
                  <span>{position.start}</span>
                  <span>{" - "}</span>
                  <span>{position.end ?? "Present"}</span>
                </time>
              </div>
              {position.description && (
                <ul className="ml-4 mt-2 list-outside list-disc">
                  {position.description.map((desc, i) => (
                    <li
                      key={i}
                      className="prose pr-8 text-sm dark:prose-invert"
                    >
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
              {position.links && position.links.length > 0 && (
                <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
                  {position.links.map((link) => (
                    <Link href={link.href} key={link.href}>
                      <Badge title={link.name} className={`flex gap-2 transition-all duration-500 hover:scale-105 hover:bg-${colors.from}/20 hover:shadow-md hover:shadow-${colors.from}/20`}>
                        <Icon
                          name={link.icon}
                          aria-hidden="true"
                          className="size-3"
                        />
                        {link.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.li>
  );
}
