"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Users, Clock, UserPlus, Plus, Pause, Play, AlertTriangle } from "lucide-react";
import { cn, formatPrice, formatWaitTime } from "@/lib/utils";
import { useShop, useApp } from "@/lib/store";
import type { Barber, QueueEntry } from "@/lib/types";
import { AnimatedCounter } from "./animated-counter";

interface BarberDashboardProps {
  shopId: string;
  barberId: string;
  onProfile: () => void;
  onLeaderboard: () => void;
}

function QueueItem({ entry, position, isFirst }: { entry: QueueEntry; position: number; isFirst: boolean }) {
  const waitTime = position === 1 ? 0 : entry.totalDuration * (position - 1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={cn(
        "flex items-center gap-4 rounded-xl p-4",
        isFirst ? "bg-lime/20 ring-2 ring-lime" : "bg-card shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
      )}
    >
      {/* Position */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-lg",
          isFirst ? "bg-lime text-forest" : "bg-forest/10 text-forest"
        )}
      >
        {position}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-forest">{entry.customerName}</p>
          {isFirst && (
            <span className="rounded-full bg-forest px-2 py-0.5 text-xs font-medium text-white">
              In Chair
            </span>
          )}
          {entry.isWalkIn && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Walk-in
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {entry.services.map((s) => s.name).join(" + ")} · {entry.totalDuration} min
        </p>
      </div>

      {/* Time until turn */}
      {!isFirst && (
        <div className="text-right">
          <p className="text-sm font-medium text-forest">{formatWaitTime(waitTime)}</p>
          <p className="text-xs text-muted-foreground">until turn</p>
        </div>
      )}
    </motion.div>
  );
}

export function BarberDashboard({ shopId, barberId, onProfile, onLeaderboard }: BarberDashboardProps) {
  const shop = useShop(shopId);
  const { dispatch } = useApp();
  const barber = shop?.barbers.find((b) => b.id === barberId);

  if (!shop || !barber) return null;

  const totalWait = barber.queue.reduce((sum, q) => sum + q.totalDuration, 0);
  const isLowWallet = shop.wallet > 0 && shop.wallet < 80;

  const handleFinishCurrent = () => {
    if (barber.queue.length > 0) {
      dispatch({ type: "FINISH_CURRENT", payload: { shopId, barberId } });
    }
  };

  const handleAddWalkIn = () => {
    dispatch({ type: "ADD_WALKIN", payload: { shopId, barberId } });
  };

  const handleAddTime = () => {
    if (barber.queue.length > 0) {
      dispatch({ type: "ADD_TIME", payload: { shopId, barberId, minutes: 10 } });
    }
  };

  const handleTogglePause = () => {
    dispatch({ type: "TOGGLE_PAUSE", payload: { shopId } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-background pb-safe"
    >
      {/* Header */}
      <div className="bg-forest px-5 pb-5 pt-safe">
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70">{shop.name}</p>
              <h1 className="font-serif text-xl text-white">{barber.name}</h1>
            </div>
            
            {/* Wallet chip */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2",
                isLowWallet ? "bg-red-500" : "bg-white/10"
              )}
            >
              <Wallet className={cn("h-4 w-4", isLowWallet ? "text-white" : "text-lime")} />
              <span className={cn("font-semibold", isLowWallet ? "text-white" : "text-white")}>
                {formatPrice(shop.wallet)}
              </span>
              {isLowWallet && (
                <span className="text-xs text-white/80">Low</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pause banner */}
      <AnimatePresence>
        {shop.isPaused && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-red-500 px-5 py-3"
          >
            <div className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Shop paused — not accepting new joins</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="px-5 py-4">
        <div className="flex gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 items-center gap-3 rounded-xl bg-card p-4 shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
          >
            <Users className="h-5 w-5 text-forest" />
            <div>
              <p className="text-2xl font-semibold text-forest">
                <AnimatedCounter value={barber.queue.length} />
              </p>
              <p className="text-xs text-muted-foreground">in queue</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-1 items-center gap-3 rounded-xl bg-card p-4 shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
          >
            <Clock className="h-5 w-5 text-forest" />
            <div>
              <p className="text-2xl font-semibold text-forest">
                <AnimatedCounter value={totalWait} suffix=" min" />
              </p>
              <p className="text-xs text-muted-foreground">total wait</p>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinishCurrent}
            disabled={barber.queue.length === 0}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl p-4 font-medium transition-all",
              barber.queue.length > 0
                ? "bg-lime text-forest shadow-lg"
                : "bg-muted text-muted-foreground"
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-sm">Finish Current</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddWalkIn}
            className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 font-medium shadow-[0_2px_10px_rgba(28,58,42,0.06)] transition-all hover:shadow-[0_4px_15px_rgba(28,58,42,0.1)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 text-forest">
              <UserPlus className="h-5 w-5" />
            </div>
            <span className="text-sm text-forest">Add Walk-in</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddTime}
            disabled={barber.queue.length === 0}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl p-4 font-medium transition-all",
              barber.queue.length > 0
                ? "bg-card shadow-[0_2px_10px_rgba(28,58,42,0.06)] hover:shadow-[0_4px_15px_rgba(28,58,42,0.1)]"
                : "bg-muted"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              barber.queue.length > 0 ? "bg-forest/10 text-forest" : "bg-muted-foreground/20 text-muted-foreground"
            )}>
              <Plus className="h-5 w-5" />
            </div>
            <span className={cn("text-sm", barber.queue.length > 0 ? "text-forest" : "text-muted-foreground")}>
              +10 Minutes
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTogglePause}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl p-4 font-medium transition-all",
              shop.isPaused
                ? "bg-forest text-white"
                : "bg-card text-forest shadow-[0_2px_10px_rgba(28,58,42,0.06)] hover:shadow-[0_4px_15px_rgba(28,58,42,0.1)]"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              shop.isPaused ? "bg-white/20" : "bg-forest/10"
            )}>
              {shop.isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </div>
            <span className="text-sm">{shop.isPaused ? "Resume" : "Pause"}</span>
          </motion.button>
        </div>
      </div>

      {/* Queue list */}
      <div className="px-5 pb-6">
        <h2 className="mb-3 font-serif text-lg text-forest">Live Queue</h2>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {barber.queue.length > 0 ? (
              barber.queue.map((entry, index) => (
                <QueueItem
                  key={entry.id}
                  entry={entry}
                  position={index + 1}
                  isFirst={index === 0}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-card p-8 text-center shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-lime/20">
                  <span className="text-3xl">✂️</span>
                </div>
                <p className="font-medium text-forest">No one in queue</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Waiting for customers...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card px-5 py-3 pb-safe">
        <div className="flex gap-3">
          <button
            onClick={onProfile}
            className="flex-1 rounded-xl bg-forest/5 py-3 text-sm font-medium text-forest transition-colors hover:bg-forest/10"
          >
            My Profile
          </button>
          <button
            onClick={onLeaderboard}
            className="flex-1 rounded-xl bg-forest/5 py-3 text-sm font-medium text-forest transition-colors hover:bg-forest/10"
          >
            Leaderboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}
