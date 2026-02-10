"""Tulare County AI Chatbot — FastAPI Backend"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db.connection import close_pool, get_pool
from .routers import analytics, chat, health
from .services.routing import load_departments

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Tulare County Chatbot API")
    await get_pool()
    await load_departments()
    logger.info("Startup complete")
    yield
    # Shutdown
    await close_pool()
    logger.info("Shutdown complete")


app = FastAPI(
    title="Tulare County AI Chatbot API",
    description="AI-powered chatbot for Tulare County resident services",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://*.vercel.app",
        "https://arthurshafer.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(analytics.router)
