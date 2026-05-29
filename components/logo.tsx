"use client";

import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

export function TrimQLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest">
        <Scissors className="h-5 w-5 text-lime" />
      </div>
      <span className="font-serif text-2xl text-forest">TrimQ</span>
    </motion.div>
  );
}
