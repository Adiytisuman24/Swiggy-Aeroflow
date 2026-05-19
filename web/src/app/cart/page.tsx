"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Zap,
  Brain,
  CheckCircle,
  RefreshCw,
  Sparkles,
  TrendingDown,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  tag: "predicted" | "added" | "auto-replenish";
  nutrition: string;
}

const tagStyle: Record<CartItem["tag"], string> = {
  predicted: "bg-primary/15 text-primary border-primary/30",
  added: "bg-secondary/15 text-secondary border-secondary/30",
  "auto-replenish": "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
};

const tagLabel: Record<CartItem["tag"], string> = {
  predicted: "AI Predicted",
  added: "Added by You",
  "auto-replenish": "Auto-Replenish",
};

export default function CartPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const [items, setItems] = useState<CartItem[]>([]);
  const [aiPulse, setAiPulse] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cart`);
        if (res.ok) {
          const data = await res.json();
          setItems(data || []);
        }
      } catch (e) {
        console.error("Cart fetch error:", e);
      }
    };
    fetchCart();
  }, [API_BASE]);

  const updateQty = async (id: string, delta: number) => {
    const targetItem = items.find(i => i.id === id);
    if (!targetItem) return;

    const newQty = targetItem.quantity + delta;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      ).filter((item) => item.quantity > 0)
    );

    try {
      const res = await fetch(`${API_BASE}/api/cart/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQty })
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } catch (e) {
      console.error("Update qty error:", e);
    }
  };

  const removeItem = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } catch (e) {
      console.error("Remove item error:", e);
    }
  };

  const refresh = async () => {
    setAiPulse(true);
    try {
      const newItem = {
        name: "Protein Shake",
        restaurant: "Swiggy Instamart",
        price: 129,
        quantity: 1,
        tag: "predicted",
        nutrition: "Protein: 25g | Cal: 130"
      };

      const res = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } catch (e) {
      console.error("Refresh AI error:", e);
    } finally {
      setTimeout(() => {
        setAiPulse(false);
      }, 800);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = Math.floor(total * 0.12);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-sm font-semibold mb-3">
              <Sparkles className="w-4 h-4" /> Living Cart
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-extrabold">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dynamic Cart</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Continuously evolving based on your routines, nutrition, and patterns.
            </p>
          </div>
          <button
            id="refresh-ai"
            onClick={refresh}
            className="flex items-center gap-2 px-5 py-3 glass border border-white/10 rounded-2xl hover:bg-white/5 transition-all font-medium text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${aiPulse ? "animate-spin text-primary" : ""}`} />
            {aiPulse ? "AI Updating..." : "Refresh AI"}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl flex-shrink-0">
                    🍽️
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm">{item.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagStyle[item.tag]}`}>
                        {tagLabel[item.tag]}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">{item.restaurant}</div>
                    <div className="text-xs text-muted-foreground/70 font-mono">{item.nutrition}</div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 glass rounded-xl px-2 py-1 border border-white/10">
                      <button id={`minus-${item.id}`} onClick={() => updateQty(item.id, -1)} className="text-muted-foreground hover:text-white transition-colors p-1">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                      <button id={`plus-${item.id}`} onClick={() => updateQty(item.id, 1)} className="text-muted-foreground hover:text-white transition-colors p-1">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-sm w-16 text-right">₹{item.price * item.quantity}</span>
                    <button id={`remove-${item.id}`} onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="glass-card p-16 text-center border-dashed border-white/10">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground">Cart is empty. AI will repopulate based on your routine.</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* AI Insight */}
            <div className="glass-card p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="text-primary w-5 h-5" />
                <span className="font-bold text-sm">AI Insight</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on your evening schedule and low milk stock, Aeroflow added auto-replenishment items. Confidence: <span className="text-primary font-bold">91.3%</span>
              </p>
            </div>

            {/* Summary */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-lg">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span className="flex items-center gap-1"><TrendingDown className="w-3 h-3" /> AI Savings</span>
                  <span>-₹{savings}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total - savings}</span>
                </div>
              </div>

              <button id="place-order" className="w-full py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(252,128,25,0.4)] transition-all">
                <Zap className="w-5 h-5 fill-current" />
                Place Order
              </button>

              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Aeroflow-optimized for best ETA
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
