"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { Topbar } from "@/components/layout/topbar";

const TOPBAR_HEIGHT = 36;
const HIDE_AFTER = 8;

export function Header() {
  const [hideTopbar, setHideTopbar] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHideTopbar(latest > HIDE_AFTER);
  });

  return (
    <header className="relative z-50">
      <motion.div
        initial={false}
        animate={{ height: hideTopbar ? 0 : TOPBAR_HEIGHT, opacity: hideTopbar ? 0 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden hidden md:block"
      >
        <Topbar />
      </motion.div>
    </header>
  );
}
