import { create } from "zustand";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

type PlatformState = {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
};

const defaultNotifications: AppNotification[] = [
  {
    id: "1",
    title: "Deposit confirmed",
    body: "Your wallet deposit of $500.00 has been credited.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "EUR/USD price alert",
    body: "EUR to USD crossed 1.16450 on your watchlist.",
    time: "18 min ago",
    read: false,
  },
  {
    id: "3",
    title: "KYC reminder",
    body: "Complete verification to unlock higher withdrawal limits.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "4",
    title: "Plan maturity",
    body: "Your Silver plan reaches its review window in 3 days.",
    time: "Yesterday",
    read: true,
  },
];

export const usePlatformStore = create<PlatformState>((set) => ({
  notifications: defaultNotifications,
  unreadCount: defaultNotifications.filter((n) => !n.read).length,
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));
