"use client";

import { Experience } from "@/lib/schemas";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import Icon from "./Icon";

interface Props {
  experience: Experience;
}

export default function TimelineItem({ experience }: Props) {
  const { name, href, logo, positions } = experience;

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative ml-10 py-4"
    >
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className="absolute -left-16 top-4 flex items-center justify-center rounded-full bg-white transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg"
      >
        <Avatar className="size-12 border transition-all duration-300 ease-out group-hover:border-primary/60">
          <AvatarImage
            src={logo}
            alt={name}
            loading="lazy"
            decoding="async"
            className="bg-background object-contain transition-all duration-300 ease-out group-hover:scale-105"
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
          <h2 className="text-base font-semibold leading-none">
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
                      <Badge title={link.name} className="flex gap-2 transition-all duration-300 hover:scale-105 hover:bg-primary/20">
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
