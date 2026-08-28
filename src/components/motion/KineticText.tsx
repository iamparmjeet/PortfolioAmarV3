"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KineticLine {
  text: string;
  /** Words rendered in italic gold (Design A/B `em` treatment). */
  accent?: boolean;
}

interface KineticTextProps {
  lines: KineticLine[];
  className?: string;
  /** Base delay in seconds before the first word animates. */
  delay?: number;
}

/**
 * Kinetic skewY word reveal from Design B (v2-kinetic-word):
 * each word rises from below its line with a slight skew correction.
 */
export function KineticText({ lines, className, delay = 0 }: KineticTextProps) {
  let wordIndex = 0;

  return (
    <h1 className={cn("display", className)}>
      {lines.map((line) => (
        <span key={line.text} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          {line.text.split(" ").map((word) => {
            const i = wordIndex++;
            return (
              <motion.span
                key={`${word}-${i}`}
                initial={{ y: "112%", skewY: 7, opacity: 0 }}
                animate={{ y: 0, skewY: 0, opacity: 1 }}
                transition={{
                  duration: 1.1,
                  delay: delay + i * 0.11,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className={cn("inline-block", line.accent && "italic text-accent")}
              >
                {word}
                {" "}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
