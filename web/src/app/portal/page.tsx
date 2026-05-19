"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Navigation,
  Utensils,
  ShoppingBag,
  Ticket,
  Truck,
  Star,
  Clock,
  Plus,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  Sliders,
  Play,
  RotateCw,
  Activity,
  Heart,
  Cpu,
  Flame,
  UserCheck,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  eta: number;
  cuisines: string[];
  priceForTwo: number;
  offer: string;
  tag: string;
  imageUrl: string;
  menu: { name: string; price: number; category: string; isVeg: boolean }[];
}

const mockRestaurants: Restaurant[] = [
  {
    id: "rest_1",
    name: "Behrouz Biryani",
    rating: 4.5,
    eta: 25,
    cuisines: ["Biryani", "Mughlai", "Desserts"],
    priceForTwo: 400,
    offer: "₹125 OFF above ₹349",
    tag: "AI Recommended (Monsoon Comfort)",
    imageUrl: "🍲",
    menu: [
      { name: "Chicken Biryani", price: 349, category: "Biryani", isVeg: false },
      { name: "Paneer Biryani", price: 299, category: "Biryani", isVeg: true },
      { name: "Gulab Jamun (2pc)", price: 79, category: "Dessert", isVeg: true },
    ],
  },
  {
    id: "rest_2",
    name: "Blue Tokai Coffee Roasters",
    rating: 4.6,
    eta: 15,
    cuisines: ["Beverages", "Cafe", "Snacks"],
    priceForTwo: 300,
    offer: "Free delivery with AeroFlow",
    tag: "Trending in Koramangala",
    imageUrl: "☕",
    menu: [
      { name: "Cold Brew Coffee", price: 189, category: "Coffee", isVeg: true },
      { name: "Hot Cappuccino", price: 169, category: "Coffee", isVeg: true },
      { name: "Chicken Tikka Croissant", price: 179, category: "Bakery", isVeg: false },
    ],
  },
  {
    id: "rest_3",
    name: "HomeMade Kitchen",
    rating: 4.3,
    eta: 20,
    cuisines: ["North Indian", "Healthy Food"],
    priceForTwo: 200,
    offer: "30% OFF on all items",
    tag: "Fits your health goals",
    imageUrl: "🥗",
    menu: [
      { name: "Multigrain Roti (4pc)", price: 80, category: "Breads", isVeg: true },
      { name: "Chicken Masala & Rice Combo", price: 210, category: "Combos", isVeg: false },
      { name: "Dal Khichdi (Light)", price: 149, category: "Healthy", isVeg: true },
    ],
  },
  {
    id: "rest_4",
    name: "Leon's Burgers & Salad",
    rating: 4.4,
    eta: 18,
    cuisines: ["Burgers", "Fast Food", "Salads"],
    priceForTwo: 350,
    offer: "Buy 1 Get 1 Free on Burgers",
    tag: "Impulse snack choice",
    imageUrl: "🍔",
    menu: [
      { name: "Crispy Chicken Burger", price: 199, category: "Burgers", isVeg: false },
      { name: "Classic Veg Burger", price: 149, category: "Burgers", isVeg: true },
      { name: "Peri Peri Fries", price: 119, category: "Sides", isVeg: true },
    ],
  },
];

const mockInstamartItems = [
  { id: "im_1", name: "Milk 1L", price: 65, store: "Swiggy Instamart", category: "Dairy", icon: "🥛", label: "Auto-Replenish", isVeg: true },
  { id: "im_2", name: "Eggs (6pc)", price: 90, store: "Swiggy Instamart", category: "Dairy/Eggs", icon: "🥚", label: "Auto-Replenish", isVeg: true },
  { id: "im_3", name: "Bread (Whole Wheat)", price: 60, store: "Swiggy Instamart", category: "Bakery", icon: "🍞", label: "High Fiber", isVeg: true },
  { id: "im_4", name: "Butter (100g)", price: 80, store: "Swiggy Instamart", category: "Dairy", icon: "🧈", label: "Added By You", isVeg: true },
  { id: "im_5", name: "Protein Shake", price: 129, store: "Swiggy Instamart", category: "Nutrition", icon: "🥤", label: "AI Predicted", isVeg: true },
  { id: "im_6", name: "Chicken Breast 500g", price: 249, store: "Swiggy Instamart", category: "Meat", icon: "🍗", label: "High Protein", isVeg: false },
];

