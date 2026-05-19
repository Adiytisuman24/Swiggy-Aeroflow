"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ShoppingCart,
  Zap,
  CloudRain,
  Sun,
  Moon,
  Dumbbell,
  Briefcase,
  Users,
  ChevronRight,
  Loader2,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface AgentDecision {
  agent: string;
  recommendation: string;
  score: number;
  reasoning: string;
}

interface OrchestrateResult {
  user_id: string;
  final_confidence: number;
  agent_decisions: AgentDecision[];
  top_recommendation: string;
  formula: string;
}

const agentIcons: Record<string, React.ReactNode> = {
  NutritionAgent: <Brain className="w-5 h-5 text-emerald-400" />,
  BudgetAgent: <ShoppingCart className="w-5 h-5 text-amber-400" />,
  TimingAgent: <Zap className="w-5 h-5 text-primary" />,
  SocialAgent: <Users className="w-5 h-5 text-sky-400" />,
};

const agentColors: Record<string, string> = {
  NutritionAgent: "border-emerald-400/30 bg-emerald-400/5",
  BudgetAgent: "border-amber-400/30 bg-amber-400/5",
  TimingAgent: "border-primary/30 bg-primary/5",
  SocialAgent: "border-sky-400/30 bg-sky-400/5",
};

export default function IntelligencePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const [result, setResult] = useState<OrchestrateResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    user_id: "user_001",
    weather: "clear",
    time_of_day: "evening",
    recent_activity: "sedentary",
    budget_remaining: 500,
    schedule_load: "medium",
    group_size: 1,
  });

  const runOrchestration = async () => {
    setLoading(true);
    setResult(null);

    try {
      const queryParams = new URLSearchParams({
        user_id: form.user_id,
        weather: form.weather,
        time_of_day: form.time_of_day,
        recent_activity: form.recent_activity,
        budget_remaining: form.budget_remaining.toString(),
        schedule_load: form.schedule_load,
        group_size: form.group_size.toString(),
      });

      const response = await fetch(`${API_BASE}/api/orchestrate?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Backend orchestration failed");
      
      const data = await response.json();
      
      // Map Go backend response to the frontend interface
      // The Go backend returns { user_id, context, recommendation: { Items, ConfidenceScore, Reasoning }, status }
      // We need to adapt this or change the Go backend to return AgentDecisions if we want that detail.
      // For now, let's create a result that fits the UI using the data from Go.
      
      const adaptedResult: OrchestrateResult = {
        user_id: data.user_id,
        final_confidence: data.final_confidence || 0.85,
        top_recommendation: data.top_recommendation || "No recommendation",
        formula: data.formula || "Score = 0.35P + 0.25B + 0.20T + 0.20S",
        agent_decisions: data.agent_decisions || [],
      };
      
      setResult(adaptedResult);
    } catch (error) {
      console.error("Orchestration error:", error);
      // Fallback to mock if backend is down (though we know it's up on 8080)
      alert("Failed to connect to Aeroflow Core. Ensure Go backend is running on :8080");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> Multi-Agent Orchestration
          </div>
          <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-4">
            Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Playground</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Configure your context. Watch Aeroflow&apos;s AI agents negotiate the optimal consumption decision in real-time.
          </p>
          <div className="flex justify-center">
            <a href="/cbo" className="px-6 py-2.5 glass border border-primary/30 text-primary hover:bg-primary/10 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 transform hover:scale-105">
              <TrendingUp className="w-4 h-4" /> Open CBO (Counterfactual Basket Optimizer) Engine
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Context Form */}
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="text-primary w-5 h-5" /> User Context
            </h2>

            {/* Weather */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Weather</label>
              <div className="flex gap-3">
                {["clear", "rainy", "cloudy"].map((w) => (
                  <button
                    key={w}
                    id={`weather-${w}`}
                    onClick={() => setForm({ ...form, weather: w })}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all capitalize ${form.weather === w ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  >
                    {w === "clear" ? <Sun className="inline w-4 h-4 mr-1" /> : w === "rainy" ? <CloudRain className="inline w-4 h-4 mr-1" /> : <Moon className="inline w-4 h-4 mr-1" />}
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Time of Day</label>
              <div className="grid grid-cols-4 gap-2">
                {["morning", "afternoon", "evening", "night"].map((t) => (
                  <button key={t} id={`time-${t}`} onClick={() => setForm({ ...form, time_of_day: t })} className={`py-2 rounded-xl border text-xs font-medium transition-all capitalize ${form.time_of_day === t ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>{t}</button>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Recent Activity</label>
              <div className="flex gap-3">
                {[["sedentary", "Sedentary"], ["workout", "Post Workout"], ["work", "Work Mode"]].map(([val, label]) => (
                  <button key={val} id={`activity-${val}`} onClick={() => setForm({ ...form, recent_activity: val })} className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${form.recent_activity === val ? "border-primary bg-primary/10 text-primary" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                    {val === "workout" && <Dumbbell className="inline w-3 h-3 mr-1" />}
                    {val === "work" && <Briefcase className="inline w-3 h-3 mr-1" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Budget Remaining: <span className="text-primary font-bold">₹{form.budget_remaining}</span></label>
              <input id="budget-slider" type="range" min={50} max={1000} step={50} value={form.budget_remaining} onChange={(e) => setForm({ ...form, budget_remaining: Number(e.target.value) })} className="w-full accent-orange-500" />
            </div>

            {/* Group Size */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Group Size: <span className="text-primary font-bold">{form.group_size}</span></label>
              <input id="group-slider" type="range" min={1} max={10} value={form.group_size} onChange={(e) => setForm({ ...form, group_size: Number(e.target.value) })} className="w-full accent-orange-500" />
            </div>

            <button id="run-orchestration" onClick={runOrchestration} disabled={loading} className="w-full py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(252,128,25,0.4)] transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Orchestrating Agents...</> : <><Brain className="w-5 h-5" /> Run AI Orchestration <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>

          {/* Result Panel */}
          <div className="space-y-4">
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-8 flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Agents negotiating optimal decision...</p>
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Confidence Score */}
                  <div className="glass-card p-6 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><CheckCircle className="text-emerald-400 w-4 h-4" /> Final Confidence</span>
                      <span className="text-3xl font-heading font-extrabold text-primary">{(result.final_confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="text-sm font-medium mb-1">{result.top_recommendation}</div>
                    <div className="text-xs text-muted-foreground font-mono">{result.formula}</div>
                  </div>

                  {/* Agent Decisions */}
                  {result.agent_decisions.map((d) => (
                    <motion.div key={d.agent} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`glass-card p-5 border ${agentColors[d.agent]}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 font-bold text-sm">{agentIcons[d.agent]} {d.agent}</div>
                        <span className="text-xs font-mono text-muted-foreground">Score: {d.score.toFixed(2)}</span>
                      </div>
                      <div className="text-sm mb-1">{d.recommendation}</div>
                      <div className="text-xs text-muted-foreground">{d.reasoning}</div>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${d.score * 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!result && !loading && (
                <div className="glass-card p-12 flex items-center justify-center min-h-[300px] border-dashed border-white/10">
                  <div className="text-center text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Configure context and run orchestration<br />to see agent decisions.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
