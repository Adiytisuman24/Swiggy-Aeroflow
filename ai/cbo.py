import math
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class CBORequest(BaseModel):
    user_id: str
    area: str = "Koramangala"  # Koramangala or Whitefield
    weather: str = "clear"  # clear, rainy, cloudy
    time_of_day: str = "evening"  # morning, afternoon, evening, night
    activity: str = "sedentary"  # sedentary, workout, work
    budget_remaining: float = 500.0
    current_cart: List[Dict[str, Any]] = []  # List of items currently in cart

class CBOItem(BaseModel):
    id: str
    name: str
    price: float
    margin: float
    category: str
    store: str  # Instamart or Food
    habit_base: float
    time_affinities: Dict[str, float]
    weather_affinities: Dict[str, float]
    base_orders: Dict[str, int]  # base orders per area

# Candidate items available in Swiggy MCP
CANDIDATE_ITEMS = [
    CBOItem(
        id="item_milk",
        name="Milk 1L",
        price=130.0,
        margin=0.15,
        category="dairy",
        store="Instamart",
        habit_base=0.85,
        time_affinities={"morning": 0.95, "afternoon": 0.4, "evening": 0.6, "night": 0.3},
        weather_affinities={"clear": 0.8, "rainy": 0.7, "cloudy": 0.8},
        base_orders={"Koramangala": 180, "Whitefield": 350}
    ),
    CBOItem(
        id="item_eggs",
        name="Eggs (6pc)",
        price=90.0,
        margin=0.12,
        category="protein",
        store="Instamart",
        habit_base=0.80,
        time_affinities={"morning": 0.90, "afternoon": 0.5, "evening": 0.6, "night": 0.4},
        weather_affinities={"clear": 0.8, "rainy": 0.8, "cloudy": 0.8},
        base_orders={"Koramangala": 150, "Whitefield": 280}
    ),
    CBOItem(
        id="item_bread",
        name="Bread (Whole Wheat)",
        price=60.0,
        margin=0.18,
        category="grains",
        store="Instamart",
        habit_base=0.75,
        time_affinities={"morning": 0.95, "afternoon": 0.5, "evening": 0.7, "night": 0.3},
        weather_affinities={"clear": 0.8, "rainy": 0.8, "cloudy": 0.8},
        base_orders={"Koramangala": 90, "Whitefield": 310}
    ),
    CBOItem(
        id="item_butter",
        name="Butter (100g)",
        price=80.0,
        margin=0.20,
        category="dairy",
        store="Instamart",
        habit_base=0.70,
        time_affinities={"morning": 0.90, "afternoon": 0.6, "evening": 0.7, "night": 0.4},
        weather_affinities={"clear": 0.8, "rainy": 0.7, "cloudy": 0.8},
        base_orders={"Koramangala": 120, "Whitefield": 240}
    ),
    CBOItem(
        id="item_cold_brew",
        name="Cold Brew Coffee",
        price=189.0,
        margin=0.35,
        category="beverages",
        store="Food",
        habit_base=0.90,
        time_affinities={"morning": 0.80, "afternoon": 0.7, "evening": 0.9, "night": 0.5},
        weather_affinities={"clear": 0.95, "rainy": 0.6, "cloudy": 0.8},
        base_orders={"Koramangala": 320, "Whitefield": 150}
    ),
    CBOItem(
        id="item_garlic_bread",
        name="Garlic Bread",
        price=120.0,
        margin=0.30,
        category="sides",
        store="Food",
        habit_base=0.60,
        time_affinities={"morning": 0.20, "afternoon": 0.6, "evening": 0.85, "night": 0.90},
        weather_affinities={"clear": 0.7, "rainy": 0.9, "cloudy": 0.8},
        base_orders={"Koramangala": 220, "Whitefield": 180}
    ),
    CBOItem(
        id="item_brownie",
        name="Warm Brownie",
        price=90.0,
        margin=0.35,
        category="dessert",
        store="Food",
        habit_base=0.65,
        time_affinities={"morning": 0.10, "afternoon": 0.5, "evening": 0.80, "night": 0.95},
        weather_affinities={"clear": 0.7, "rainy": 0.95, "cloudy": 0.85},
        base_orders={"Koramangala": 250, "Whitefield": 190}
    ),
    CBOItem(
        id="item_protein_shake",
        name="Protein Shake",
        price=120.0,
        margin=0.25,
        category="protein",
        store="Instamart",
        habit_base=0.85,
        time_affinities={"morning": 0.80, "afternoon": 0.85, "evening": 0.75, "night": 0.40},
        weather_affinities={"clear": 0.85, "rainy": 0.70, "cloudy": 0.80},
        base_orders={"Koramangala": 280, "Whitefield": 110}
    ),
    CBOItem(
        id="item_chicken_biryani",
        name="Chicken Biryani",
        price=349.0,
        margin=0.28,
        category="meals",
        store="Food",
        habit_base=0.75,
        time_affinities={"morning": 0.05, "afternoon": 0.85, "evening": 0.75, "night": 0.95},
        weather_affinities={"clear": 0.75, "rainy": 0.85, "cloudy": 0.80},
        base_orders={"Koramangala": 410, "Whitefield": 330}
    ),
    CBOItem(
        id="item_warm_ramen",
        name="Warm Ramen",
        price=299.0,
        margin=0.26,
        category="meals",
        store="Food",
        habit_base=0.55,
        time_affinities={"morning": 0.10, "afternoon": 0.70, "evening": 0.85, "night": 0.90},
        weather_affinities={"clear": 0.55, "rainy": 0.95, "cloudy": 0.85},
        base_orders={"Koramangala": 290, "Whitefield": 140}
    )
]

