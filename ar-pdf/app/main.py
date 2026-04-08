from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.admin.routes import router as admin_router




app = FastAPI(
    title="Alpha Result PDF Tool",
    version="1.0.0"
)






# Root Route
@app.get("/")
def root():
    return {"message": "Alpha Result PDF Tool Backend Running 🚀"}


app.include_router(admin_router, prefix="/admin", tags=["Admin"])