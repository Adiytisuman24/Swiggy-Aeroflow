from fastapi import FastAPI

app = FastAPI(title="Aeroflow AI Intelligence Layer")

@app.get("/")
async def root():
    return {"message": "Aeroflow AI Intelligence Layer is active"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
