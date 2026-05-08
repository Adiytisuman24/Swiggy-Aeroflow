"use client";

import { motion } from "framer-motion";
import {
  Server,
  Database,
  Zap,
  Brain,
  Globe,
  Shield,
  ArrowRight,
  GitBranch,
  Layers,
  Cpu,
} from "lucide-react";

const stack = [
  {
    layer: "Frontend",
    color: "from-indigo-500/20 to-purple-500/20",
    border: "border-indigo-500/30",
    icon: <Globe className="w-6 h-6 text-indigo-400" />,
    items: ["Next.js 16 (TypeScript)", "TailwindCSS v4", "Framer Motion", "Lucide Icons"],
    description: "Premium glassmorphic UI with real-time AI-driven updates.",
  },
  {
    layer: "Orchestration Layer",
    color: "from-primary/20 to-amber-500/20",
    border: "border-primary/30",
    icon: <Zap className="w-6 h-6 text-primary" />,
    items: ["Go (Golang)", "gRPC", "HTTP/2", "OAuth 2.0"],
    description: "High-concurrency MCP orchestration engine. Handles thousands of requests/sec.",
  },
  {
    layer: "AI Intelligence",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    icon: <Brain className="w-6 h-6 text-emerald-400" />,
    items: ["Python + FastAPI", "LangGraph (Multi-Agent)", "PyTorch", "Transformers"],
    description: "4 specialized agents negotiate the optimal consumption decision.",
  },
  {
    layer: "Data Layer",
    color: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/30",
    icon: <Database className="w-6 h-6 text-sky-400" />,
    items: ["PostgreSQL 15", "Redis 7", "Pinecone (Vector DB)", "Apache Kafka"],
    description: "Transactional + behavioral memory + real-time event streaming.",
  },
  {
    layer: "Infrastructure",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/30",
    icon: <Server className="w-6 h-6 text-rose-400" />,
    items: ["Docker + Compose", "Kubernetes", "AWS / GCP", "GitHub Actions CI/CD"],
    description: "Cloud-native, auto-scaling, containerized deployment pipeline.",
  },
];

const agents = [
  { name: "NutritionAgent", color: "bg-emerald-400/10 border-emerald-400/30 text-emerald-400", weight: "α = 0.35", desc: "Optimizes macro targets based on activity and health goals." },
  { name: "BudgetAgent", color: "bg-amber-400/10 border-amber-400/30 text-amber-400", weight: "β = 0.25", desc: "Enforces spend envelopes and weekly budget constraints." },
  { name: "TimingAgent", color: "bg-primary/10 border-primary/30 text-primary", weight: "γ = 0.20", desc: "Calculates optimal order time for best delivery ETA." },
  { name: "SocialAgent", color: "bg-sky-400/10 border-sky-400/30 text-sky-400", weight: "δ = 0.20", desc: "Coordinates group orders and split payment logic." },
];

export default function EcosystemPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-sm font-semibold mb-4">
            <Layers className="w-4 h-4" /> Technical Ecosystem
          </div>
          <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-secondary">Aeroflow</span> Works
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            A multi-layer autonomous system built for scale, intelligence, and speed.
          </p>
        </div>

        {/* Architecture Formula */}
        <div className="glass-card p-8 mb-16 text-center border border-primary/20">
          <p className="text-sm text-muted-foreground mb-3 font-mono">Recommendation Confidence Formula</p>
          <p className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Score = αP + βC + γT + δB
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            Preference × Nutrition · Context × Budget · Timing · Social Coordination
          </p>
        </div>

        {/* Stack Layers */}
        <div className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">Technology Stack</h2>
          <div className="space-y-4">
            {stack.map((s, i) => (
              <motion.div
                key={s.layer}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 border ${s.border} bg-gradient-to-r ${s.color}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{s.layer}</h3>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {s.items.map((item) => (
                          <span key={item} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 font-mono">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{s.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent System */}
        <div className="mb-20">
          <h2 className="text-3xl font-heading font-bold mb-4 text-center">Multi-Agent System</h2>
          <p className="text-muted-foreground text-center mb-10">Four specialized agents negotiate the optimal outcome for every decision.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 border ${a.color.split(" ").slice(1).join(" ")}`}
              >
                <div className={`text-xs font-bold px-3 py-1 rounded-full border inline-block mb-3 ${a.color}`}>
                  {a.name}
                </div>
                <div className="text-2xl font-heading font-extrabold mb-2">{a.weight}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Flow */}
        <div className="glass-card p-10 border border-white/10">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center">Request Lifecycle</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: <Globe className="w-4 h-4" />, label: "User Context" },
              { icon: <Zap className="w-4 h-4" />, label: "Go Orchestrator" },
              { icon: <Brain className="w-4 h-4" />, label: "AI Agents" },
              { icon: <Cpu className="w-4 h-4" />, label: "Score Engine" },
              { icon: <Database className="w-4 h-4" />, label: "MCP APIs" },
              { icon: <Shield className="w-4 h-4" />, label: "Fulfillment" },
              { icon: <GitBranch className="w-4 h-4" />, label: "Behavioral Memory" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/10">
                  <span className="text-primary">{step.icon}</span>
                  <span className="font-medium">{step.label}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
