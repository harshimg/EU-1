from fastapi import APIRouter, Depends
from app.auth.dependencies import superalpha_required
from app.sa.controllers import *

router = APIRouter()   

#------------all users-------------
@router.get("/users", dependencies=[Depends(superalpha_required)])
async def all_user(role: str | None = None, q: str | None = None, limit: int = 500):
    return await list_users(role, q, limit)


@router.patch("/users/{user_id}/role", dependencies=[Depends(superalpha_required)])
async def change_user_role(user_id: str, data: dict):
    return await update_user_role(user_id, data)
