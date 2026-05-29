"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { AppState, Role, Shop, CustomerTicket, Service, QueueEntry, Barber } from "./types";
import { DEFAULT_SERVICES } from "./types";

// Initial shop data
const INITIAL_SHOPS: Shop[] = [
  {
    id: "shop-1",
    name: "Royal Cuts",
    area: "Dharampeth",
    city: "Nagpur",
    distance: 0.7,
    rating: 4.8,
    reviewCount: 156,
    photo: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=60",
    wallet: 500,
    isActive: true,
    isPaused: false,
    services: DEFAULT_SERVICES,
    barbers: [
      {
        id: "barber-1",
        name: "Raj Kumar",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
        shopId: "shop-1",
        queue: [
          {
            id: "q1",
            visibleId: 1,
            customerName: "Aarav",
            services: [DEFAULT_SERVICES[0]],
            totalDuration: 25,
            joinedAt: new Date(Date.now() - 10 * 60000),
            isWalkIn: false,
            hasArrived: true,
          },
          {
            id: "q2",
            visibleId: 2,
            customerName: "Kabir",
            services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[1]],
            totalDuration: 37,
            joinedAt: new Date(Date.now() - 5 * 60000),
            isWalkIn: false,
            hasArrived: false,
          },
        ],
        isActive: true,
        totalServed: 234,
        appCustomers: 89,
        walkInCustomers: 145,
        rating: 4.9,
        reviewCount: 78,
        portfolio: [
          "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=60",
        ],
        tokensEarned: 350,
        tasks: [
          { id: "t1", title: "Upload profile photo", tokens: 50, completed: true },
          { id: "t2", title: "Add 3 portfolio photos", tokens: 100, completed: true, progress: 3, target: 3 },
          { id: "t3", title: "Share on WhatsApp", tokens: 150, completed: false },
          { id: "t4", title: "Serve first 5 app customers", tokens: 200, completed: true, progress: 5, target: 5 },
          { id: "t5", title: "Refer another barber", tokens: 500, completed: false },
        ],
      },
    ],
  },
  {
    id: "shop-2",
    name: "Fresh Fade Studio",
    area: "Sadar",
    city: "Nagpur",
    distance: 1.2,
    rating: 4.6,
    reviewCount: 89,
    photo: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=60",
    wallet: 72,
    isActive: true,
    isPaused: false,
    services: DEFAULT_SERVICES,
    barbers: [
      {
        id: "barber-2",
        name: "Vikram Singh",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60",
        shopId: "shop-2",
        queue: [
          {
            id: "q3",
            visibleId: 1,
            customerName: "Nikhil",
            services: [DEFAULT_SERVICES[1]],
            totalDuration: 12,
            joinedAt: new Date(Date.now() - 3 * 60000),
            isWalkIn: false,
            hasArrived: true,
          },
        ],
        isActive: true,
        totalServed: 167,
        appCustomers: 45,
        walkInCustomers: 122,
        rating: 4.7,
        reviewCount: 56,
        portfolio: [
          "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1620331311520-246422f11cf5?w=400&auto=format&fit=crop&q=60",
        ],
        tokensEarned: 150,
        tasks: [
          { id: "t1", title: "Upload profile photo", tokens: 50, completed: true },
          { id: "t2", title: "Add 3 portfolio photos", tokens: 100, completed: false, progress: 2, target: 3 },
          { id: "t3", title: "Share on WhatsApp", tokens: 150, completed: false },
          { id: "t4", title: "Serve first 5 app customers", tokens: 200, completed: false, progress: 3, target: 5 },
          { id: "t5", title: "Refer another barber", tokens: 500, completed: false },
        ],
      },
    ],
  },
  {
    id: "shop-3",
    name: "Classic Gents",
    area: "Pratap Nagar",
    city: "Nagpur",
    distance: 1.9,
    rating: 4.7,
    reviewCount: 203,
    photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=60",
    wallet: 0,
    isActive: false,
    isPaused: false,
    services: DEFAULT_SERVICES,
    barbers: [
      {
        id: "barber-3",
        name: "Mohammed Ali",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60",
        shopId: "shop-3",
        queue: [
          {
            id: "q4",
            visibleId: 1,
            customerName: "Aman",
            services: [DEFAULT_SERVICES[0]],
            totalDuration: 25,
            joinedAt: new Date(Date.now() - 20 * 60000),
            isWalkIn: false,
            hasArrived: true,
          },
          {
            id: "q5",
            visibleId: 2,
            customerName: "Sahil",
            services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[2]],
            totalDuration: 40,
            joinedAt: new Date(Date.now() - 15 * 60000),
            isWalkIn: false,
            hasArrived: false,
          },
          {
            id: "q6",
            visibleId: 3,
            customerName: "Dev",
            services: [DEFAULT_SERVICES[0], DEFAULT_SERVICES[1]],
            totalDuration: 37,
            joinedAt: new Date(Date.now() - 8 * 60000),
            isWalkIn: false,
            hasArrived: false,
          },
        ],
        isActive: false,
        totalServed: 312,
        appCustomers: 123,
        walkInCustomers: 189,
        rating: 4.8,
        reviewCount: 134,
        portfolio: [
          "https://images.unsplash.com/photo-1593702288056-7927b442d0fa?w=400&auto=format&fit=crop&q=60",
        ],
        tokensEarned: 500,
        tasks: [
          { id: "t1", title: "Upload profile photo", tokens: 50, completed: true },
          { id: "t2", title: "Add 3 portfolio photos", tokens: 100, completed: false, progress: 1, target: 3 },
          { id: "t3", title: "Share on WhatsApp", tokens: 150, completed: true },
          { id: "t4", title: "Serve first 5 app customers", tokens: 200, completed: true, progress: 5, target: 5 },
          { id: "t5", title: "Refer another barber", tokens: 500, completed: false },
        ],
      },
    ],
  },
];

