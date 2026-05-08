from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import RecommendationEngine, UserContext
from depletion import DepletionEngine, GroceryItem, DEFAULT_ITEMS

app = FastAPI(
    title="Aeroflow AI Intelligence Layer",
    description="Multi-agent autonomous consumption intelligence system.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RecommendationEngine()
depletion_engine = DepletionEngine()


@app.get("/depletion/{user_id}")
async def get_depletion_forecast(user_id: str):
    """Forecast grocery depletion for a user based on default tracked items."""
    forecasts = depletion_engine.forecast(DEFAULT_ITEMS)
    return {
        "user_id": user_id,
        "forecasts": [f.model_dump() for f in forecasts],
        "total_tracked": len(DEFAULT_ITEMS),
        "critical_count": sum(1 for f in forecasts if f.urgency == "critical"),
    }


@app.post("/depletion/custom")
async def get_custom_depletion(items: list[GroceryItem]):
    """Forecast depletion for a custom list of grocery items."""
    forecasts = depletion_engine.forecast(items)
    return {"forecasts": [f.model_dump() for f in forecasts]}


@app.get("/")
async def root():
    return {"message": "Aeroflow AI Intelligence Layer is active", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy", "agents": ["NutritionAgent", "BudgetAgent", "TimingAgent", "SocialAgent"]}


@app.post("/orchestrate")
async def orchestrate(ctx: UserContext):
    """
    Core endpoint — runs all agents and returns aggregated recommendation.
    Score = αP + βC + γT + δB
    """
    result = engine.orchestrate(ctx)
    return result


@app.get("/predict/{user_id}")
async def predict(
    user_id: str,
    weather: str = "clear",
    time_of_day: str = "evening",
    recent_activity: str = "sedentary",
    budget_remaining: float = 500.0,
    schedule_load: str = "medium",
    group_size: int = 1
):
    """Quick GET endpoint for UI polling."""
    ctx = UserContext(
        user_id=user_id,
        weather=weather,
        time_of_day=time_of_day,
        recent_activity=recent_activity,
        budget_remaining=budget_remaining,
        schedule_load=schedule_load,
        group_size=group_size
    )
    return engine.orchestrate(ctx)
