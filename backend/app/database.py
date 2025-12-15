from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """
    Connect to MongoDB when server starts
    """
    db_instance.client = AsyncIOMotorClient(settings.MONGO_URI)
    db_instance.db = db_instance.client[settings.MONGO_DB_NAME]
    print("🚀 Connected to MongoDB")

async def close_mongo_connection():
    """
    Close DB when server shuts down
    """
    db_instance.client.close()
    print("🛑 MongoDB connection closed")
