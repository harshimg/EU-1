from datetime import datetime, timezone
from bson import ObjectId

from dns import query
from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.auth.utils import get_current_user

class RoleUpdate(BaseModel):
    role: str


#----------------------To get all users----------------------------------------------
async def list_users(role: str | None = None, q: str | None = None, limit: int = 500):

    query = {}
    # 🔹 Role filter ONLY if explicitly provided
    if role:
        if role == "admin":
            query["role"] = {"$in": ["admin", "superalpha"]}
        else:
            query["role"] = role

     # 🔹 Search filter
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}},
            {"semester": {"$regex": q, "$options": "i"}},
            {"branch": {"$regex": q, "$options": "i"}},
            {"reg_no": {"$regex": q, "$options": "i"}},
        ]
    
    users = await db_instance.db.users.find(query, {"password_hash": 0}).sort("created_at", -1).limit(min(limit, 1000)).to_list(length=min(limit, 1000))

    return {"success": True,
        "data": mongo_to_json(users)
    }




#--------------To generate admin id--
async def generate_admin_userid():
    last = await (
        db_instance.db.users
        .find({"admin_userid": {"$regex": "^AR"}}, {"admin_userid": 1})
        .sort("admin_userid", -1)
        .limit(1)
        .to_list(1)
    )

    if not last:
        return "AR101"

    last_id = last[0]["admin_userid"]  # e.g. AR104
    num = int(last_id.replace("AR", ""))
    return f"AR{num + 1}"


#--------------To chagre role of user---------------------------
async def update_user_role(user_id: str, data: RoleUpdate):
    new_role = data.get("role")
    if new_role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = await db_instance.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🚫 protect superalpha
    if user["role"] == "superalpha":
        raise HTTPException(status_code=403, detail="Cannot change super Admin role")

    # if user_id == get_current_user._id:
    #     raise HTTPException(403, "Cannot change own role")

    
    if user["role"] == new_role:
        return {"success": True, "message": "Role unchanged"}


    update_data = {"role": new_role}      # Assign new role

    # 🔹 user → admin,------------------to gives admin id
    if new_role == "admin":
        if user.get("admin_userid"):
            # reuse old
            update_data["admin_userid"] = user["admin_userid"]
        else:
            # generate new
            new_admin_id = await generate_admin_userid()
            update_data["admin_userid"] = new_admin_id

    await db_instance.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    return {"success": True}

    

    