const INITIAL_STATE: AppState = {
  user: null,
  activeTicket: null,
  shops: INITIAL_SHOPS,
};

type Action =
  | { type: "SET_USER"; payload: { name: string; role: Role } }
  | { type: "CLEAR_USER" }
  | { type: "JOIN_QUEUE"; payload: CustomerTicket }
  | { type: "LEAVE_QUEUE" }
  | { type: "MARK_ARRIVED" }
  | { type: "FINISH_CURRENT"; payload: { shopId: string; barberId: string } }
  | { type: "ADD_WALKIN"; payload: { shopId: string; barberId: string } }
  | { type: "ADD_TIME"; payload: { shopId: string; barberId: string; minutes: number } }
  | { type: "TOGGLE_PAUSE"; payload: { shopId: string } }
  | { type: "TOGGLE_SHOP_ACTIVE"; payload: { shopId: string } }
  | { type: "UPDATE_TICKET_POSITION" }
  | { type: "LOAD_STATE"; payload: AppState };

function calculateWaitTime(queue: QueueEntry[], position: number): number {
  let wait = 0;
  for (let i = 0; i < position; i++) {
    wait += queue[i]?.totalDuration || 0;
  }
  return wait;
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "CLEAR_USER":
      return { ...state, user: null, activeTicket: null };

    case "JOIN_QUEUE": {
      const ticket = action.payload;
      const newShops = state.shops.map((shop) => {
        if (shop.id !== ticket.shopId) return shop;
        return {
          ...shop,
          barbers: shop.barbers.map((barber, idx) => {
            if (idx !== 0) return barber; // Join first barber's queue
            const newEntry: QueueEntry = {
              id: ticket.id,
              visibleId: barber.queue.length + 1,
              customerName: ticket.customerName,
              services: ticket.services,
              totalDuration: ticket.services.reduce((sum, s) => sum + s.duration, 0),
              joinedAt: ticket.joinedAt,
              isWalkIn: false,
              hasArrived: false,
            };
            return { ...barber, queue: [...barber.queue, newEntry] };
          }),
        };
      });
      return { ...state, shops: newShops, activeTicket: ticket };
    }

    case "LEAVE_QUEUE": {
      if (!state.activeTicket) return state;
      const ticketId = state.activeTicket.id;
      const newShops = state.shops.map((shop) => ({
        ...shop,
        barbers: shop.barbers.map((barber) => ({
          ...barber,
          queue: barber.queue
            .filter((q) => q.id !== ticketId)
            .map((q, idx) => ({ ...q, visibleId: idx + 1 })),
        })),
      }));
      return { ...state, shops: newShops, activeTicket: null };
    }

    case "MARK_ARRIVED": {
      if (!state.activeTicket) return state;
      const ticketId = state.activeTicket.id;
      const newShops = state.shops.map((shop) => ({
        ...shop,
        barbers: shop.barbers.map((barber) => ({
          ...barber,
          queue: barber.queue.map((q) =>
            q.id === ticketId ? { ...q, hasArrived: true } : q
          ),
        })),
      }));
      return {
        ...state,
        shops: newShops,
        activeTicket: { ...state.activeTicket, hasArrived: true },
      };
    }

    case "FINISH_CURRENT": {
      const { shopId, barberId } = action.payload;
      let removedTicketId: string | null = null;
      const newShops = state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;
        return {
          ...shop,
          wallet: Math.max(0, shop.wallet - 4),
          isActive: shop.wallet - 4 > 0,
          barbers: shop.barbers.map((barber) => {
            if (barber.id !== barberId) return barber;
            const firstEntry = barber.queue[0];
            if (firstEntry) removedTicketId = firstEntry.id;
            const newQueue = barber.queue.slice(1).map((q, idx) => ({ ...q, visibleId: idx + 1 }));
            return {
              ...barber,
              queue: newQueue,
              totalServed: barber.totalServed + 1,
              appCustomers: firstEntry?.isWalkIn ? barber.appCustomers : barber.appCustomers + 1,
              walkInCustomers: firstEntry?.isWalkIn ? barber.walkInCustomers + 1 : barber.walkInCustomers,
            };
          }),
        };
      });
      // Check if the finished ticket was the user's active ticket
      let newActiveTicket = state.activeTicket;
      if (state.activeTicket && state.activeTicket.id === removedTicketId) {
        newActiveTicket = null;
      } else if (state.activeTicket && state.activeTicket.shopId === shopId) {
        // Update position
        const shop = newShops.find(s => s.id === shopId);
        const barber = shop?.barbers.find(b => b.id === barberId);
        const queueEntry = barber?.queue.find(q => q.id === state.activeTicket?.id);
        if (queueEntry) {
          const position = barber!.queue.indexOf(queueEntry) + 1;
          newActiveTicket = {
            ...state.activeTicket,
            position,
            estimatedWait: calculateWaitTime(barber!.queue, position - 1),
          };
        }
      }
      return { ...state, shops: newShops, activeTicket: newActiveTicket };
    }

    case "ADD_WALKIN": {
      const { shopId, barberId } = action.payload;
      const walkInCount = Math.floor(Math.random() * 1000);
      const newShops = state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;
        return {
          ...shop,
          barbers: shop.barbers.map((barber) => {
            if (barber.id !== barberId) return barber;
            const newEntry: QueueEntry = {
              id: `walkin-${Date.now()}`,
              visibleId: barber.queue.length + 1,
              customerName: `Walk-in ${walkInCount}`,
              services: [shop.services[0]],
              totalDuration: 25,
              joinedAt: new Date(),
              isWalkIn: true,
              hasArrived: true,
            };
            return { ...barber, queue: [...barber.queue, newEntry] };
          }),
        };
      });
      return { ...state, shops: newShops };
    }

    case "ADD_TIME": {
      const { shopId, barberId, minutes } = action.payload;
      const newShops = state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;
        return {
          ...shop,
          barbers: shop.barbers.map((barber) => {
            if (barber.id !== barberId || barber.queue.length === 0) return barber;
            const newQueue = [...barber.queue];
            newQueue[0] = {
              ...newQueue[0],
              totalDuration: newQueue[0].totalDuration + minutes,
            };
            return { ...barber, queue: newQueue };
          }),
        };
      });
      // Update active ticket wait time
      let newActiveTicket = state.activeTicket;
      if (state.activeTicket && state.activeTicket.shopId === shopId) {
        const shop = newShops.find(s => s.id === shopId);
        const barber = shop?.barbers.find(b => b.id === barberId);
        if (barber) {
          const position = state.activeTicket.position;
          newActiveTicket = {
            ...state.activeTicket,
            estimatedWait: calculateWaitTime(barber.queue, position - 1),
          };
        }
      }
      return { ...state, shops: newShops, activeTicket: newActiveTicket };
    }

    case "TOGGLE_PAUSE": {
      const { shopId } = action.payload;
      const newShops = state.shops.map((shop) =>
        shop.id === shopId ? { ...shop, isPaused: !shop.isPaused } : shop
      );
      return { ...state, shops: newShops };
    }

    case "TOGGLE_SHOP_ACTIVE": {
      const { shopId } = action.payload;
      const newShops = state.shops.map((shop) =>
        shop.id === shopId ? { ...shop, isActive: !shop.isActive } : shop
      );
      return { ...state, shops: newShops };
    }

    case "UPDATE_TICKET_POSITION": {
      if (!state.activeTicket) return state;
      const shop = state.shops.find(s => s.id === state.activeTicket!.shopId);
      const barber = shop?.barbers[0];
      const queueEntry = barber?.queue.find(q => q.id === state.activeTicket!.id);
      if (!queueEntry || !barber) return state;
      const position = barber.queue.indexOf(queueEntry) + 1;
      return {
        ...state,
        activeTicket: {
          ...state.activeTicket,
          position,
          estimatedWait: calculateWaitTime(barber.queue, position - 1),
        },
      };
    }

    case "LOAD_STATE":
      return action.payload;

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const STORAGE_KEY = "trimq-state";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Rehydrate dates
        if (parsed.activeTicket?.joinedAt) {
          parsed.activeTicket.joinedAt = new Date(parsed.activeTicket.joinedAt);
        }
        parsed.shops?.forEach((shop: Shop) => {
          shop.barbers?.forEach((barber: Barber) => {
            barber.queue?.forEach((q: QueueEntry) => {
              q.joinedAt = new Date(q.joinedAt);
            });
          });
        });
        dispatch({ type: "LOAD_STATE", payload: parsed });
      } catch (e) {
        console.error("Failed to load state from localStorage", e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Helper hooks
export function useShops() {
  const { state } = useApp();
  return state.shops;
}

export function useShop(shopId: string) {
  const { state } = useApp();
  return state.shops.find(s => s.id === shopId);
}

export function useActiveTicket() {
  const { state } = useApp();
  return state.activeTicket;
}

export function useUser() {
  const { state } = useApp();
  return state.user;
}

export function getShopWaitTime(shop: Shop): number {
  return shop.barbers.reduce((total, barber) => {
    return total + barber.queue.reduce((sum, q) => sum + q.totalDuration, 0);
  }, 0);
}

export function getShopQueueLength(shop: Shop): number {
  return shop.barbers.reduce((total, barber) => total + barber.queue.length, 0);
}
