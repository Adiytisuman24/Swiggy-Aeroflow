"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Brain, 
  Clock, 
  ShieldCheck, 
  Users, 
  ChevronRight,
  Sparkles,
  UtensilsCrossed,
  LayoutDashboard,
  Zap
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Autonomous Consumption Intelligence</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6">
              Predicting Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-secondary">
                Next Consumption
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Aeroflow transforms food delivery into an intelligent ambient infrastructure that orchestrates your needs before you even think of them.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-primary text-black font-bold rounded-2xl flex items-center gap-2 hover:shadow-[0_0_30px_rgba(252,128,25,0.4)] transition-all">
                Get Started <ChevronRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 glass border border-white/10 font-bold rounded-2xl hover:bg-white/5 transition-all">
                View Architecture
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 animate-float">
              <Image 
                src="/hero.png" 
                alt="CortexFlow UI" 
                width={700} 
                height={500} 
                className="rounded-3xl shadow-2xl border border-white/10"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/30 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/30 blur-[80px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Core Orchestration Pillars</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on top of Swiggy MCP, Aeroflow utilizes multi-agent systems to minimize decision fatigue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Brain className="w-6 h-6" />}
              title="Predictive Engine"
              description="Forecasts likely meals and grocery depletion based on routines, weather, and schedule."
              color="text-primary"
            />
            <FeatureCard 
              icon={<ShoppingCart className="w-6 h-6" />}
              title="Living Dynamic Cart"
              description="Carts that evolve in real-time, auto-adjusting recommendations as you interact."
              color="text-secondary"
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-400 w-6 h-6" />}
              title="Nutrition Intel"
              description="AI agents that negotiate optimal health outcomes without sacrificing flavor."
              color="text-emerald-400"
            />
            <FeatureCard 
              icon={<Clock className="text-amber-400 w-6 h-6" />}
              title="Ambient Commerce"
              description="Ordering becomes invisible and proactive, triggered by passive approvals."
              color="text-amber-400"
            />
            <FeatureCard 
              icon={<Users className="text-sky-400 w-6 h-6" />}
              title="Team Sync"
              description="Automatically coordinate group orders, preferences, and split payments."
              color="text-sky-400"
            />
            <FeatureCard 
              icon={<LayoutDashboard className="text-purple-400 w-6 h-6" />}
              title="MCP Orchestration"
              description="Deep integration with Swiggy APIs for real-time logistics and fulfillment."
              color="text-purple-400"
            />
          </div>
        </div>
      </section>

      {/* Living Cart Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto glass-card p-12 lg:p-20 overflow-hidden relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-6">The Living Dynamic Cart</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Traditional carts are static. Aeroflow&apos;s cart is a behavioral object that learns. It predicts when you&apos;re low on essentials and suggests items that align with your weekly nutritional goals.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span>Real-time recommendation adaptation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span>Grocery depletion forecasting</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span>Context-aware meal recovery</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image 
                src="/cart.png" 
                alt="Living Cart Preview" 
                width={600} 
                height={400} 
                className="rounded-2xl border border-white/10 shadow-xl"
              />
              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl border border-primary/20 animate-pulse-soft">
                <UtensilsCrossed className="text-primary w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="text-primary w-5 h-5 fill-current" />
            <span className="font-heading font-bold tracking-tight">Aeroflow</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2026 Aeroflow. Powered by Swiggy MCP & Advanced Multi-Agent AI.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="glass-card p-8 group">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
