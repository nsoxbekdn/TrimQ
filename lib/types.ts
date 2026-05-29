export type Role = "customer" | "barber" | "owner";

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  icon: string;
}

export interface QueueEntry {
  id: string;
visibleId: number;
  customerName: string;
  services: Service[];
  totalDuration: number;
  joinedAt: Date;
  isWalkIn: boolean;
  hasArrived: boolean;
}

export interface Barber {
  id: string;
  name: string;
  photo: string;
  shopId: string;
  queue: QueueEntry[];
  isActive: boolean;
  totalServed: number;
  appCustomers: number;
  walkInCustomers: number;
  rating: number;
  reviewCount: number;
  portfolio: string[];
  tokensEarned: number;
  tasks: TokenTask[];
}

export interface TokenTask {
  id: string;
  title: string;
  tokens: number;
  completed: boolean;
  progress?: number;
  target?: number;
}

export interface Shop {
  id: string;
  name: string;
  area: string;
  city: string;
  distance: number;
  rating: number;
  reviewCount: number;
  photo: string;
  wallet: number;
  isActive: boolean;
  isPaused: boolean;
  barbers: Barber[];
  services: Service[];
}

export interface CustomerTicket {
  id: string;
  shopId: string;
  visibleId: number;
  customerName: string;
  services: Service[];
  position: number;
  estimatedWait: number;
  hasArrived: boolean;
  joinedAt: Date;
}

export interface AppState {
  user: {
    name: string;
    role: Role;
  } | null;
  activeTicket: CustomerTicket | null;
  shops: Shop[];
}

export const DEFAULT_SERVICES: Service[] = [
  { id: "haircut", name: "Haircut", duration: 25, price: 150, icon: "scissors" },
  { id: "beard", name: "Beard trim", duration: 12, price: 80, icon: "razor" },
  { id: "massage", name: "Head massage", duration: 15, price: 100, icon: "massage" },
  { id: "color", name: "Hair color", duration: 40, price: 350, icon: "palette" },
];
