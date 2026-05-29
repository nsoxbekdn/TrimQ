"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, Flame, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useShops } from "@/lib/store";
import { AnimatedCounter } from "./animated-counter";

interface LeaderboardProps {
  onBack: () => void;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  photo: string;
  shopName: string;
  totalServed: number;
  rating: number;
  badge?: "most-booked" | "highest-rated" | "new";
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const shops = useShops();

  // Aggregate all barbers for leaderboard
  const barbers: LeaderboardEntry[] = shops.flatMap((shop) =>
    shop.barbers.map((barber) => ({
      id: barber.id,
      name: barber.name,
      photo: barber.photo,
      shopName: shop.name,
      totalServed: barber.totalServed,
      rating: barber.rating,
    }))
  ).sort((a, b) => b.totalServed - a.totalServed);

  // Assign badges
  if (barbers.length > 0) {
    barbers[0].badge = "most-booked";
    const highestRated = [...barbers].sort((a, b) => b.rating - a.rating)[0];
    const highestRatedIdx = barbers.findIndex((b) => b.id === highestRated.id);
    if (highestRatedIdx !== 0) {
      barbers[highestRatedIdx].badge = "highest-rated";
    }
    // Mark newest (last) as new
    if (barbers.length > 2) {
      barbers[barbers.length - 1].badge = "new";
    }
  }

  const getBadgeInfo = (badge?: string) => {
    switch (badge) {
      case "most-booked":
        return { icon: Trophy, label: "Most Booked", color: "bg-yellow-400 text-yellow-900" };
      case "highest-rated":
        return { icon: Star, label: "Highest Rated", color: "bg-lime text-forest" };
      case "new":
        return { icon: Sparkles, label: "New on TrimQ", color: "bg-forest text-white" };
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-background pb-safe"
    >
      {/* Header */}
      <div className="bg-forest px-5 pb-6 pt-safe">
        <div className="pt-4">
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="font-serif text-xl text-white">Leaderboard</h1>
              <p className="text-sm text-white/70">Top barbers this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="relative -mt-2 px-5">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-end justify-center gap-3 pb-4"
        >
          {/* 2nd place */}
          {barbers[1] && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-white/50">
                  <Image
                    src={barbers[1].photo}
                    alt={barbers[1].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold text-forest shadow-lg">
                  2
                </div>
              </div>
              <p className="max-w-[80px] truncate text-center text-sm font-medium text-white">
                {barbers[1].name}
              </p>
              <p className="text-xs text-white/70">
                <AnimatedCounter value={barbers[1].totalServed} /> cuts
              </p>
            </motion.div>
          )}

          {/* 1st place */}
          {barbers[0] && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="mb-1 h-6 w-6 text-lime" />
              </motion.div>
              <div className="relative mb-2">
                <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-lime">
                  <Image
                    src={barbers[0].photo}
                    alt={barbers[0].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-lime font-bold text-forest shadow-lg">
                  1
                </div>
              </div>
              <p className="max-w-[90px] truncate text-center font-medium text-white">
                {barbers[0].name}
              </p>
              <p className="text-sm text-lime">
                <AnimatedCounter value={barbers[0].totalServed} /> cuts
              </p>
            </motion.div>
          )}

          {/* 3rd place */}
          {barbers[2] && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="relative h-14 w-14 overflow-hidden rounded-full ring-4 ring-white/30">
                  <Image
                    src={barbers[2].photo}
                    alt={barbers[2].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 font-semibold text-forest shadow-lg">
                  3
                </div>
              </div>
              <p className="max-w-[70px] truncate text-center text-sm font-medium text-white">
                {barbers[2].name}
              </p>
              <p className="text-xs text-white/70">
                <AnimatedCounter value={barbers[2].totalServed} /> cuts
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Full list */}
      <div className="mt-4 px-5 pb-6">
        <div className="space-y-3">
          {barbers.map((barber, index) => {
            const badgeInfo = getBadgeInfo(barber.badge);
            return (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={cn(
                  "flex items-center gap-4 rounded-xl p-4",
                  index < 3
                    ? "bg-lime/10 ring-1 ring-lime/30"
                    : "bg-card shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
                )}
              >
                {/* Rank */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold",
                    index === 0
                      ? "bg-lime text-forest"
                      : index < 3
                      ? "bg-forest/20 text-forest"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>

                {/* Photo */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={barber.photo}
                    alt={barber.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-forest">{barber.name}</p>
                    {badgeInfo && (
                      <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", badgeInfo.color)}>
                        <badgeInfo.icon className="h-3 w-3" />
                        {badgeInfo.label}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{barber.shopName}</p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p className="font-semibold text-forest">{barber.totalServed}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {barber.rating}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
