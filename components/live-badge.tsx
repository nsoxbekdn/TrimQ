"use client";

import { motion } from "framer-motion";

interface LiveBadgeProps {
  count: number;
}

export function LiveBadge({ count }: LiveBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-2 backdrop-blur-sm"
    >
      {/* Pulsing green dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
      </span>
      <span className="text-sm font-medium text-forest">
        {count} shops open near you
      </span>
    </motion.div>
  );
}
