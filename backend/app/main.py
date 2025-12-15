from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import connect_to_mongo, close_mongo_connection

# Import routers (for now empty, we add later)
from app.public.routes import router as public_router
from app.auth.routes import router as auth_router
from app.admin.routes import router as admin_router
from app.user.routes import router as user_router
from app.auth.google_routes import router as google_router
# from app.users.routes import router as user_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0"
)



origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://vigilon.vercel.app",           # production
    "https://alpharesult.vercel.app",
]

# CORS (Allows frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup & Shutdown Events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Root Route
@app.get("/")
def root():
    return {"message": "EU Study Backend Running 🚀"}

# All rotes api
app.include_router(public_router, prefix="/api/public", tags=["Public"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(user_router, prefix="/user", tags=['User'])
app.include_router(google_router, prefix="/auth/google", tags=["GoogleAuth"])
# app.include_router(user_router, prefix="/users", tags=["Users"])