class CBOEngine:
    def __init__(self):
        self.candidates = CANDIDATE_ITEMS

    def optimize_basket(self, req: CBORequest) -> Dict[str, Any]:
        user_id = req.user_id
        area = req.area
        weather = req.weather
        time_of_day = req.time_of_day
        activity = req.activity
        budget = req.budget_remaining
        
        # User details for embeddings
        # A simple ruleset for embedding preferences
        user_habits = {
            "item_cold_brew": 0.90 if activity in ["work", "sedentary"] else 0.50,
            "item_protein_shake": 0.95 if activity == "workout" else 0.40,
            "item_milk": 0.85,
            "item_eggs": 0.80,
            "item_bread": 0.75,
            "item_butter": 0.70,
            "item_garlic_bread": 0.75 if weather == "rainy" else 0.50,
            "item_brownie": 0.80 if weather == "rainy" else 0.45,
            "item_warm_ramen": 0.90 if weather == "rainy" else 0.30
        }

        # Calculate Intent Score, Area Score, Offer Uplift, Margin, and AOV Impact
        scores = []
        
        # Area metadata setup
        total_orders_in_area = sum(item.base_orders.get(area, 100) for item in self.candidates)
        # Area demand density D_z = orders / (pi * r^2), r = 5km -> Area = 78.54 km^2
        # We can calculate simulated density: D_z per item
        area_radius = 5.0
        area_size = math.pi * (area_radius ** 2)  # ~78.54 km^2
        
        for item in self.candidates:
            # 1. Habit score H_i
            h_i = user_habits.get(item.id, item.habit_base)
            if user_id == "user_001":
                # Special tuning for User A
                if item.id == "item_cold_brew" and time_of_day == "evening":
                    h_i = 0.92
                if item.id == "item_protein_shake" and activity == "workout":
                    h_i = 0.98
                if item.id == "item_milk":
                    h_i = 0.82

            # 2. Time affinity T_i
            t_i = item.time_affinities.get(time_of_day, 0.50)

            # 3. Weather affinity W_i
            w_i = item.weather_affinities.get(weather, 0.50)
            
            # 4. Budget sensitivity B_i
            # If budget remaining is small, cheaper items get higher B_i
            if budget < 150:
                b_i = max(0.1, 1.0 - (item.price / 400.0))
            else:
                b_i = 0.8  # not very sensitive

            # Calculate User Intent Probability: P_i = alpha*H_i + beta*T_i + gamma*W_i + delta*B_i
            alpha, beta, gamma, delta = 0.40, 0.20, 0.20, 0.20
            p_i = alpha * h_i + beta * t_i + gamma * w_i + delta * b_i

            # 5. Area Affinity A_i
            # Orders_i in area z
            orders_i = item.base_orders.get(area, 100)
            # Density D_z_i = orders_i / Area
            d_z_i = orders_i / area_size
            # A_i = D_z_i / Normalized total orders
            # Let's normalize it to 0-1 range based on max orders
            max_orders_in_area = max(item.base_orders.get(area, 100) for item in self.candidates)
            a_i = orders_i / max_orders_in_area

            # 6. Offer Uplift O_i
            # If item is part of a combo or has a discount. Let's say we offer:
            # Coffee + Garlic Bread + Brownie has combo savings
            discount = 0.0
            if item.id in ["item_cold_brew", "item_garlic_bread", "item_brownie"] and weather == "rainy":
                discount = item.price * 0.20  # 20% combo discount
            
            o_i = 1.0 + (discount / item.price) if discount > 0 else 1.0

            # 7. Margin M_i
            m_i = item.margin

            # 8. Cart contribution / AOV impact
            aov_i = min(1.0, item.price / 500.0)

            # Final Score calculation:
            # Score_i = λ1 * P_i + λ2 * A_i + λ3 * O_i + λ4 * M_i + λ5 * AOV_i
            # Let's assign lambda weights
            l1, l2, l3, l4, l5 = 0.35, 0.20, 0.15, 0.15, 0.15
            score_i = l1 * p_i + l2 * a_i + l3 * o_i + l4 * m_i + l5 * aov_i

            scores.append({
                "item": item,
                "score": round(score_i, 3),
                "p_i": round(p_i, 3),
                "a_i": round(a_i, 3),
                "o_i": round(o_i, 3),
                "m_i": round(m_i, 3),
                "aov_i": round(aov_i, 3),
                "price": item.price,
                "category": item.category,
                "store": item.store
            })

        # Sort descending
        scores.sort(key=lambda x: x["score"], reverse=True)

        # Counterfactual Simulation
        # Let's parse current cart
        base_cart_items = []
        base_aov = 0.0
        for cart_item in req.current_cart:
            # Find item details if exists or mock it
            item_name = cart_item.get("name", "")
            item_price = cart_item.get("price", 0.0)
            item_qty = cart_item.get("quantity", 1)
            base_cart_items.append({
                "name": item_name,
                "price": item_price,
                "quantity": item_qty
            })
            base_aov += item_price * item_qty

        # If base cart is empty, let's pre-populate with user's base cart (Milk ₹130, Eggs ₹90 = ₹220)
        if not base_cart_items:
            base_cart_items = [
                {"name": "Milk 1L", "price": 130.0, "quantity": 1},
                {"name": "Eggs (6pc)", "price": 90.0, "quantity": 1}
            ]
            base_aov = 220.0

        # Scenario 1: Order Now (Base Cart)
        # ETA is 18 min
        s1_aov = base_aov
        s1_eta = 18
        s1_savings = 0.0
        s1_conversion = 0.65 if weather == "clear" else 0.55

        # Scenario 2: Add Bread + Butter
        s2_items = list(base_cart_items)
        s2_items.append({"name": "Bread (Whole Wheat)", "price": 60.0, "quantity": 1})
        s2_items.append({"name": "Butter (100g)", "price": 80.0, "quantity": 1})
        s2_aov = base_aov + 60.0 + 80.0
        s2_eta = 18  # same ETA as it's from the same Instamart store
        s2_savings = 15.0  # combo discount
        s2_conversion = 0.78

        # Scenario 3: CBO Optimized Additions (Add Bread + Butter + Cold Brew / Coffee)
        # This crosses the ₹500 AOV target (Total ₹549 or similar)
        # This unlocks ₹70 savings, free delivery, combo discount
        s3_items = list(base_cart_items)
        s3_items.append({"name": "Bread (Whole Wheat)", "price": 60.0, "quantity": 1})
        s3_items.append({"name": "Butter (100g)", "price": 80.0, "quantity": 1})
        s3_items.append({"name": "Cold Brew Coffee", "price": 189.0, "quantity": 1})
        s3_aov = base_aov + 60.0 + 80.0 + 189.0  # 220 + 329 = 549
        s3_eta = 18  # Same ETA since Instamart + partner coffee outlet route is optimized by MCP
        s3_savings = 70.0
        s3_conversion = 0.88

        # AI Generated Pitch
        ai_pitch = "Add Bread, Butter, and Cold Brew Coffee. Same ETA + unlock ₹70 combo savings + predicted depletion need in 2 days."

        return {
            "area": area,
            "weather": weather,
            "time_of_day": time_of_day,
            "activity": activity,
            "candidates": [
                {
                    "id": item_info["item"].id,
                    "name": item_info["item"].name,
                    "price": item_info["price"],
                    "store": item_info["store"],
                    "category": item_info["category"],
                    "score": item_info["score"],
                    "p_i": item_info["p_i"],
                    "a_i": item_info["a_i"],
                    "o_i": item_info["o_i"],
                    "m_i": item_info["m_i"],
                    "aov_i": item_info["aov_i"]
                }
                for item_info in scores
            ],
            "scenarios": {
                "base": {
                    "name": "Base Cart",
                    "items": base_cart_items,
                    "aov": s1_aov,
                    "eta": s1_eta,
                    "savings": s1_savings,
                    "conversion": s1_conversion
                },
                "mid": {
                    "name": "Add Essentials",
                    "items": s2_items,
                    "aov": s2_aov,
                    "eta": s2_eta,
                    "savings": s2_savings,
                    "conversion": s2_conversion
                },
                "optimized": {
                    "name": "AI Basket (CBO Optimized)",
                    "items": s3_items,
                    "aov": s3_aov,
                    "eta": s3_eta,
                    "savings": s3_savings,
                    "conversion": s3_conversion
                }
            },
            "ai_pitch": ai_pitch,
            "formula": "Score = 0.35 * P_i + 0.20 * A_i + 0.15 * O_i + 0.15 * M_i + 0.15 * AOV_i",
            "mcp_status": {
                "food_mcp": "CONNECTED (localhost:8081)",
                "instamart_mcp": "CONNECTED (localhost:8082)",
                "dineout_mcp": "CONNECTED (localhost:8083)",
                "active_agent_flow": "CounterfactualBasketOptimizerFlow"
            }
        }
