"use client";

import { motion } from "framer-motion";
import { useUser, useShops, getShopWaitTime, getShopQueueLength } from "@/lib/store";
import { getGreeting } from "@/lib/utils";
import { StatChips } from "@/components/stat-chips";
import { ShopCard } from "@/components/shop-card";
import type { Shop } from "@/lib/types";

interface CustomerHomeProps {
  onSelectShop: (shop: Shop) => void;
}

export function CustomerHome({ onSelectShop }: CustomerHomeProps) {
  const user = useUser();
  const shops = useShops();

  const activeShops = shops.filter((s) => s.isActive && !s.isPaused && s.wallet > 0);
  const totalInQueues = shops.reduce((sum, shop) => sum + getShopQueueLength(shop), 0);
  const fastestWait = activeShops.length > 0
    ? Math.min(...activeShops.map((s) => getShopWaitTime(s)))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-background"
    >
      {/* Header */}
      <div className="px-5 pt-safe">
        <div className="pt-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground"
          >
            {getGreeting()},
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-2xl text-forest"
          >
            {user?.name || "there"}
          </motion.h1>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <StatChips
            shopsOnline={activeShops.length}
            fastestWait={fastestWait}
            peopleInQueues={totalInQueues}
          />
        </motion.div>
      </div>

      {/* Shop list */}
      <div className="mt-6 px-5 pb-safe">
        <div className="pb-6">
          <h2 className="mb-4 font-serif text-lg text-forest">Nearby shops</h2>
          <div className="space-y-4">
            {shops.map((shop, index) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onClick={() => onSelectShop(shop)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
