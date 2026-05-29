"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  AppProvider,
  useApp,
  useUser,
  useActiveTicket,
  getShopWaitTime,
  getShopQueueLength,
} from "@/lib/store";
import type { Role, Shop, Service, CustomerTicket } from "@/lib/types";

import { WelcomeScreen } from "@/components/welcome-screen";
import { CustomerHome } from "@/components/customer-home";
import { ShopDetail } from "@/components/shop-detail";
import { LiveTicket } from "@/components/live-ticket";
import { ReviewScreen } from "@/components/review-screen";
import { BarberDashboard } from "@/components/barber-dashboard";
import { BarberProfile } from "@/components/barber-profile";
import { Leaderboard } from "@/components/leaderboard";

type CustomerView = "home" | "shop" | "ticket" | "review";
type BarberView = "dashboard" | "profile" | "leaderboard";

function AppShell() {
  const { state, dispatch } = useApp();
  const user = useUser();
  const activeTicket = useActiveTicket();

  const [customerView, setCustomerView] = useState<CustomerView>("home");
  const [barberView, setBarberView] = useState<BarberView>("dashboard");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [reviewShopName, setReviewShopName] = useState("");

  // The first shop/barber is treated as the logged-in barber's context for demo purposes
  const barberShopId = state.shops[0]?.id ?? "";
  const barberId = state.shops[0]?.barbers[0]?.id ?? "";

  const handleStart = useCallback(
    (name: string, role: Role) => {
      dispatch({ type: "SET_USER", payload: { name, role } });
    },
    [dispatch],
  );

  const handleSelectShop = useCallback((shop: Shop) => {
    setSelectedShop(shop);
    setCustomerView("shop");
  }, []);

  const handleJoinQueue = useCallback(
    (services: Service[]) => {
      if (!selectedShop || !user) return;
      const queueLength = getShopQueueLength(selectedShop);
      const currentWait = getShopWaitTime(selectedShop);
      const duration = services.reduce((sum, s) => sum + s.duration, 0);
      const ticket: CustomerTicket = {
        id: `ticket-${Date.now()}`,
        shopId: selectedShop.id,
        visibleId: queueLength + 1,
        customerName: user.name,
        services,
        position: queueLength + 1,
        estimatedWait: currentWait + duration,
        hasArrived: false,
        joinedAt: new Date(),
      };
      dispatch({ type: "JOIN_QUEUE", payload: ticket });
      setCustomerView("ticket");
    },
    [dispatch, selectedShop, user],
  );

  const handleLeaveQueue = useCallback(() => {
    const shopName =
      state.shops.find((s) => s.id === activeTicket?.shopId)?.name ?? "";
    dispatch({ type: "LEAVE_QUEUE" });
    setReviewShopName(shopName);
    setCustomerView("review");
  }, [dispatch, state.shops, activeTicket]);

  // Not signed in -> welcome
  if (!user) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  // Barber flow
  if (user.role === "barber") {
    return (
      <AnimatePresence mode="wait">
        {barberView === "dashboard" && (
          <BarberDashboard
            key="barber-dashboard"
            shopId={barberShopId}
            barberId={barberId}
            onProfile={() => setBarberView("profile")}
            onLeaderboard={() => setBarberView("leaderboard")}
          />
        )}
        {barberView === "profile" && (
          <BarberProfile
            key="barber-profile"
            shopId={barberShopId}
            barberId={barberId}
            onBack={() => setBarberView("dashboard")}
          />
        )}
        {barberView === "leaderboard" && (
          <Leaderboard
            key="leaderboard"
            onBack={() => setBarberView("dashboard")}
          />
        )}
      </AnimatePresence>
    );
  }

  // Shop owner dashboard is the next roadmap item; owners temporarily use the
  // customer browsing view to monitor shops until it is built.

  // Customer flow
  const activeTicketShop = activeTicket
    ? state.shops.find((s) => s.id === activeTicket.shopId)
    : null;

  // If a ticket is restored from storage while we're on a neutral view, show it.
  const effectiveCustomerView =
    activeTicket && activeTicketShop && customerView === "home"
      ? "ticket"
      : customerView;

  return (
    <AnimatePresence mode="wait">
      {effectiveCustomerView === "home" && (
        <CustomerHome key="customer-home" onSelectShop={handleSelectShop} />
      )}

      {effectiveCustomerView === "shop" && selectedShop && (
        <ShopDetail
          key="shop-detail"
          shop={state.shops.find((s) => s.id === selectedShop.id) ?? selectedShop}
          onBack={() => setCustomerView("home")}
          onJoinQueue={handleJoinQueue}
        />
      )}

      {effectiveCustomerView === "ticket" && activeTicket && activeTicketShop && (
        <LiveTicket
          key="live-ticket"
          ticket={activeTicket}
          shop={activeTicketShop}
          onArrived={() => dispatch({ type: "MARK_ARRIVED" })}
          onLeave={handleLeaveQueue}
        />
      )}

      {effectiveCustomerView === "review" && (
        <ReviewScreen
          key="review"
          shopName={reviewShopName}
          onSubmit={() => setCustomerView("home")}
          onSkip={() => setCustomerView("home")}
        />
      )}
    </AnimatePresence>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
