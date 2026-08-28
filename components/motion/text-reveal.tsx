"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: (delayChildren: number) => ({
    transition: { staggerChildren: 0.07, delayChildren },
  }),
};

const word = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.65, ease: EASE } },
};

interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  once = true,
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.6 }}
        variants={container}
        custom={delay}
        className="inline"
      >
        {words.map((w, i) => (
          <span key={i} className="mr-[0.28em] inline-block overflow-hidden pb-1 align-top last:mr-0">
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
