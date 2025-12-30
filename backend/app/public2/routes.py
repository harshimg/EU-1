from fastapi import APIRouter
from app.public2.controllers import *
from app.user.controllers import list_subjects

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
async def calculate_sgpa(body : dict):
    return await sgpa(body)