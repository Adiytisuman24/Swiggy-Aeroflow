"""
Grocery Depletion Forecasting Engine for Aeroflow
Predicts when household essentials will run out based on
consumption patterns and last purchase dates.
"""

from datetime import date, timedelta
from typing import List
from pydantic import BaseModel


class GroceryItem(BaseModel):
    name: str
    category: str
    last_purchased: str   # ISO date string YYYY-MM-DD
    quantity_remaining: float  # 0.0 to 1.0 (fraction of stock remaining)
    avg_daily_usage_rate: float  # fraction consumed per day


class DepletionForecast(BaseModel):
    item: str
    category: str
    days_until_depletion: int
    predicted_date: str
    urgency: str          # critical | soon | ok
    auto_order: bool


class DepletionEngine:
    """
    Core forecasting logic.
    Uses quantity_remaining / avg_daily_usage_rate to predict depletion.
    """

    URGENCY_THRESHOLDS = {
        "critical": 2,   # ≤ 2 days
        "soon": 5,       # ≤ 5 days
    }

    def forecast(self, items: List[GroceryItem]) -> List[DepletionForecast]:
        results = []
        today = date.today()

        for item in items:
            if item.avg_daily_usage_rate <= 0:
                continue

            days_left = int(item.quantity_remaining / item.avg_daily_usage_rate)
            predicted_date = today + timedelta(days=days_left)

            if days_left <= self.URGENCY_THRESHOLDS["critical"]:
                urgency = "critical"
                auto_order = True
            elif days_left <= self.URGENCY_THRESHOLDS["soon"]:
                urgency = "soon"
                auto_order = False
            else:
                urgency = "ok"
                auto_order = False

            results.append(DepletionForecast(
                item=item.name,
                category=item.category,
                days_until_depletion=days_left,
                predicted_date=str(predicted_date),
                urgency=urgency,
                auto_order=auto_order
            ))

        # Sort: critical first
        results.sort(key=lambda x: x.days_until_depletion)
        return results


# Default tracked household items for demo
DEFAULT_ITEMS = [
    GroceryItem(name="Milk", category="dairy", last_purchased="2026-05-06", quantity_remaining=0.15, avg_daily_usage_rate=0.14),
    GroceryItem(name="Eggs", category="protein", last_purchased="2026-05-04", quantity_remaining=0.25, avg_daily_usage_rate=0.10),
    GroceryItem(name="Bread", category="grains", last_purchased="2026-05-07", quantity_remaining=0.40, avg_daily_usage_rate=0.12),
    GroceryItem(name="Coffee", category="beverages", last_purchased="2026-05-01", quantity_remaining=0.60, avg_daily_usage_rate=0.05),
    GroceryItem(name="Butter", category="dairy", last_purchased="2026-05-03", quantity_remaining=0.10, avg_daily_usage_rate=0.06),
    GroceryItem(name="Rice 5kg", category="grains", last_purchased="2026-04-20", quantity_remaining=0.30, avg_daily_usage_rate=0.04),
    GroceryItem(name="Protein Powder", category="supplements", last_purchased="2026-05-01", quantity_remaining=0.20, avg_daily_usage_rate=0.03),
]
