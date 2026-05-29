"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Users, Check, Scissors } from "lucide-react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import type { Shop, Service } from "@/lib/types";
import { getShopWaitTime, getShopQueueLength } from "@/lib/store";

interface ShopDetailProps {
  shop: Shop;
  onBack: () => void;
  onJoinQueue: (services: Service[]) => void;
}

const SERVICE_ICONS: Record<string, string> = {
  scissors: "✂️",
  razor: "🪒",
  massage: "💆",
  palette: "🎨",
};

export function ShopDetail({ shop, onBack, onJoinQueue }: ShopDetailProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const queueLength = getShopQueueLength(shop);
  const currentWait = getShopWaitTime(shop);
  const isAvailable = shop.isActive && !shop.isPaused && shop.wallet > 0;

  const toggleService = (service: Service) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const estimatedWait = currentWait + totalDuration;
  const position = queueLength + 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100dvh] flex-col bg-background"
    >
      {/* Hero image */}
      <div className="relative h-56 w-full shrink-0">
        <Image
          src={shop.photo}
          alt={shop.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-forest shadow-lg backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        {/* Shop info overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-serif text-2xl text-white">{shop.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-white/90">
            <span>{shop.area}, {shop.city}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{shop.rating}</span>
              <span className="text-white/70">({shop.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Queue status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl bg-forest/5 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-forest">
              <Users className="h-5 w-5" />
            </div>
            <div>
              {queueLength > 0 ? (
                <>
                  <p className="font-semibold text-forest">
                    {queueLength} {queueLength === 1 ? "person" : "people"} ahead of you
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estimated wait: {currentWait} min
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-forest">No one waiting</p>
                  <p className="text-sm text-muted-foreground">Be the first!</p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Services */}
        <div className="flex-1">
          <h2 className="mb-3 font-serif text-lg text-forest">Select services</h2>
          <div className="space-y-3">
            {shop.services.map((service, index) => {
              const isSelected = selectedServices.find((s) => s.id === service.id);
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleService(service)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                    isSelected
                      ? "border-lime bg-lime/10"
                      : "border-transparent bg-card shadow-[0_2px_10px_rgba(28,58,42,0.06)] hover:shadow-[0_4px_15px_rgba(28,58,42,0.1)]"
                  )}
                >
                  {/* Icon */}
                  <span className="text-2xl">{SERVICE_ICONS[service.icon]}</span>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration} min · {formatPrice(service.price)}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                      isSelected
                        ? "border-lime bg-lime text-forest"
                        : "border-muted-foreground/30"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Summary card */}
        <AnimatePresence mode="wait">
          {selectedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 rounded-xl bg-forest p-4 text-white"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Your position</span>
                <span className="font-semibold">#{position}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-white/80">Total wait</span>
                <span className="font-semibold">{estimatedWait} min</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedServices.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full bg-white/20 px-2 py-0.5 text-xs"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pb-safe"
        >
          <motion.button
            whileHover={isAvailable && selectedServices.length > 0 ? { scale: 1.02 } : undefined}
            whileTap={isAvailable && selectedServices.length > 0 ? { scale: 0.98 } : undefined}
            onClick={() => selectedServices.length > 0 && onJoinQueue(selectedServices)}
            disabled={!isAvailable || selectedServices.length === 0}
            className={cn(
              "group relative w-full overflow-hidden rounded-2xl py-4 font-semibold shadow-lg transition-all duration-300",
              !isAvailable
                ? "bg-red-500/20 text-red-500"
                : selectedServices.length > 0
                ? "bg-lime text-forest hover:shadow-xl"
                : "bg-muted text-muted-foreground"
            )}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {!isAvailable ? (
                "Shop Offline"
              ) : selectedServices.length > 0 ? (
                <>
                  <Scissors className="h-5 w-5" />
                  Join Queue · {formatPrice(totalPrice)}
                </>
              ) : (
                "Select a service"
              )}
            </span>
            {/* Shine effect */}
            {isAvailable && selectedServices.length > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
