"use client";

import { motion } from "framer-motion";
import { Store, Zap, Users } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

interface StatChipsProps {
  shopsOnline: number;
  fastestWait: number;
  peopleInQueues: number;
}

export function StatChips({ shopsOnline, fastestWait, peopleInQueues }: StatChipsProps) {
  const chips = [
    {
      icon: Store,
      value: shopsOnline,
      label: "shops online",
      color: "bg-forest/10 text-forest",
    },
    {
      icon: Zap,
      value: fastestWait,
      label: "min fastest",
      color: "bg-lime/20 text-forest",
    },
    {
      icon: Users,
      value: peopleInQueues,
      label: "in queues",
      color: "bg-forest/10 text-forest",
    },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {chips.map((chip, index) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm ${chip.color}`}
        >
          <chip.icon className="h-4 w-4" />
          <span className="font-semibold">
            <AnimatedCounter value={chip.value} duration={0.8} />
          </span>
          <span className="text-muted-foreground">{chip.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
