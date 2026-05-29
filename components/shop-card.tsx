"use client";

import { motion } from "framer-motion";
import { Star, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Shop } from "@/lib/types";
import { getShopWaitTime, getShopQueueLength } from "@/lib/store";

interface ShopCardProps {
  shop: Shop;
  onClick: () => void;
  index: number;
}

export function ShopCard({ shop, onClick, index }: ShopCardProps) {
  const waitTime = getShopWaitTime(shop);
  const queueLength = getShopQueueLength(shop);
  const isAvailable = shop.isActive && !shop.isPaused && shop.wallet > 0;
  const isLowWallet = shop.wallet > 0 && shop.wallet < 80;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={isAvailable ? { y: -4, scale: 1.02 } : undefined}
      whileTap={isAvailable ? { scale: 0.98 } : undefined}
      onClick={isAvailable ? onClick : undefined}
      disabled={!isAvailable}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl bg-card text-left shadow-[0_4px_20px_rgba(28,58,42,0.08)] transition-all duration-300",
        isAvailable
          ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(28,58,42,0.15)]"
          : "cursor-not-allowed opacity-60"
      )}
    >
      {/* Shop image */}
      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={shop.photo}
          alt={shop.name}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isAvailable && "group-hover:scale-105"
          )}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {/* Wait time badge */}
          {isAvailable ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-forest shadow-lg"
            >
              <Clock className="h-3.5 w-3.5" />
              {waitTime > 0 ? `${waitTime} min wait` : "No wait!"}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
            >
              Offline
            </motion.div>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-forest shadow-lg backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {shop.rating}
          </div>
        </div>

        {/* Queue count */}
        {queueLength > 0 && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 rounded-full bg-forest/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
              <Users className="h-3.5 w-3.5" />
              {queueLength} in queue
            </div>
          </div>
        )}
      </div>

      {/* Shop info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-serif text-lg text-forest">
              {shop.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{shop.area}</span>
              <span className="shrink-0">·</span>
              <span className="shrink-0">{shop.distance} km</span>
            </div>
          </div>
        </div>

        {/* Low wallet warning for shop owners viewing */}
        {isLowWallet && isAvailable && (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Low balance - may go offline soon
          </div>
        )}
      </div>
    </motion.button>
  );
}
