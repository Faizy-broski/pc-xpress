"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  id?: string;
  /**
   * Scroll-into-view reveal is wrong for content whose height varies with data
   * (tables, filtered lists): a tall container may never satisfy the 30%
   * viewport-visible threshold, leaving it stuck at opacity 0. Pass false to
   * animate on mount instead — used by dashboard tables/lists.
   */
  viewTrigger?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
  id,
  viewTrigger = true,
}: RevealProps) {
  const viewProps = viewTrigger
    ? { whileInView: { opacity: 1, y: 0 }, viewport: { once, amount: 0.3 } }
    : { animate: { opacity: 1, y: 0 } };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y }}
      {...viewProps}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
  /** See Reveal's viewTrigger — false animates on mount instead of on scroll-into-view. */
  viewTrigger?: boolean;
}

const groupContainer = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  once = true,
  viewTrigger = true,
}: RevealGroupProps) {
  const viewProps = viewTrigger
    ? { whileInView: "visible", viewport: { once, amount: 0.3 } }
    : { animate: "visible" };

  return (
    <motion.div
      initial="hidden"
      {...viewProps}
      variants={groupContainer}
      custom={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const groupItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={groupItem} className={className}>
      {children}
    </motion.div>
  );
}
