"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Star, Check, Camera, Share2, Users, Gift } from "lucide-react";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { useShop } from "@/lib/store";
import type { Barber } from "@/lib/types";
import { AnimatedCounter } from "./animated-counter";

interface BarberProfileProps {
  shopId: string;
  barberId: string;
  onBack: () => void;
}

export function BarberProfile({ shopId, barberId, onBack }: BarberProfileProps) {
  const shop = useShop(shopId);
  const barber = shop?.barbers.find((b) => b.id === barberId);

  if (!shop || !barber) return null;

  const completedTasks = barber.tasks.filter((t) => t.completed).length;
  const totalTokens = barber.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.tokens, 0);
  const walletCredit = Math.floor(totalTokens / 100) * 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-background pb-safe"
    >
      {/* Header */}
      <div className="relative bg-forest px-5 pb-20 pt-safe">
        <div className="pt-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Profile card overlapping header */}
      <div className="relative -mt-16 px-5">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl bg-card p-5 shadow-[0_8px_30px_rgba(28,58,42,0.12)]"
        >
          <div className="flex items-start gap-4">
            {/* Photo */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={barber.photo}
                alt={barber.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-xl text-forest">{barber.name}</h1>
              <p className="text-sm text-muted-foreground">{shop.name}</p>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-forest">{barber.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({barber.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-forest/5 p-3 text-center">
              <p className="text-xl font-semibold text-forest">
                <AnimatedCounter value={barber.totalServed} />
              </p>
              <p className="text-xs text-muted-foreground">Total served</p>
            </div>
            <div className="rounded-xl bg-lime/20 p-3 text-center">
              <p className="text-xl font-semibold text-forest">
                <AnimatedCounter value={barber.appCustomers} />
              </p>
              <p className="text-xs text-muted-foreground">App bookings</p>
            </div>
            <div className="rounded-xl bg-forest/5 p-3 text-center">
              <p className="text-xl font-semibold text-forest">
                <AnimatedCounter value={barber.walkInCustomers} />
              </p>
              <p className="text-xs text-muted-foreground">Walk-ins</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio */}
      <div className="mt-6 px-5">
        <h2 className="mb-3 font-serif text-lg text-forest">Portfolio</h2>
        <div className="grid grid-cols-3 gap-2">
          {barber.portfolio.map((photo, index) => (
            <motion.div
              key={photo}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={photo}
                alt={`Portfolio ${index + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
          {barber.portfolio.length < 6 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: barber.portfolio.length * 0.1 }}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-forest hover:text-forest"
            >
              <Camera className="h-6 w-6" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="mt-6 px-5">
        <h2 className="mb-3 font-serif text-lg text-forest">Services</h2>
        <div className="space-y-2">
          {shop.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="flex items-center justify-between rounded-xl bg-card p-4 shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
            >
              <div>
                <p className="font-medium text-forest">{service.name}</p>
                <p className="text-sm text-muted-foreground">{service.duration} min</p>
              </div>
              <p className="font-semibold text-forest">{formatPrice(service.price)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Token Tasks */}
      <div className="mt-6 px-5 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg text-forest">Earn Tokens</h2>
          <div className="flex items-center gap-2 rounded-full bg-lime/20 px-3 py-1">
            <Gift className="h-4 w-4 text-forest" />
            <span className="text-sm font-medium text-forest">
              {totalTokens} tokens = {formatPrice(walletCredit)} credit
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedTasks / barber.tasks.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-lime"
          />
        </div>

        <div className="space-y-3">
          {barber.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={cn(
                "flex items-center gap-4 rounded-xl p-4",
                task.completed ? "bg-lime/10" : "bg-card shadow-[0_2px_10px_rgba(28,58,42,0.06)]"
              )}
            >
              {/* Status */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  task.completed ? "bg-lime text-forest" : "bg-forest/10"
                )}
              >
                {task.completed ? (
                  <Check className="h-4 w-4" />
                ) : task.id === "t3" ? (
                  <Share2 className="h-4 w-4 text-forest" />
                ) : task.id === "t5" ? (
                  <Users className="h-4 w-4 text-forest" />
                ) : (
                  <Camera className="h-4 w-4 text-forest" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className={cn("font-medium", task.completed ? "text-forest" : "text-forest")}>
                  {task.title}
                </p>
                {task.progress !== undefined && task.target !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {task.progress}/{task.target} completed
                  </p>
                )}
              </div>

              {/* Tokens */}
              <div className="text-right">
                <p className={cn("font-semibold", task.completed ? "text-lime" : "text-forest")}>
                  +{task.tokens}
                </p>
                <p className="text-xs text-muted-foreground">tokens</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