const mockHabitTriggers = [
  "⌚ Garmin smartwatch: Heart rate 118 BPM (Post-workout cooldown detected)",
  "📱 App Focus: Changed from Slack to VS Code (Focus mode active)",
  "📊 Habit Model: Protein requirement boosted by +32g based on weekly exertion",
  "🧠 Context Agent: Adjusting NutritionAgent weight (α) to 0.48",
  "☕ Crave Predictor: Espresso/Cold Brew affinity index spiked to 91% (Evening fatigue)",
  "🌡️ Ambient Sensor: Room temperature 22°C (Cloudy weather comfort matching)",
  "💰 Budget Monitor: Weekly allowance remaining: ₹3,420 (Budget sensitivity: Low)",
  "📈 Location Grid: Koramangala block density: Surge pricing avoided by MCP routing",
  "🍲 Dietary Constraint: Excluded onion/garlic recipes from search indices",
  "📱 Browser Focus: Reading food recipes (Impulse hunger probability: High)"
];

export default function SwiggyPortalPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const [portalMode, setPortalMode] = useState<"self" | "autopilot">("self");
  
  // Self mode state
  const [address, setAddress] = useState("Koramangala, Bangalore");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"food" | "instamart" | "dineout">("food");
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Autopilot state
  const [budget, setBudget] = useState(500);
  const [people, setPeople] = useState(2);
  const [occasion, setOccasion] = useState<"work" | "party" | "workout" | "date">("workout");
  const [precautions, setPrecautions] = useState("No Onion, No Garlic");
  const [mealWeight, setMealWeight] = useState<"light" | "filling">("filling");
  const [foodPreference, setFoodPreference] = useState<"veg" | "all">("all");
  
  const [scanning, setScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [autoResult, setAutoResult] = useState<{
    restaurant: string;
    foodItem: string;
    foodPrice: number;
    instamartItem: string;
    instamartPrice: number;
    description: string;
  } | null>(null);

  // Swiggy Snacc State
  const [snaccQuery, setSnaccQuery] = useState("");
  const [snaccActive, setSnaccActive] = useState(false);
  const [snaccChefStatus, setSnaccChefStatus] = useState<"idle" | "preparing" | "cooking" | "packing" | "dispatched">("idle");
  const [snaccLogs, setSnaccLogs] = useState<string[]>([]);

  // Real-time Habit Learning Stream
  const [habitLogs, setHabitLogs] = useState<string[]>([
    "🖥️ AeroFlow daemon active: Sniffing ambient sensors...",
    "🧠 Calibrating habit models based on past 14 days of Swiggy telemetry..."
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const randomTrigger = mockHabitTriggers[Math.floor(Math.random() * mockHabitTriggers.length)];
      const timestamp = new Date().toLocaleTimeString();
      setHabitLogs((prev) => [...prev.slice(-30), `[${timestamp}] ${randomTrigger}`]);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [habitLogs]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart`);
      if (res.ok) {
        const data = await res.json();
        setCartCount(data ? data.length : 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const handleLocateMe = () => {
    setAddress("Indiranagar, Bangalore");
  };

  const handleAddItem = async (name: string, price: number, restaurant: string, customTag = "added", customNutrition = "Custom Item Added via Swiggy Portal") => {
    try {
      const payload = {
        name,
        price: Math.floor(price),
        restaurant,
        quantity: 1,
        tag: customTag,
        nutrition: customNutrition,
      };

      const res = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchCartCount();
        setAddedItemName(name);
        setTimeout(() => setAddedItemName(null), 2000);
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  };

  // Run Swiggy Snacc Flow
  const handleTriggerSnacc = async () => {
    if (!snaccQuery) return;
    setSnaccActive(true);
    setSnaccChefStatus("preparing");
    setSnaccLogs([]);

    const steps = [
      `🔍 searching restaurants for: "${snaccQuery}"...`,
      "⚠️ 0 matching active restaurants found. Outlets closed or out of delivery radius.",
      "⚡ SWIGGY SNACC CLOUD KITCHEN ACTIVATED!",
      `👨‍🍳 Assigning certified Private Chef to curate custom "${snaccQuery}"...`,
      `🥗 Enforcing precautions: "${precautions || 'None'}"...`,
      "🍳 Heating pans. Prepping fresh ingredients from local dark hubs...",
      "📦 Packing order in thermally insulated biosphere container...",
      "🛵 Dispatched! Courier out. Estimated delivery: 38 minutes!"
    ];

    for (let i = 0; i < steps.length; i++) {
      if (i === 3) setSnaccChefStatus("cooking");
      if (i === 6) setSnaccChefStatus("packing");
      if (i === 7) setSnaccChefStatus("dispatched");

      setSnaccLogs((prev) => [...prev, steps[i]]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Add Snacc custom item to Go cart API
    await handleAddItem(
      `Custom Snacc ${snaccQuery}`,
      249,
      "Swiggy Snacc Dark Kitchen",
      "predicted",
      `Dietary: ${precautions} | Custom Chef Prepared (Delivers in <60m)`
    );
  };

  const resetSnacc = () => {
    setSnaccActive(false);
    setSnaccChefStatus("idle");
    setSnaccLogs([]);
    setSnaccQuery("");
  };

  // Run AI Autopilot matching with support for Non-Veg
  const runAutopilotScan = async () => {
    setScanning(true);
    setAutoResult(null);
    setScanLogs([]);

    const steps = [
      "📡 Swiggy MCP connecting to active node...",
      "🔍 Scanning 1,240 active food restaurants in Koramangala Block 4...",
      "🛒 Scanning 12 Swiggy Instamart dark store inventory lists...",
      `🥗 Filtering catalogs for dietary constraints: "${precautions || 'None'}"...`,
      `🥩 Preference profile resolved: "${foodPreference === 'veg' ? 'VEGETARIAN ONLY' : 'ALL (VEG & NON-VEG)'}"...`,
      `💰 Budget optimizer active: Target ₹${budget} total for ${people} people...`,
      `⚡ Occasion detected: "${occasion.toUpperCase()}" with density mode: "${mealWeight.toUpperCase()}"...`,
      "🤖 Applying 50% off AI Autopilot discount code to partner feeds...",
      "✅ Optimal combination verified and locked!"
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanLogs((prev) => [...prev, steps[i]]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Determine suggestion based on selections (including Non-Veg)
    let foodItem = "Jain Shahi Paneer Bowl & Basmati Rice";
    let foodPrice = 280; 
    let restaurant = "Sattvam Pure Veg";
    let instamartItem = "Pure Almond Milk 1L";
    let instamartPrice = 160; 
    let description = "Perfect warm vegetarian dish with no onion and garlic, paired with dairy-free almond milk.";

    if (foodPreference === "all") {
      // Non-veg selections allowed
      if (occasion === "workout") {
        if (mealWeight === "filling") {
          foodItem = "High-Protein Herb Grilled Chicken Salad Combo (No Onion/Garlic)";
          foodPrice = 340;
          restaurant = "Green Path Cafe";
          instamartItem = "Chicken Breast 500g (Skinless)";
          instamartPrice = 249;
          description = "Heavy protein loadout with grilled chicken breast and organic Instamart meat supplement.";
        } else {
          foodItem = "Light Chicken Clear Broth & Egg White Scramble";
          foodPrice = 220;
          restaurant = "Green Path Cafe";
          instamartItem = "Tender Coconut Water (Pack of 2)";
          instamartPrice = 110;
          description = "Light post-workout recovery featuring lean chicken broth and fresh electrolyte water.";
        }
      } else if (occasion === "date") {
        if (mealWeight === "filling") {
          foodItem = "Smoked Chicken Tuscan Pasta & Butter Croissant (No Onion/Garlic)";
          foodPrice = 450;
          restaurant = "Little Italy";
          instamartItem = "Premium Dark Chocolate Fondue Bowl";
          instamartPrice = 240;
          description = "Romantic candlelight dinner package: Tuscan pasta with smoked chicken breast and fondue dessert.";
        } else {
          foodItem = "Smoked Chicken Salad & Tomato Bruschetta";
          foodPrice = 280;
          restaurant = "Little Italy";
          instamartItem = "Fresh Strawberries Box";
          instamartPrice = 150;
          description = "Light elegant date appetizers paired with fresh organic strawberries.";
        }
      } else if (occasion === "party") {
        if (mealWeight === "filling") {
          foodItem = "12-inch Spicy Chicken Feast Pizza (No Onion/Garlic)";
          foodPrice = 520;
          restaurant = "Pizza Hut (Jain Section)";
          instamartItem = "Coke Zero 1.25L & Nachos Tub Combo";
          instamartPrice = 180;
          description = "Large spicy chicken feast pizza prepared with zero onion or garlic, plus party snacks.";
        } else {
          foodItem = "Crispy Chicken Tenders & Peri Peri Dip Platter";
          foodPrice = 360;
          restaurant = "Leon's Burgers & Salad";
          instamartItem = "Sparkling Apple Cider 750ml";
          instamartPrice = 280;
          description = "Crispy golden chicken strips to share, paired with sparkling apple cider.";
        }
      } else { // work
        if (mealWeight === "filling") {
          foodItem = "Tender Chicken Biryani Bowl & Raita (No Onion/Garlic)";
          foodPrice = 349;
          restaurant = "Behrouz Biryani";
          instamartItem = "Roasted Salted Almonds pack";
          instamartPrice = 90;
          description = "Deeply satisfying work meal: premium long grain basmati rice and slow cooked tender chicken.";
        } else {
          foodItem = "Clear Chicken Dumpling Soup (Jain Style)";
          foodPrice = 210;
          restaurant = "HomeMade Kitchen";
          instamartItem = "Energy Sugar-Free Granola Bar";
          instamartPrice = 80;
          description = "Light energy boosting dumpling broth and high fiber snack for active coding/work sessions.";
        }
      }
    } else {
      // Veg Only selections
      if (occasion === "workout") {
        if (mealWeight === "filling") {
          foodItem = "High-Protein Paneer Tikka Salad Bowl (No Onion/Garlic)";
          foodPrice = 320;
          restaurant = "Green Path Cafe";
          instamartItem = "Protein Shake (Vanilla, Organic)";
          instamartPrice = 130;
          description = "Post-workout recovery fuel packed with 35g of protein, prepared with zero onion or garlic.";
        } else {
          foodItem = "Organic Sprouted Moong Salad & Sattu drink";
          foodPrice = 180;
          restaurant = "Green Path Cafe";
          instamartItem = "Tender Coconut Water (Pack of 2)";
          instamartPrice = 110;
          description = "Light electrolyte recovery with fresh organic sprouts and pure coconut water.";
        }
      } else if (occasion === "date") {
        if (mealWeight === "filling") {
          foodItem = "Italian Tomato Basil Pasta & Cheese Herbs Bread (Jain prep)";
          foodPrice = 420;
          restaurant = "Little Italy";
          instamartItem = "Premium Dark Chocolate Fondue Bowl";
          instamartPrice = 240;
          description = "Premium date night dinner. Decadent Italian tomato basil pasta paired with rich fondue.";
        } else {
          foodItem = "Organic Tomato Soup & Herb Bruschetta (No Onion/Garlic)";
          foodPrice = 240;
          restaurant = "Little Italy";
          instamartItem = "Fresh Blueberries (Pack of 1)";
          instamartPrice = 190;
          description = "A light elegant starter paired with fresh, rich berries for dessert.";
        }
      } else if (occasion === "party") {
        if (mealWeight === "filling") {
          foodItem = "12-inch Classic Margherita Pizza (No Onion/Garlic)";
          foodPrice = 498;
          restaurant = "Pizza Hut (Jain Section)";
          instamartItem = "Coke Zero 1.25L & Nachos Tub Combo";
          instamartPrice = 180;
          description = "A classic crowd-pleaser pizza made strictly to your dietary rules, with party drinks.";
        } else {
          foodItem = "Salted Cashew Platter & Basil Hummus Dip";
          foodPrice = 320;
          restaurant = "The Mediterranean Grill";
          instamartItem = "Sparkling Apple Cider 750ml";
          instamartPrice = 280;
          description = "Light, shareable snacks for a social evening paired with premium sparkling cider.";
        }
      } else { // work
        if (mealWeight === "filling") {
          foodItem = "Jain Moong Dal Khichdi & Roasted Papad Meal Bowl";
          foodPrice = 220;
          restaurant = "HomeMade Kitchen";
          instamartItem = "Roasted Salted Almonds pack";
          instamartPrice = 90;
          description = "Comforting, warm comfort meal to stay focused during long work sessions.";
        } else {
          foodItem = "Clear Vegetable Soup & Steamed Veg Momos (Jain)";
          foodPrice = 180;
          restaurant = "HomeMade Kitchen";
          instamartItem = "Energy Sugar-Free Granola Bar";
          instamartPrice = 80;
          description = "Light desk-side bites to keep energy stable without any post-meal slump.";
        }
      }
    }

    setAutoResult({
      restaurant,
      foodItem,
      foodPrice,
      instamartItem,
      instamartPrice,
      description
    });
    setScanning(false);
  };

  const handleApplyAutopilot = async () => {
    if (!autoResult) return;

    try {
      await fetch(`${API_BASE}/api/cart/clear`, { method: "POST" });
      
      const discountedFoodPrice = Math.floor(autoResult.foodPrice * 0.5);
      const discountedInstamartPrice = Math.floor(autoResult.instamartPrice * 0.5);

      // Add Food Item
      await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: autoResult.foodItem,
          price: discountedFoodPrice,
          restaurant: autoResult.restaurant,
          quantity: 1,
          tag: "predicted",
          nutrition: `Dietary: ${precautions} | AI Autopilot 50% Off`
        })
      });

      // Add Instamart Item
      await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: autoResult.instamartItem,
          price: discountedInstamartPrice,
          restaurant: "Swiggy Instamart",
          quantity: 1,
          tag: "auto-replenish",
          nutrition: `AI Autopilot 50% Off (Healthy pairing)`
        })
      });

      fetchCartCount();
      setAddedItemName("Autopilot Combo Bundle");
      setTimeout(() => setAddedItemName(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#0c0d0f] text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dynamic Add Toast Notification */}
        <AnimatePresence>
          {addedItemName && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-orange-600 text-black font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(252,128,25,0.5)] border border-primary/30"
            >
              <Check className="w-5 h-5 stroke-[3]" /> Added {addedItemName} to Living Cart!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portal Mode Toggle */}
        <div className="flex justify-between items-center flex-col md:flex-row gap-4 mb-8">
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
            <button
              onClick={() => setPortalMode("self")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${portalMode === "self" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
            >
              <Utensils className="w-4 h-4" /> Self-Serve Portal
            </button>
            <button
              onClick={() => setPortalMode("autopilot")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${portalMode === "autopilot" ? "bg-primary text-black shadow-[0_0_20px_rgba(252,128,25,0.3)]" : "text-muted-foreground hover:text-white"}`}
            >
              <Sparkles className="w-4 h-4" /> AI Autopilot (50% Off)
            </button>
          </div>

          {/* Active Location Display */}
          <div className="flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-muted-foreground">
            <MapPin className="text-primary w-4 h-4 animate-bounce" /> Location: <span className="text-white font-bold">{address}</span>
          </div>
        </div>

        {/* Swiggy Snacc Instant Preparation Card (Search backup / Closed helper) */}
        <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent border border-red-500/20 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500/15 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-bold text-red-400">
            <AlertTriangle className="w-3.5 h-3.5" /> Swiggy Snacc Activated
          </div>
          
          <div className="max-w-2xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mb-1.5">
              🍕 Swiggy Snacc Autonomous Kitchen
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Restaurant closed or craving something not found? Instantly boot Swiggy Snacc. Our AI dark kitchen will cook your recipe following all precautions and deliver it in under 60 minutes!
            </p>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={snaccQuery}
                onChange={(e) => setSnaccQuery(e.target.value)}
                placeholder="e.g. Jain Pesto Pasta, Spicy Crispy Tacos..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-500 focus:outline-none"
              />
              <button
                onClick={handleTriggerSnacc}
                disabled={snaccActive || !snaccQuery}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-current" /> Dispatch Chef
              </button>
            </div>

            {/* Chef Process Tracker */}
            <AnimatePresence>
              {snaccActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 border-t border-white/5 pt-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-red-400 font-mono capitalize">Chef Status: {snaccChefStatus}</span>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  </div>
                  
                  {/* Status Badges */}
                  <div className="grid grid-cols-4 gap-2 mb-4 text-center text-[10px] font-mono">
                    <div className={`p-2 rounded-lg border ${snaccChefStatus === "preparing" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-white/5 border-white/5 text-muted-foreground"}`}>Prep</div>
                    <div className={`p-2 rounded-lg border ${snaccChefStatus === "cooking" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-white/5 border-white/5 text-muted-foreground"}`}>Cooking</div>
                    <div className={`p-2 rounded-lg border ${snaccChefStatus === "packing" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-white/5 border-white/5 text-muted-foreground"}`}>Packing</div>
                    <div className={`p-2 rounded-lg border ${snaccChefStatus === "dispatched" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/5 text-muted-foreground"}`}>Dispatched</div>
                  </div>

                  <div className="p-3 bg-black rounded-xl border border-white/5 font-mono text-[10px] text-muted-foreground space-y-1">
                    {snaccLogs.map((log, i) => (
                      <div key={i} className={log.includes("SWIGGY SNACC") ? "text-red-400 font-bold" : log.includes("🛵") ? "text-emerald-400 font-bold" : ""}>
                        {log}
                      </div>
                    ))}
                  </div>

                  {snaccChefStatus === "dispatched" && (
                    <button
                      onClick={resetSnacc}
                      className="mt-3 text-xs text-red-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Dismiss Tracker <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mode 1: Self-Serve */}
        {portalMode === "self" ? (
          <>
            {/* Hero Search Section */}
            <div className="relative rounded-3xl overflow-hidden mb-12 p-8 lg:p-12 bg-gradient-to-br from-orange-600/10 via-primary/5 to-transparent border border-white/5">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold mb-6 border border-primary/30 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> Swiggy MCP Portal
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-heading font-extrabold mb-4 leading-tight">
                  Order Food & Groceries. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Smartly Predicted.
                  </span>
                </h1>
                <p className="text-muted-foreground text-base lg:text-lg mb-8 leading-relaxed">
                  Experience the Swiggy ecosystem powered by AeroFlow. Locate your address, search from restaurants, or select groceries instantly.
                </p>

                {/* Address Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="flex-1 flex items-center gap-3 px-3 py-2">
                    <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="bg-transparent border-none text-white focus:outline-none w-full text-sm font-semibold"
                    />
                    <button
                      onClick={handleLocateMe}
                      className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline flex-shrink-0"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Locate Me
                    </button>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-white/10" />
                  <div className="flex-1 flex items-center gap-3 px-3 py-2">
                    <Search className="text-muted-foreground w-5 h-5 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for restaurants, dishes or groceries..."
                      className="bg-transparent border-none text-white focus:outline-none w-full text-sm"
                    />
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs text-muted-foreground">
                  <span className="font-mono">Popular zones:</span>
                  {["Koramangala", "Whitefield", "Indiranagar", "HSR Layout"].map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setAddress(`${zone}, Bangalore`)}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:border-primary/20 hover:text-white transition-all"
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Core Swiggy Services Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
              <ServiceCard
                title="Food Delivery"
                desc="AI-curated gourmet foods based on weather."
                icon={<Utensils className="w-6 h-6 text-primary" />}
                active={activeTab === "food"}
                onClick={() => setActiveTab("food")}
              />
              <ServiceCard
                title="Instamart"
                desc="Groceries in 10 minutes. Depletion-tracked."
                icon={<ShoppingBag className="w-6 h-6 text-secondary" />}
                active={activeTab === "instamart"}
                onClick={() => setActiveTab("instamart")}
              />
              <ServiceCard
                title="Dineout"
                desc="Book tables, get flat discounts."
                icon={<Ticket className="w-6 h-6 text-emerald-400" />}
                active={activeTab === "dineout"}
                onClick={() => setActiveTab("dineout")}
              />
              <Link href="/cart" className="group">
                <div className="h-full p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <Truck className="w-6 h-6 text-purple-400" />
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-primary text-black text-xs font-extrabold px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(252,128,25,0.4)]">
                        {cartCount} Items
                      </span>
                    )}
                  </div>
                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-1.5">
                      Living Cart <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-xs text-muted-foreground">Checkout now. Smartly merged orders.</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Tab Content Header */}
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h2 className="text-2xl lg:text-3xl font-heading font-extrabold capitalize">
                {activeTab === "food" ? "Popular Food Restaurants" : activeTab === "instamart" ? "Instamart Groceries" : "Explore Premium Dineouts"}
              </h2>
              <span className="text-xs text-muted-foreground font-mono">
                Showing context results for {address}
              </span>
            </div>

            {/* Tab Content: Food Delivery */}
            {activeTab === "food" && (
              <div className="grid md:grid-cols-2 gap-6">
                {mockRestaurants
                  .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())))
                  .map((rest) => (
                    <div key={rest.id} className="glass-card p-6 border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl p-2 bg-white/5 rounded-xl border border-white/10 leading-none">{rest.imageUrl}</span>
                            <div>
                              <h3 className="font-extrabold text-lg text-white">{rest.name}</h3>
                              <p className="text-xs text-muted-foreground">{rest.cuisines.join(", ")}</p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-primary/10 border border-primary/20 text-primary">
                            {rest.tag}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground mb-6">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" /> {rest.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {rest.eta} mins
                          </span>
                          <span>₹{rest.priceForTwo} for two</span>
                          <span className="text-emerald-400 font-bold">{rest.offer}</span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Add items to Living Cart:</p>
                        <div className="space-y-2">
                          {rest.menu.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.isVeg ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                  {item.isVeg ? "Veg" : "Non-Veg"}
                                </span>
                                <div>
                                  <div className="text-sm font-bold">{item.name}</div>
                                  <div className="text-xs text-primary font-bold">₹{item.price}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddItem(item.name, item.price, rest.name)}
                                className="p-1.5 rounded-lg bg-primary hover:bg-orange-600 text-black font-bold flex items-center justify-center gap-1 text-xs transition-all shadow-[0_0_10px_rgba(252,128,25,0.2)]"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Tab Content: Instamart */}
            {activeTab === "instamart" && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {mockInstamartItems
                  .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <div key={item.id} className="glass-card p-5 border border-white/5 hover:border-secondary/20 transition-all flex flex-col justify-between text-center relative overflow-hidden">
                      <div className="absolute top-2 left-2 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/25">
                        {item.label}
                      </div>
                      <div>
                        <div className="text-5xl my-4">{item.icon}</div>
                        <h3 className="font-bold text-sm truncate">{item.name}</h3>
                        <p className="text-[10px] font-semibold text-muted-foreground mt-1">{item.isVeg ? "🥦 Veg" : "🍖 Non-Veg"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.store}</p>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                        <span className="font-extrabold text-sm text-secondary">₹{item.price}</span>
                        <button
                          onClick={() => handleAddItem(item.name, item.price, item.store)}
                          className="py-1 px-2.5 rounded-lg bg-secondary hover:bg-orange-500 text-black font-bold flex items-center justify-center gap-0.5 text-xs transition-all shadow-[0_0_10px_rgba(236,72,153,0.2)]"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" /> Add
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Tab Content: Dineout */}
            {activeTab === "dineout" && (
              <div className="p-8 text-center glass-card border border-white/5 max-w-xl mx-auto rounded-3xl">
                <Ticket className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Book Tables & Save Flat 40%</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  AeroFlow coordinates Dineout reservation APIs via Swiggy MCP to secure tables, verify availability in real-time, and pre-negotiate flat bills.
                </p>
                <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                  <button className="py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    Browse Dineout Restaurants
                  </button>
                  <button className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-semibold text-sm transition-all">
                    Pre-book Combo Deal
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Mode 2: AI Autopilot Mode */
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Parameters Control Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 space-y-6 border border-primary/20 relative">
                <div className="absolute top-4 right-4 animate-pulse">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                
                <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/5 pb-3">
                  <Sliders className="text-primary w-5 h-5" /> Autopilot Config
                </h2>

                {/* 1. Occasion Mode Selection */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono">1. Select Occasion Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "work", label: "Work Focus", icon: "💼" },
                      { id: "party", label: "Party Mode", icon: "🎉" },
                      { id: "workout", label: "Post Workout", icon: "💪" },
                      { id: "date", label: "Date Night", icon: "❤️" }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setOccasion(mode.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center gap-2 ${
                          occasion === mode.id
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-base">{mode.icon}</span>
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1b. Food Type Preference (Veg vs Non-Veg) */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono">1b. Food Preference</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFoodPreference("veg")}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        foodPreference === "veg"
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      🥦 Vegetarian Only
                    </button>
                    <button
                      onClick={() => setFoodPreference("all")}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        foodPreference === "all"
                          ? "bg-primary/15 border-primary text-primary"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      🍗 Veg & Non-Veg
                    </button>
                  </div>
                </div>

                {/* 2. Budget Control */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-muted-foreground font-mono">2. Select Budget Limit</label>
                    <span className="text-sm font-bold text-primary">₹{budget}</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1500"
                    step="50"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>₹150</span>
                    <span>₹800</span>
                    <span>₹1500</span>
                  </div>
                </div>

                {/* 3. People Count */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono">3. Number of People</label>
                  <div className="flex gap-2">
                    {[1, 2, 4, 6, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPeople(num)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                          people === num
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        {num} {num === 8 ? "+" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Dietary Precautions */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> 4. Dietary Precautions
                  </label>
                  <input
                    type="text"
                    value={precautions}
                    onChange={(e) => setPrecautions(e.target.value)}
                    placeholder="e.g. No Onion, No Garlic, Gluten-Free"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {["No Onion, No Garlic", "Gluten-Free", "High Protein", "Vegan"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setPrecautions(tag)}
                        className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/5 hover:border-primary/30 transition-all text-muted-foreground"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Meal Weight Density */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block font-mono">5. Meal Weight Density</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMealWeight("light")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        mealWeight === "light"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/5 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span>🍃</span> Something Light
                    </button>
                    <button
                      onClick={() => setMealWeight("filling")}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        mealWeight === "filling"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/5 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span>🍲</span> Filling Meal
                    </button>
                  </div>
                </div>

                <button
                  onClick={runAutopilotScan}
                  disabled={scanning}
                  className="w-full py-4 bg-primary hover:bg-orange-600 text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_35px_rgba(252,128,25,0.4)] transition-all disabled:opacity-60"
                >
                  {scanning ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" /> Scanning Outlets...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Auto-Assemble & Apply 50% Off
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scan Simulation & Recommendations Panel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Terminal Logs of Scanning */}
              <div className="glass-card p-6 border border-white/5 font-mono text-xs text-muted-foreground min-h-[160px]">
                <div className="flex items-center gap-1.5 text-foreground font-bold mb-3 border-b border-white/5 pb-2">
                  <RotateCw className={`w-4 h-4 text-primary ${scanning ? "animate-spin" : ""}`} /> Swiggy MCP Scanning Engine
                </div>
                {scanLogs.length > 0 ? (
                  <div className="space-y-1.5">
                    {scanLogs.map((log, idx) => (
                      <div key={idx} className={log.includes("✅") ? "text-emerald-400 font-bold" : log.includes("🤖") ? "text-primary font-bold" : ""}>
                        {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-30 text-sm">
                    Set config and click Auto-Assemble to scan 1,240 Koramangala restaurants.
                  </div>
                )}
              </div>

              {/* Suggestions Panel */}
              <AnimatePresence>
                {autoResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card p-6 border border-primary/30 relative overflow-hidden"
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-orange-600 text-black text-xs font-black px-4 py-1 rounded-full shadow-[0_0_15px_rgba(252,128,25,0.4)]">
                      AI 50% OFF UNLOCKED
                    </div>

                    <h3 className="text-xl font-extrabold flex items-center gap-2 mb-2 text-primary">
                      <Sparkles className="w-5 h-5 fill-current" /> AI Recommended Combo
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                      {autoResult.description} Analyzed constraints against restaurants in Koramangala.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      
                      {/* Food Selection */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">
                            {autoResult.restaurant} (Food)
                          </div>
                          <h4 className="font-extrabold text-sm text-white mb-2">{autoResult.foodItem}</h4>
                          <p className="text-[10px] text-muted-foreground">Certified: {precautions}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-end">
                          <span className="text-xs text-muted-foreground line-through">₹{autoResult.foodPrice}</span>
                          <span className="font-extrabold text-base text-primary">₹{Math.floor(autoResult.foodPrice * 0.5)}</span>
                        </div>
                      </div>

                      {/* Instamart Selection */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                            Swiggy Instamart (Grocery)
                          </div>
                          <h4 className="font-extrabold text-sm text-white mb-2">{autoResult.instamartItem}</h4>
                          <p className="text-[10px] text-muted-foreground">Depletion pairing supplement</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-end">
                          <span className="text-xs text-muted-foreground line-through">₹{autoResult.instamartPrice}</span>
                          <span className="font-extrabold text-base text-secondary">₹{Math.floor(autoResult.instamartPrice * 0.5)}</span>
                        </div>
                      </div>

                    </div>

                    {/* Summary and add */}
                    <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Total (Original: <span className="line-through">₹{autoResult.foodPrice + autoResult.instamartPrice}</span>)</div>
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                          ₹{Math.floor((autoResult.foodPrice + autoResult.instamartPrice) * 0.5)}
                        </div>
                      </div>

                      <button
                        onClick={handleApplyAutopilot}
                        className="py-3 px-6 bg-gradient-to-r from-primary to-orange-600 text-black font-black rounded-xl hover:shadow-[0_0_25px_rgba(252,128,25,0.4)] transition-all text-sm flex items-center gap-1.5"
                      >
                        Confirm & Push to Living Cart <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        )}

        {/* Real-time Habit Learning Daemon Console */}
        <div className="mt-12 glass-card p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">AEROFLOW HEURISTICS ACTIVE</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          
          <h3 className="text-lg font-extrabold mb-3 flex items-center gap-2">
            <Cpu className="text-emerald-400 w-5 h-5" /> Human Habit Learning Stream
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            AeroFlow logs your activity patterns per second. These values are synced into the Multi-Agent stack to refine recommendation weights dynamically.
          </p>

          <div
            ref={logContainerRef}
            className="bg-black/60 rounded-2xl border border-white/10 p-4 h-48 overflow-y-auto font-mono text-[11px] text-muted-foreground space-y-1.5 scrollbar-thin scrollbar-thumb-white/10"
          >
            {habitLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-primary flex-shrink-0">⚡</span>
                <span className={log.includes("Garmin") ? "text-sky-400" : log.includes("spiked") ? "text-amber-400" : log.includes("Telemetry") ? "text-emerald-400" : ""}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

interface ServiceCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function ServiceCard({ title, desc, icon, active, onClick }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-full transition-all ${
        active
          ? "bg-white/[0.04] border-primary shadow-[0_0_20px_rgba(252,128,25,0.15)]"
          : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 transition-transform ${active ? "scale-105" : ""}`}>
        {icon}
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-1.5">
          {title} {active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
        </h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
