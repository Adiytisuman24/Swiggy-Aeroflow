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
    Post-workout → high protein. Stressful day → comfort carbs.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        if ctx.recent_activity == "workout":
            rec = "High-protein meal (Grilled Chicken, Paneer Tikka)"
            score = 0.95
            reasoning = "Post-workout state detected. Prioritizing protein for muscle recovery."
        elif ctx.schedule_load == "high":
            rec = "Comfort food (Biryani, Dal Makhani)"
            score = 0.88
            reasoning = "High cognitive load detected. Recommending energy-dense comfort meals."
        else:
            rec = "Balanced meal (Salad Bowl, Multigrain Roti)"
            score = 0.75
            reasoning = "Standard nutritional baseline recommendation."

        return AgentDecision(agent="NutritionAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Budget Agent
# --------------------------------------------------------------------------
class BudgetAgent:
    """
    Ensures recommendations stay within user's weekly/daily budget envelope.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        if ctx.budget_remaining and ctx.budget_remaining < 100:
            rec = "Budget meal (Vada Pav, Maggi, Home Kitchen specials)"
            score = 0.92
            reasoning = f"Budget critically low (₹{ctx.budget_remaining}). Recommending cost-effective options."
        elif ctx.budget_remaining and ctx.budget_remaining < 300:
            rec = "Mid-range meal (₹150–250 options)"
            score = 0.80
            reasoning = f"Moderate budget available (₹{ctx.budget_remaining}). Balanced spend recommended."
        else:
            rec = "Premium options available"
            score = 0.60
            reasoning = "Budget is healthy. Premium recommendations unlocked."

        return AgentDecision(agent="BudgetAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Timing Agent
# --------------------------------------------------------------------------
class TimingAgent:
    """
    Optimizes when to place an order for best delivery ETA.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        timing_map = {
            "morning": ("Breakfast items (Idli, Poha, Upma)", 0.90, "Morning routine detected. Order now for 15-min delivery."),
            "afternoon": ("Lunch (Thali, Rice bowl)", 0.85, "Peak lunch hour. Ordering now avoids 6PM surge."),
            "evening": ("Snacks + Dinner (Chai + Biryani combo)", 0.88, "Evening wind-down. Pre-order dinner to arrive by 8PM."),
            "night": ("Late-night comfort (Noodles, Pizza)", 0.78, "Late hour detected. Limited restaurants, fast options prioritized."),
        }
        rec, score, reasoning = timing_map.get(
            ctx.time_of_day,
            ("Balanced meal", 0.70, "Default timing recommendation.")
        )
        return AgentDecision(agent="TimingAgent", recommendation=rec, score=score, reasoning=reasoning)


# --------------------------------------------------------------------------
# Social Coordination Agent
# --------------------------------------------------------------------------
class SocialAgent:
    """
    Handles group order logic — merging preferences, handling splits.
    """
    def evaluate(self, ctx: UserContext) -> AgentDecision:
        if ctx.group_size and ctx.group_size > 1:
            rec = f"Group order for {ctx.group_size} people — suggest shared platter + individual sides"
            score = 0.93
            reasoning = f"Group of {ctx.group_size} detected. Activating split payment and preference merge."
        else:
            rec = "Individual order"
            score = 0.70
            reasoning = "Solo session. Standard single-user recommendation."

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
