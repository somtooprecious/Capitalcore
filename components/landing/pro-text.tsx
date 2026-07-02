"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
};

export function ProText({ text, className, as = "p", delay = 0 }: ProTextProps) {
  const words = text.split(" ");
  const Tag = as;

  return (
    <Tag className={cn(className, "overflow-hidden")}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: delay,
              staggerChildren: 0.03,
            },
          },
        }}
        aria-label={text}
        className="inline"
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={{
              hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mr-[0.26em] inline-block will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
