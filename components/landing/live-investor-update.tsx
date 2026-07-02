"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type InvestorUpdate = {
  investor: string;
  country: string;
  amount: number;
};

const updates: InvestorUpdate[] = [
  { investor: "Rahim", country: "Bangladesh", amount: 800 },
  { investor: "James", country: "United Kingdom", amount: 2400 },
  { investor: "Sophia", country: "Canada", amount: 5000 },
  { investor: "Aisha", country: "UAE", amount: 1250 },
  { investor: "Daniel", country: "Germany", amount: 3600 },
  { investor: "Amaka", country: "Nigeria", amount: 9200 },
  { investor: "Mateo", country: "Spain", amount: 1750 },
  { investor: "Luca", country: "Italy", amount: 6800 },
  { investor: "Nora", country: "Sweden", amount: 4300 },
  { investor: "Victor", country: "South Africa", amount: 2100 },
  { investor: "Ethan", country: "Australia", amount: 7400 },
  { investor: "Mina", country: "Japan", amount: 3150 },
];

export function LiveInvestorUpdate() {
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
    [current.amount]
  );

  return (
    <div className="min-h-[82px]">
      <p className="text-xs text-muted">Live investor update</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.investor}-${current.country}-${current.amount}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-1"
        >
          <p className="text-sm">
            Investor <span className="font-medium">{current.investor}</span> from{" "}
            <span className="font-medium">{current.country}</span> completed a withdrawal of
          </p>
          <p className="text-xl font-semibold text-accent">{amount}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
