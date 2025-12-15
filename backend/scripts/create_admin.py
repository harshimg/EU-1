from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from app.auth.utils import hash_password
from app.config import settings
import asyncio

#python -m scripts.create_admin


async def create_admin():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.MONGO_DB_NAME]

    email = "admin@alpharesult.com"
    password = "12345"  # change later

    existing = await db.users.find_one({"email": email})
    if existing:
        print("❌ Admin already exists")
        return

    admin_doc = {
        "name": "admin1",
        "email": email,
        "password_hash": hash_password(password),
        "role": "admin",
        "login_type": "email",
        "is_verified": True,
        "created_at": datetime.now(timezone.utc)
    }

    await db.users.insert_one(admin_doc)
    print("✅ Admin created successfully")

    client.close()

asyncio.run(create_admin())
