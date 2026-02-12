from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .database import init_db
from .api.routes import content, accounts, admin
from .services.scheduler import scheduler

logger = logging.getLogger(__name__)

# Initialize database on startup
def startup():
    init_db()
    logger.info("Database initialized")

    # Start background scheduler
    scheduler.start()
    logger.info("Background scheduler started")


def shutdown():
    scheduler.stop()
    logger.info("Background scheduler stopped")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    startup()
    yield
    # Shutdown
    shutdown()


# Create FastAPI app
app = FastAPI(
    title="Evergreen Content Tracker",
    description="Track and manage reusable Bitcoin conference content across social media",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["accounts"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])


@app.get("/")
async def root():
    return {
        "message": "Evergreen Content Tracker API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
