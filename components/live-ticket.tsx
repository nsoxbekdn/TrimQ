"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Check, X, Ticket } from "lucide-react";
import { cn, formatWaitTime } from "@/lib/utils";
import type { CustomerTicket, Shop } from "@/lib/types";
import { AnimatedCounter } from "./animated-counter";

interface LiveTicketProps {
  ticket: CustomerTicket;
  shop: Shop;
  onArrived: () => void;
  onLeave: () => void;
}

export function LiveTicket({ ticket, shop, onArrived, onLeave }: LiveTicketProps) {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pulsePosition, setPulsePosition] = useState(false);

  // Pulse the position number periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePosition(true);
      setTimeout(() => setPulsePosition(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusMessage = () => {
    if (ticket.position === 1) {
      return { text: "You're in the chair!", subtext: "Enjoy your service" };
    }
    if (ticket.position === 2) {
      return { text: "Head to the shop now!", subtext: "You're next in line" };
    }
    return {
      text: "Relax at home",
      subtext: "We'll notify you when you're next",
    };
  };

  const status = getStatusMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[100dvh] flex-col bg-background"
    >
      {/* Header */}
      <div className="bg-forest px-5 pb-6 pt-safe">
        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">{shop.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <h1 className="font-serif text-xl text-white">
                  You&apos;re in the queue
                </h1>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-lime"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
              <MapPin className="h-4 w-4" />
              {shop.distance} km
            </div>
          </div>
        </div>
      </div>

      {/* Main ticket card */}
      <div className="flex-1 px-5 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-card shadow-[0_8px_40px_rgba(28,58,42,0.15)]"
        >
          {/* Ticket punch holes */}
          <div className="absolute left-0 top-1/2 h-6 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute right-0 top-1/2 h-6 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-background" />

          {/* Dashed line */}
          <div className="absolute left-6 right-6 top-1/2 border-t-2 border-dashed border-muted/50" />

          {/* Top section - Position */}
          <div className="p-6 pb-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Your position
            </p>
            <motion.div
              animate={pulsePosition ? { scale: [1, 1.1, 1] } : {}}
              className="mt-2"
            >
              <span className="font-serif text-8xl text-forest">
                <AnimatedCounter value={ticket.position} duration={0.5} prefix="#" />
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime/20 px-4 py-2 text-sm font-medium text-forest"
            >
              <Clock className="h-4 w-4" />
              {formatWaitTime(ticket.estimatedWait)} estimated
            </motion.div>
          </div>

          {/* Bottom section - Services & Status */}
          <div className="bg-forest/5 p-6 pt-10">
            {/* Services */}
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {ticket.services.map((service) => (
                <span
                  key={service.id}
                  className="rounded-full bg-forest/10 px-3 py-1 text-sm font-medium text-forest"
                >
                  {service.name}
                </span>
              ))}
            </div>

            {/* Status message */}
            <motion.div
              key={status.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className={cn(
                "font-serif text-lg",
                ticket.position <= 2 ? "text-lime" : "text-forest"
              )}>
                {status.text}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {status.subtext}
              </p>
            </motion.div>
          </div>

          {/* Ticket icon watermark */}
          <Ticket className="absolute -right-6 -top-6 h-32 w-32 rotate-12 text-forest/5" />
        </motion.div>

        {/* Action buttons */}
        <div className="mt-6 space-y-3">
          {/* Arrived button */}
          {!ticket.hasArrived && ticket.position <= 3 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onArrived}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime py-4 font-semibold text-forest shadow-lg"
            >
              <Check className="h-5 w-5" />
              I&apos;ve Arrived
            </motion.button>
          )}

          {ticket.hasArrived && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-lime/20 py-4 text-forest"
            >
              <Check className="h-5 w-5" />
              <span className="font-medium">You&apos;ve checked in</span>
            </motion.div>
          )}

          {/* Leave queue button */}
          <AnimatePresence mode="wait">
            {!showLeaveConfirm ? (
              <motion.button
                key="leave"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLeaveConfirm(true)}
                className="w-full py-3 text-center text-sm text-muted-foreground transition-colors hover:text-red-500"
              >
                Leave Queue
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl bg-red-50 p-4"
              >
                <p className="mb-3 text-center text-sm text-red-600">
                  Are you sure you want to leave the queue?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeaveConfirm(false)}
                    className="flex-1 rounded-xl bg-white py-3 text-sm font-medium text-forest shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onLeave}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-medium text-white"
                  >
                    <X className="h-4 w-4" />
                    Leave
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
