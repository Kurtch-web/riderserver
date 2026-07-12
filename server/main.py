from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import sensors, auth
from app.core.config import settings

app = FastAPI(
    title="Helmet SIVIR API",
    description="Smart Helmet Sensor System Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sensors.router, prefix="/api/sensors", tags=["sensors"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {
        "message": "Helmet SIVIR API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
