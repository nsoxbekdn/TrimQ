"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrimQLogo } from "@/components/logo";
import { LiveBadge } from "@/components/live-badge";
import { HeroText } from "@/components/hero-text";
import { RoleSelector } from "@/components/role-selector";
import { SocialProof } from "@/components/social-proof";
import { ArrowRight } from "lucide-react";
import type { Role } from "@/lib/types";

interface WelcomeScreenProps {
  onStart: (name: string, role: Role) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");

  const canStart = name.trim().length > 0;

  const handleStart = () => {
    if (!canStart) return;
    onStart(name.trim(), role);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-forest/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231C3A2A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex min-h-[100dvh] flex-col px-5 py-8 md:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <TrimQLogo />
          <LiveBadge count={12} />
        </header>

        {/* Content area */}
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="w-full max-w-md space-y-8">
            {/* Hero */}
            <HeroText />

            {/* Name input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-2"
            >
              <label
                htmlFor="name"
                className="block text-center text-sm font-medium text-muted-foreground"
              >
                What should we call you?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="Your name"
                className="w-full rounded-2xl border-2 border-transparent bg-card px-4 py-3 text-center text-forest shadow-[0_2px_10px_rgba(28,58,42,0.06)] transition-all placeholder:text-muted-foreground/50 focus:border-lime focus:outline-none focus:ring-0"
              />
            </motion.div>

            {/* Role cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              <p className="text-center text-sm font-medium text-muted-foreground">
                I am a...
              </p>
              <RoleSelector value={role} onChange={setRole} />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button
                whileHover={canStart ? { scale: 1.02 } : undefined}
                whileTap={canStart ? { scale: 0.98 } : undefined}
                onClick={handleStart}
                disabled={!canStart}
                className="group relative w-full overflow-hidden rounded-2xl bg-forest py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={canStart ? { x: "100%" } : undefined}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto">
          <SocialProof count="2,400+" />
        </footer>
      </div>
    </main>
  );
}
