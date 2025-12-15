from fastapi import APIRouter, Depends
from app.public.controllers import *

router = APIRouter()




@router.get("/semester")
async def get_semesters():
    return await list_semesters()


@router.get("/branch")
async def get_brach():
    return await list_branches()