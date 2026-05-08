from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import RecommendationEngine, UserContext

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
