"use client";

import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

interface SocialProofProps {
  count: string;
}

export function SocialProof({ count }: SocialProofProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
    >
      <div className="flex -space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-cream bg-forest"
          >
            <Scissors className="h-3 w-3 text-lime" />
          </motion.div>
        ))}
      </div>
      <span className="font-medium">
        <span className="text-forest">{count}</span> haircuts served this week
      </span>
    </motion.div>
  );
}
