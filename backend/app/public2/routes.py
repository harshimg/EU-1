from fastapi import APIRouter, Depends
from typing import Optional
from app.public2.controllers import *
from app.auth.utils import get_current_user_optional
# from app.user.controllers import list_subjects          #it list all subjects which haven't credit also

router = APIRouter()



@router.get("/semester")
async def get_semesters():
    return await list_semesters()


@router.get("/branch")
async def get_brach():
    return await list_branches()

@router.get("/subjects")
async def get_subjects(semester_code: int, branch_code: str):
    return await list_subjects(str(semester_code), branch_code)

@router.post("/sgpa/calculate")
async def calculate_sgpa(body : dict, current_user: Optional[dict] = Depends(get_current_user_optional)):
    return await sgpa(body, current_user)