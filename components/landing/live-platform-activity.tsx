"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type ActivityUpdate = {
  user: string;
  country: string;
  action: string;
  amount: number;
};

const updates: ActivityUpdate[] = [
  { user: "Rahim", country: "Bangladesh", action: "completed daily task", amount: 5 },
  { user: "James", country: "United Kingdom", action: "withdrew", amount: 2400 },
  { user: "Sophia", country: "Canada", action: "earned referral bonus", amount: 50 },
  { user: "Aisha", country: "UAE", action: "placed AI trade", amount: 1250 },
  { user: "Daniel", country: "Germany", action: "withdrew", amount: 3600 },
  { user: "Amaka", country: "Nigeria", action: "completed daily task", amount: 5 },
  { user: "Mateo", country: "Spain", action: "deposited", amount: 500 },
  { user: "Luca", country: "Italy", action: "withdrew", amount: 6800 },
];

export function LivePlatformActivity() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % updates.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  const current = useMemo(() => updates[index], [index]);
  const amount = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(current.amount),
    [current.amount],
  );

  return (
    <div className="min-h-[82px]">
      <p className="text-xs text-muted">Live platform activity</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.user}-${current.action}-${current.amount}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-1"
        >
          <p className="text-sm">
            <span className="font-medium">{current.user}</span> from{" "}
            <span className="font-medium">{current.country}</span> {current.action}
          </p>
          <p className="text-xl font-semibold text-accent">{amount}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
