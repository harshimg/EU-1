from bson import ObjectId
from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json
from datetime import datetime, timezone
from fastapi import HTTPException



async def list_semesters():
    sem = await db_instance.db.semesters.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(sem)}


async def list_branches():
    br = await db_instance.db.branches.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(br)}