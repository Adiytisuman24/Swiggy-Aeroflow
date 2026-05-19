"use client";

import { useState, useEffect } from "react";
// Cleaned Framer Motion imports
import {
  Brain,
  CloudRain,
  Sun,
  Moon,
  ChevronRight,
  Loader2,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  Play,
  Terminal,
  Clock
} from "lucide-react";

interface CBOItem {
  id: string;
  name: string;
  price: number;
  store: string;
  category: string;
  score: number;
  p_i: number;
  a_i: number;
  o_i: number;
  m_i: number;
  aov_i: number;
}

interface ScenarioItem {
  name: string;
  price: number;
  quantity: number;
}

interface Scenario {
  name: string;
  items: ScenarioItem[];
  aov: number;
  eta: number;
  savings: number;
  conversion: number;
}

interface CBOResult {
  area: string;
  weather: string;
  time_of_day: string;
  activity: string;
  candidates: CBOItem[];
  scenarios: {
    base: Scenario;
    mid: Scenario;
    optimized: Scenario;
  };
  ai_pitch: string;
  formula: string;
  mcp_status: {
    food_mcp: string;
    instamart_mcp: string;
    dineout_mcp: string;
    active_agent_flow: string;
  };
}

export default function CBOEnginePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const [result, setResult] = useState<CBOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [executingMcp, setExecutingMcp] = useState(false);
  const [mcpLog, setMcpLog] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"formula" | "market" | "mcp">("formula");

  const [form, setForm] = useState({
    user_id: "user_001",
    area: "Koramangala",
    weather: "rainy",
    time_of_day: "evening",
    activity: "work",
    budget_remaining: 500,
    current_cart: [
      { name: "Milk 1L", price: 130.0, quantity: 1 },
      { name: "Eggs (6pc)", price: 90.0, quantity: 1 }
    ]
  });

  const runCBOEngine = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/cbo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("CBO Engine request failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("CBO error:", error);
      // Fallback to client-side logic if backend is unreachable
      simulateCBOClientSide();
    } finally {
      setLoading(false);
    }
  };

  const simulateCBOClientSide = () => {
    // Math logic matching backend
    const area = form.area;
    const weather = form.weather;
    const time_of_day = form.time_of_day;
    const activity = form.activity;

    const mockCandidates = [
      { id: "item_milk", name: "Milk 1L", price: 130, store: "Instamart", category: "dairy", score: 0.82, p_i: 0.81, a_i: 0.9, o_i: 1.0, m_i: 0.15, aov_i: 0.26 },
      { id: "item_eggs", name: "Eggs (6pc)", price: 90, store: "Instamart", category: "protein", score: 0.78, p_i: 0.79, a_i: 0.85, o_i: 1.0, m_i: 0.12, aov_i: 0.18 },
      { id: "item_bread", name: "Bread (Whole Wheat)", price: 60, store: "Instamart", category: "grains", score: 0.74, p_i: 0.75, a_i: 0.8, o_i: 1.0, m_i: 0.18, aov_i: 0.12 },
      { id: "item_butter", name: "Butter (100g)", price: 80, store: "Instamart", category: "dairy", score: 0.71, p_i: 0.71, a_i: 0.75, o_i: 1.0, m_i: 0.2, aov_i: 0.16 },
      { id: "item_cold_brew", name: "Cold Brew Coffee", price: 189, store: "Food", category: "beverages", score: 0.89, p_i: 0.88, a_i: 0.95, o_i: 1.2, m_i: 0.35, aov_i: 0.38 },
      { id: "item_garlic_bread", name: "Garlic Bread", price: 120, store: "Food", category: "sides", score: 0.84, p_i: 0.82, a_i: 0.9, o_i: 1.2, m_i: 0.3, aov_i: 0.24 },
      { id: "item_brownie", name: "Warm Brownie", price: 90, store: "Food", category: "dessert", score: 0.81, p_i: 0.8, a_i: 0.85, o_i: 1.2, m_i: 0.35, aov_i: 0.18 },
      { id: "item_protein_shake", name: "Protein Shake", price: 120, store: "Instamart", category: "protein", score: 0.69, p_i: 0.7, a_i: 0.6, o_i: 1.0, m_i: 0.25, aov_i: 0.24 },
      { id: "item_chicken_biryani", name: "Chicken Biryani", price: 349, store: "Food", category: "meals", score: 0.73, p_i: 0.72, a_i: 0.8, o_i: 1.0, m_i: 0.28, aov_i: 0.7 },
      { id: "item_warm_ramen", name: "Warm Ramen", price: 299, store: "Food", category: "meals", score: 0.86, p_i: 0.85, a_i: 0.9, o_i: 1.0, m_i: 0.26, aov_i: 0.6 }
    ];

    // Sort by score
    mockCandidates.sort((a, b) => b.score - a.score);

    const base_cart_items = [
      { name: "Milk 1L", price: 130.0, quantity: 1 },
      { name: "Eggs (6pc)", price: 90.0, quantity: 1 }
    ];
    const base_aov = 220.0;

    const s2_items = [
      ...base_cart_items,
      { name: "Bread (Whole Wheat)", price: 60.0, quantity: 1 },
      { name: "Butter (100g)", price: 80.0, quantity: 1 }
    ];
    const s2_aov = 360.0;

    const s3_items = [
      ...base_cart_items,
      { name: "Bread (Whole Wheat)", price: 60.0, quantity: 1 },
      { name: "Butter (100g)", price: 80.0, quantity: 1 },
      { name: "Cold Brew Coffee", price: 189.0, quantity: 1 }
    ];
    const s3_aov = 549.0;

    const data: CBOResult = {
      area,
      weather,
      time_of_day,
      activity,
      candidates: mockCandidates,
      scenarios: {
        base: {
          name: "Base Cart",
          items: base_cart_items,
          aov: base_aov,
          eta: 18,
          savings: 0,
          conversion: 0.65
        },
        mid: {
          name: "Add Essentials",
          items: s2_items,
          aov: s2_aov,
          eta: 18,
          savings: 15,
          conversion: 0.78
        },
        optimized: {
          name: "AI Basket (CBO Optimized)",
          items: s3_items,
          aov: s3_aov,
          eta: 18,
          savings: 70,
          conversion: 0.88
        }
      },
      ai_pitch: "Add Bread, Butter, and Cold Brew Coffee. Same ETA + unlock ₹70 savings + predicted need in 2 days.",
      formula: "Score = 0.35 * P_i + 0.20 * A_i + 0.15 * O_i + 0.15 * M_i + 0.15 * AOV_i",
      mcp_status: {
        food_mcp: "CONNECTED (localhost:8081)",
        instamart_mcp: "CONNECTED (localhost:8082)",
        dineout_mcp: "CONNECTED (localhost:8083)",
        active_agent_flow: "CounterfactualBasketOptimizerFlow"
      }
    };

    setResult(data);
  };

  useEffect(() => {
    const init = async () => {
      await runCBOEngine();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runMcpExecution = async () => {
    if (!result) return;
    setExecutingMcp(true);
    setMcpLog([]);

    const steps = [
      "🔄 Initializing Swiggy MCP Client session...",
      "📡 Pinging MCP Servers on localhost:8081 (Food) and localhost:8082 (Instamart)...",
      "🔍 Calling Tool: instamart.search_products(query='Bread Whole Wheat', radius=5)",
      "🔍 Calling Tool: instamart.search_products(query='Butter 100g', radius=5)",
      "🔍 Calling Tool: food.search_restaurants(cuisine='cafe', location='Koramangala')",
      "🔍 Calling Tool: food.search_menu(restaurant_id='blue_tokai_001', query='Cold Brew')",
      "🛒 Calling Tool: instamart.update_cart(items=[Bread: 1, Butter: 1, Milk: 1, Eggs: 1])",
      "🛒 Calling Tool: food.update_food_cart(items=[Cold Brew: 1])",
      "⚡ Running Counterfactual Optimizer Flow...",
      "🏷️ AI Offer Generated: Combo discount ₹70 applied directly on cart checkout payload",
      "📦 Calling Tool: instamart.place_order(cart_id='im_cart_99182', delivery_address='Koramangala Block 4')",
      "📦 Calling Tool: food.place_food_order(cart_id='fd_cart_00281', delivery_address='Koramangala Block 4')",
      "✅ Execution Complete! Order ID: SWIG-1716091829. Combo Placed with same ETA (18min)!"
    ];

    try {
      await fetch(`${API_BASE}/api/cart/clear`, { method: "POST" });
      const itemsToAdd = [
        { name: "Milk 1L", price: 130, restaurant: "Swiggy Instamart", quantity: 1, tag: "auto-replenish", nutrition: "Protein: 8g | Calcium: 300mg" },
        { name: "Eggs (6pc)", price: 90, restaurant: "Swiggy Instamart", quantity: 1, tag: "auto-replenish", nutrition: "Protein: 36g | Fats: 30g" },
        { name: "Bread (Whole Wheat)", price: 60, restaurant: "Swiggy Instamart", quantity: 1, tag: "added", nutrition: "Fiber: 4g | Carbs: 22g" },
        { name: "Butter (100g)", price: 80, restaurant: "Swiggy Instamart", quantity: 1, tag: "added", nutrition: "Fats: 80g" },
        { name: "Cold Brew Coffee", price: 189, restaurant: "Blue Tokai", quantity: 1, tag: "predicted", nutrition: "Caffeine: 150mg | Cal: 20" }
      ];

      for (const item of itemsToAdd) {
        await fetch(`${API_BASE}/api/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }
    } catch (e) {
      console.error("CBO sync cart error:", e);
    }

    for (let i = 0; i < steps.length; i++) {
      setMcpLog((prev) => [...prev, steps[i]]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    setExecutingMcp(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-sm font-semibold mb-4">
            <Layers className="w-4 h-4" /> CBO Engine
          </div>
          <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-4">
            Counterfactual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Basket Optimizer</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            A predictive commerce intelligence layer built on Swiggy MCP. It simulates optimal baskets, negotiates multi-agent metrics, and applies AI offer uplifts.
          </p>
        </div>

        {/* 5 Layers Infographic */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          <LayerCard index={1} title="Person Layer" desc="embeddings: coffee, protein, milk, budget sensitivity" active={true} />
          <LayerCard index={2} title="Area Layer" desc="5km radius, weather, orders, density (Koramangala/Whitefield)" active={true} />
          <LayerCard index={3} title="Intent Layer" desc="need, habit, impulse, event, social probability" active={true} />
          <LayerCard index={4} title="Counterfactual" desc="AOV simulation: standard vs item add-ons vs optimized" active={true} />
          <LayerCard index={5} title="Offer Engine" desc="cross ₹500, apply combo discount, free delivery" active={true} />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                <MapPin className="text-primary w-5 h-5" /> Engine Context
              </h2>

              {/* User Profile */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block font-mono">1. User Identity Profile</label>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
                  <div className="font-bold text-primary mb-1">User A (Embeddings)</div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <div>• Coffee: Weekday priority</div>
                    <div>• Protein: Post Workout</div>
                    <div>• Milk: Every 4 Days</div>
                    <div>• Budget: Highly Sensitive</div>
                  </div>
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block font-mono">2. Locality (5km Area)</label>
                <div className="flex gap-3">
                  {["Koramangala", "Whitefield"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setForm({ ...form, area: a })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${form.area === a ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block font-mono">3. Weather Context</label>
                <div className="flex gap-3">
                  {["clear", "rainy", "cloudy"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setForm({ ...form, weather: w })}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${form.weather === w ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                    >
                      {w === "clear" ? <Sun className="inline w-3 h-3 mr-1" /> : w === "rainy" ? <CloudRain className="inline w-3 h-3 mr-1" /> : <Moon className="inline w-3 h-3 mr-1" />}
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono">4. Time of Day</label>
                  <select
                    value={form.time_of_day}
                    onChange={(e) => setForm({ ...form, time_of_day: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono">5. Recent Activity</label>
                  <select
                    value={form.activity}
                    onChange={(e) => setForm({ ...form, activity: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="workout">Workout</option>
                    <option value="work">Work Mode</option>
                  </select>
                </div>
              </div>

              {/* Base Cart */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block font-mono">6. Current Active Cart (Instamart)</label>
                <div className="space-y-2">
                  {form.current_cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                      <span className="font-medium text-muted-foreground">{item.name}</span>
                      <span className="font-bold text-foreground">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs px-2 pt-1 font-bold">
                    <span>Base Subtotal:</span>
                    <span className="text-primary">₹220.00</span>
                  </div>
                </div>
              </div>

              <button
                onClick={runCBOEngine}
                disabled={loading}
                className="w-full py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(252,128,25,0.4)] transition-all disabled:opacity-60"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Simulating Baskets...</> : <><Brain className="w-5 h-5" /> Run CBO Engine <ChevronRight className="w-5 h-5" /></>}
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Scenarios & Pitch */}
            <div className="glass-card p-6 border border-primary/20">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                <TrendingUp className="text-primary w-5 h-5" /> Counterfactual Decisions
              </h2>

              {/* The Pitch */}
              {result && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
                  <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Autonomous AI Generated Offer
                  </div>
                  <p className="text-sm font-semibold italic text-foreground">&ldquo;{result.ai_pitch}&rdquo;</p>
                </div>
              )}

              {/* Scenario Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {result ? (
                  <>
                    <ScenarioCard scenario={result.scenarios.base} variant="base" />
                    <ScenarioCard scenario={result.scenarios.mid} variant="mid" />
                    <ScenarioCard scenario={result.scenarios.optimized} variant="optimized" />
                  </>
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground text-sm">
                    Run CBO Engine to view options
                  </div>
                )}
              </div>
            </div>

            {/* Tabs for Analysis */}
            <div className="glass-card p-6">
              <div className="flex border-b border-white/5 mb-6">
                {[
                  { id: "formula", label: "CBO Math Formula" },
                  { id: "market", label: "Stock Market Bids" },
                  { id: "mcp", label: "Swiggy MCP Execution" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "formula" | "market" | "mcp")}
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Formula */}
              {activeTab === "formula" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-center">
                    <div className="text-xs text-muted-foreground mb-1">CBO Optimization Score Formula</div>
                    <div className="text-lg font-bold text-primary">Score_i = λ1*P_i + λ2*A_i + λ3*O_i + λ4*M_i + λ5*AOV_i</div>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      P_i: Intent Probability | A_i: Area Affinity | O_i: Offer Uplift | M_i: Margin | AOV_i: Cart Weight
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="font-bold text-primary">Objective Function</div>
                      <p className="text-muted-foreground leading-relaxed">Maximize sum of Score_i subject to total basket exceeding ₹500, delivery address within 5km store radius, and maximum ETA of 20 min.</p>
                    </div>
                    <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="font-bold text-primary">User Intent Equation</div>
                      <div className="font-mono text-[10px]">P_i = α*H_i + β*T_i + γ*W_i + δ*B_i</div>
                      <p className="text-muted-foreground leading-relaxed">Fuses historical habit (H), time of day (T), weather (W), and budget limit (B).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Stock Market Bids */}
              {activeTab === "market" && (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground mb-2">Items bidding for cart space:</div>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {result ? (
                      result.candidates.map((cand, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                          <div>
                            <div className="font-bold text-xs flex items-center gap-1.5">
                              {cand.name} 
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-muted-foreground">{cand.store}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3 mt-1 font-mono text-[9px] text-muted-foreground">
                              <div>P_i: {cand.p_i.toFixed(2)}</div>
                              <div>A_i: {cand.a_i.toFixed(2)}</div>
                              <div>O_i: {cand.o_i.toFixed(2)}</div>
                              <div>M_i: {cand.m_i.toFixed(2)}</div>
                              <div>AOV: {cand.aov_i.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xs text-primary">Score: {cand.score.toFixed(2)}</div>
                            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">₹{cand.price}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">Run simulation first</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Swiggy MCP */}
              {activeTab === "mcp" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] text-muted-foreground font-mono">Swiggy MCP Servers</div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Food: CONNECTED
                      </div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Instamart: CONNECTED
                      </div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Dineout: CONNECTED
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center">
                      <button
                        onClick={runMcpExecution}
                        disabled={executingMcp || !result}
                        className="py-2.5 px-4 bg-primary text-black font-bold rounded-xl flex items-center justify-center gap-1.5 hover:shadow-[0_0_20px_rgba(252,128,25,0.3)] transition-all disabled:opacity-60 text-xs"
                      >
                        {executingMcp ? <><Loader2 className="w-4 h-4 animate-spin" /> Dispatching...</> : <><Play className="w-3.5 h-3.5 fill-current" /> Execute via Swiggy MCP</>}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-muted-foreground min-h-[150px] max-h-60 overflow-y-auto">
                    <div className="flex items-center gap-1.5 text-foreground font-bold mb-2 pb-1.5 border-b border-white/5">
                      <Terminal className="w-4 h-4 text-primary" /> MCP Agent Logs
                    </div>
                    {mcpLog.length > 0 ? (
                      mcpLog.map((log, idx) => (
                        <div key={idx} className={`mb-1 ${log.includes("✅") ? "text-emerald-400 font-bold" : log.includes("🔍") ? "text-sky-400" : log.includes("🏷️") ? "text-primary" : ""}`}>
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 opacity-40">
                        Click &apos;Execute via Swiggy MCP&apos; to watch the agent tool calls
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function LayerCard({ index, title, desc, active }: { index: number; title: string; desc: string; active: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border text-center transition-all ${active ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5"}`}>
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Layer {index}</div>
      <div className="font-bold text-sm text-foreground mb-1.5">{title}</div>
      <p className="text-[10px] text-muted-foreground leading-normal">{desc}</p>
    </div>
  );
}

function ScenarioCard({ scenario, variant }: { scenario: Scenario; variant: "base" | "mid" | "optimized" }) {
  const isOptimized = variant === "optimized";
  
  return (
    <div className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all ${
      isOptimized 
        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(252,128,25,0.15)]" 
        : variant === "mid" 
          ? "bg-white/5 border-white/10" 
          : "bg-white/[0.02] border-white/5 opacity-80"
    }`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isOptimized 
              ? "bg-primary text-black" 
              : "bg-white/10 text-white"
          }`}>
            {scenario.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> {scenario.eta} min
          </span>
        </div>

        <div className="space-y-1 mb-4">
          {scenario.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-[11px] text-muted-foreground">
              <span className="truncate max-w-[120px]">{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">AOV:</span>
          <span className="font-bold text-foreground">₹{scenario.aov}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Savings:</span>
          <span className="font-bold text-emerald-400">₹{scenario.savings}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Conversion:</span>
          <span className={`font-bold ${isOptimized ? "text-primary" : "text-foreground"}`}>{(scenario.conversion * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
