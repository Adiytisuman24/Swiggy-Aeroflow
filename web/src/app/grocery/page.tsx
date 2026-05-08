"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBasket,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  Sparkles,
  TrendingDown,
} from "lucide-react";

interface ForecastItem {
  item: string;
  category: string;
  days_until_depletion: number;
  predicted_date: string;
  urgency: "critical" | "soon" | "ok";
  auto_order: boolean;
}

const mockForecasts: ForecastItem[] = [
  { item: "Milk", category: "dairy", days_until_depletion: 1, predicted_date: "2026-05-09", urgency: "critical", auto_order: true },
  { item: "Butter", category: "dairy", days_until_depletion: 1, predicted_date: "2026-05-09", urgency: "critical", auto_order: true },
  { item: "Eggs", category: "protein", days_until_depletion: 2, predicted_date: "2026-05-10", urgency: "critical", auto_order: true },
  { item: "Bread", category: "grains", days_until_depletion: 3, predicted_date: "2026-05-11", urgency: "soon", auto_order: false },
  { item: "Protein Powder", category: "supplements", days_until_depletion: 6, predicted_date: "2026-05-14", urgency: "soon", auto_order: false },
  { item: "Rice 5kg", category: "grains", days_until_depletion: 7, predicted_date: "2026-05-15", urgency: "ok", auto_order: false },
  { item: "Coffee", category: "beverages", days_until_depletion: 12, predicted_date: "2026-05-20", urgency: "ok", auto_order: false },
];

const urgencyConfig = {
  critical: {
    label: "Critical",
    icon: <AlertTriangle className="w-4 h-4" />,
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    bar: "bg-red-400",
    card: "border-red-500/20",
  },
  soon: {
    label: "Running Low",
    icon: <Clock className="w-4 h-4" />,
    badge: "bg-amber-400/15 text-amber-400 border-amber-400/30",
    bar: "bg-amber-400",
    card: "border-amber-400/20",
  },
  ok: {
    label: "Stocked",
    icon: <CheckCircle className="w-4 h-4" />,
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    bar: "bg-emerald-400",
    card: "border-white/10",
  },
};

const categoryEmoji: Record<string, string> = {
  dairy: "🥛",
  protein: "🥚",
  grains: "🌾",
  beverages: "☕",
  supplements: "💪",
};

export default function GroceryPage() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>(mockForecasts);
  const [refreshing, setRefreshing] = useState(false);

  const critical = forecasts.filter((f) => f.urgency === "critical");
  const autoOrder = forecasts.filter((f) => f.auto_order);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setForecasts([...mockForecasts].sort(() => Math.random() - 0.5));
    setRefreshing(false);
  };

  const handleAutoOrder = (item: string) => {
    setForecasts((prev) =>
      prev.map((f) => f.item === item ? { ...f, auto_order: !f.auto_order } : f)
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> Predictive Replenishment
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-extrabold mb-2">
                Grocery <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Depletion Forecast</span>
              </h1>
              <p className="text-muted-foreground">
                Aeroflow predicts when your essentials run out — before you notice.
              </p>
            </div>
            <button
              id="refresh-forecast"
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-3 glass border border-white/10 rounded-2xl hover:bg-white/5 transition-all font-medium text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : ""}`} />
              {refreshing ? "Scanning..." : "Refresh Forecast"}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-6 border border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-red-400 w-5 h-5" />
              <span className="text-sm font-semibold text-red-400">Critical — Order Now</span>
            </div>
            <p className="text-4xl font-heading font-extrabold">{critical.length}</p>
            <p className="text-xs text-muted-foreground mt-1">items depleting within 2 days</p>
          </div>
          <div className="glass-card p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-primary w-5 h-5" />
              <span className="text-sm font-semibold text-primary">Auto-Ordering</span>
            </div>
            <p className="text-4xl font-heading font-extrabold">{autoOrder.length}</p>
            <p className="text-xs text-muted-foreground mt-1">items queued for auto-replenish</p>
          </div>
          <div className="glass-card p-6 border border-emerald-400/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="text-emerald-400 w-5 h-5" />
              <span className="text-sm font-semibold text-emerald-400">AI Savings Est.</span>
            </div>
            <p className="text-4xl font-heading font-extrabold">₹124</p>
            <p className="text-xs text-muted-foreground mt-1">vs reactive impulse buying</p>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="space-y-3">
          {forecasts.map((item, i) => {
            const cfg = urgencyConfig[item.urgency];
            const stockPercent = Math.min(100, Math.max(5, (item.days_until_depletion / 14) * 100));
            return (
              <motion.div
                key={item.item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card p-5 border ${cfg.card} flex items-center gap-5`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0 border border-white/10">
                  {categoryEmoji[item.category] || "🛒"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold">{item.item}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Depletes in <span className="font-bold text-foreground">{item.days_until_depletion} day{item.days_until_depletion !== 1 ? "s" : ""}</span> — {item.predicted_date}
                  </p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPercent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.04 + 0.2 }}
                      className={`h-full rounded-full ${cfg.bar}`}
                    />
                  </div>
                </div>

                <button
                  id={`auto-order-${item.item.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => handleAutoOrder(item.item)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    item.auto_order
                      ? "bg-primary/15 border-primary/30 text-primary"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <ShoppingBasket className="w-3.5 h-3.5" />
                  {item.auto_order ? "Auto-Order ON" : "Auto-Order"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
