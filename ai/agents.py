"""
Aeroflow Multi-Agent Coordination System
Implements specialized agents for:
- Nutrition intelligence
- Budget optimization
- Delivery timing
- Social group coordination
- Recommendation scoring
"""

from typing import Optional
from pydantic import BaseModel


class UserContext(BaseModel):
    user_id: str
    weather: Optional[str] = "clear"
    time_of_day: Optional[str] = "evening"
    recent_activity: Optional[str] = "sedentary"
    budget_remaining: Optional[float] = 500.0
    schedule_load: Optional[str] = "medium"
    group_size: Optional[int] = 1


class AgentDecision(BaseModel):
    agent: str
    recommendation: str
    score: float
    reasoning: str


# --------------------------------------------------------------------------
# Nutrition Agent
# --------------------------------------------------------------------------
class NutritionAgent:
    """
    Analyzes user activity and suggests macro-optimal meals.
    Post-workout → high protein. Stressful day/monsoon → comfort carbs.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        w = ctx.weather.lower() if ctx.weather else "clear"
        act = ctx.recent_activity.lower() if ctx.recent_activity else "sedentary"

        if act == "workout":
            if w in ["rainy", "cloudy"]:
                rec = "Warm Protein Chicken Ramen & Soft Boiled Eggs"
                score = 0.96
                reasoning = "Post-workout muscle recovery in cold/rainy weather. Recommending warm high-protein broth."
            else:
                rec = "Chilled Double-Protein Shake & Grilled Avocado Salad"
                score = 0.95
                reasoning = "Post-workout state in clear weather. Prioritizing lean protein and muscle recovery."
        elif ctx.schedule_load == "high" or w == "rainy":
            rec = "Comfort food (Hot Chicken Biryani, Dal Makhani with Garlic Naan)"
            score = 0.90
            reasoning = "High schedule load or rainy weather detected. Recommending comforting energy-dense carbs."
        elif w == "cloudy":
            rec = "Soothing Warm Quinoa Khichdi & Steamed Veggies"
            score = 0.85
            reasoning = "Overcast weather. Recommending light, soothing comfort nutrition."
        else:
            rec = "Balanced Superfood Salad Bowl & Whole Wheat Tortilla Wrap"
            score = 0.78
            reasoning = "Standard clear day. Recommending balanced macro distribution."

        return AgentDecision(agent="NutritionAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Budget Agent
# --------------------------------------------------------------------------
class BudgetAgent:
    """
    Ensures recommendations stay within user's weekly/daily budget envelope.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        w = ctx.weather.lower() if ctx.weather else "clear"
        b = ctx.budget_remaining if ctx.budget_remaining is not None else 500.0

        if b < 150:
            if w == "rainy":
                rec = "Hot Cutting Chai & Baked Vada Pav combo (₹75)"
                score = 0.94
                reasoning = f"Budget is critical (₹{b}). Recommending a cheap monsoon classic."
            else:
                rec = "Single Plate Masala Maggi & Fried Egg (₹65)"
                score = 0.92
                reasoning = f"Budget critically low (₹{b}). Recommending satisfying budget-friendly food."
        elif b < 300:
            if w == "rainy":
                rec = "Spicy Egg Hakka Noodles & Clear Soup (₹190)"
                score = 0.88
                reasoning = f"Moderate budget (₹{b}). Recommending warm comfort noodles."
            else:
                rec = "Healthy Paneer Tikka Salad Bowl (₹180)"
                score = 0.84
                reasoning = f"Moderate budget (₹{b}). Standard mid-range meal recommended."
        else:
            if w == "rainy":
                rec = "Premium Butter Chicken, Garlic Naan & Hot Belgian Cocoa (₹480)"
                score = 0.89
                reasoning = "Budget is healthy. Unlocking premium warming monsoon delicacies."
            elif w == "cloudy":
                rec = "Slow-Brewed Cafe Mocha & Gourmet Mushroom Panini (₹380)"
                score = 0.86
                reasoning = "Healthy budget. Recommending coffee-shop style premium comfort pairing."
            else:
                rec = "Premium Grilled Salmon & Quinoa Pilaf (₹450)"
                score = 0.75
                reasoning = "Budget is healthy. Premium fresh dining recommendation unlocked."

        return AgentDecision(agent="BudgetAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Timing Agent
# --------------------------------------------------------------------------
class TimingAgent:
    """
    Optimizes when to place an order for best delivery ETA.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        w = ctx.weather.lower() if ctx.weather else "clear"
        t = ctx.time_of_day.lower() if ctx.time_of_day else "evening"

        if w == "rainy":
            if t == "morning":
                rec = "Hot Filter Coffee & Steamed Idli (ETA 16 min)"
                score = 0.92
                reasoning = "Rainy morning. Logistics starting to queue. Order now to get priority dispatch."
            elif t in ["afternoon", "evening"]:
                rec = "Monsoon Warm Platter Combo (ETA 22 min)"
                score = 0.93
                reasoning = "Heavy rainfall delivery surge active. Pre-ordering dinner combo locks in current ETA."
            else:
                rec = "Late-night Spicy Ramen Cup (ETA 28 min)"
                score = 0.82
                reasoning = "Rainy late hour logistics constraint. Recommending fast-cooking options."
        elif w == "cloudy":
            if t == "evening":
                rec = "Chai Flask & Crispy Samosa Platter (ETA 14 min)"
                score = 0.90
                reasoning = "Overcast evening. Ideal weather for hot tea. Delivery routes are clear."
            else:
                rec = "Standard Meal combo (ETA 15 min)"
                score = 0.86
                reasoning = "Cloudy sky. Normal delivery times active."
        else:
            if t == "morning":
                rec = "Fresh Cold-Pressed Juice & Acai Bowl (ETA 10 min)"
                score = 0.94
                reasoning = "Clear morning. Ultra-fast breakfast prep and dispatch active."
            else:
                rec = "Quick Delivery Entree (ETA 12 min)"
                score = 0.88
                reasoning = "Clear skies. Delivery drivers running at maximum velocity."

        return AgentDecision(agent="TimingAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Social Coordination Agent
# --------------------------------------------------------------------------
class SocialAgent:
    """
    Handles group order logic — merging preferences, handling splits.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        w = ctx.weather.lower() if ctx.weather else "clear"
        g = ctx.group_size if ctx.group_size is not None else 1

        if g > 1:
            if w == "rainy":
                rec = f"Monsoon Platter Combo (Momos, Tikka, Kebabs, 4x Chai) for group of {g}"
                score = 0.95
                reasoning = f"Rainy group gathering ({g} people). Automatically suggesting combo platters with split-bill."
            else:
                rec = f"Group Share-Pack Combo (Noodles, Manchurian, Starters) for group of {g}"
                score = 0.91
                reasoning = f"Group size of {g} detected. Merging dietary preferences and activating group-savings checkout."
        else:
            if w == "rainy":
                rec = "Solo comfort bowl (Noodles or Warm Soup)"
                score = 0.78
                reasoning = "Solo rainy session. Prioritizing single-serving warm comfort food."
            else:
                rec = "Single portion standard meal"
                score = 0.70
                reasoning = "Solo clear-day session. Standard single-serving recommendation."

        return AgentDecision(agent="SocialAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Recommendation Scoring Engine
# Score = αP + βC + γT + δB (as per Aeroflow formula)
# --------------------------------------------------------------------------
class RecommendationEngine:
    """
    Multi-agent aggregator. Negotiates decisions across agents.
    """
    def __init__(self):
        self.nutrition = NutritionAgent()
        self.budget = BudgetAgent()
        self.timing = TimingAgent()
        self.social = SocialAgent()

    def orchestrate(self, ctx: UserContext) -> dict:
        decisions = [
            self.nutrition.evaluate(ctx),
            self.budget.evaluate(ctx),
            self.timing.evaluate(ctx),
            self.social.evaluate(ctx),
        ]

        # Weighted aggregate score
        α, β, γ, δ = 0.35, 0.25, 0.20, 0.20
        weights = [α, β, γ, δ]
        final_score = sum(d.score * w for d, w in zip(decisions, weights))

        return {
            "user_id": ctx.user_id,
            "final_confidence": round(final_score, 3),
            "agent_decisions": [d.model_dump() for d in decisions],
            "top_recommendation": decisions[0].recommendation,
            "formula": "Score = 0.35P + 0.25B + 0.20T + 0.20S",
        }
