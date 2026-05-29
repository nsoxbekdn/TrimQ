"use client";

import { motion } from "framer-motion";

export function HeroText() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-4 text-center"
    >
      <h1 className="font-serif text-5xl leading-tight text-forest md:text-6xl lg:text-7xl">
        Skip the{" "}
        <motion.span
          className="inline-block italic text-lime"
          style={{ textShadow: "0 0 40px rgba(186, 255, 0, 0.3)" }}
          animate={{
            textShadow: [
              "0 0 20px rgba(186, 255, 0, 0.2)",
              "0 0 40px rgba(186, 255, 0, 0.4)",
              "0 0 20px rgba(186, 255, 0, 0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          wait.
        </motion.span>
      </h1>
      <p className="mx-auto max-w-md text-lg text-muted-foreground md:text-xl">
        Join the queue from home. Arrive only when it&apos;s your turn.
      </p>
    </motion.div>
  );
}
